// TODO: brush size
// TODO: improve move selection
// TODO: rotate selection
// TODO: scale selection
// TODO: stroke rect
// TODO: stroke circle
// TODO: bucket selection
// TODO: viewport scale for bigger sprites

window.pedit = (gconf) => {

const MIN_SCALE = 2;
const MAX_SCALE = 64;
const PADDING = 120;
const MAX_STATES = 64;
const VERSION = "0.1.0";

const icons = loadImg2("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOAAAAAQCAYAAAAPv3P4AAAAAXNSR0IArs4c6QAAAZ1JREFUaIHtmtuuAyEIRe1J//+X5zxNYijo5iKjLStp0jiKlIvo2NaKoiiKoih6LvI5lZN1P52p7V8ZWji5Wq6et9HonFI77ePRtXeYNP9MB++YCLJ9FgmXNJbfAtl+dyNpAki70nPykMCZ9fEEX8T8fT/K7v5+mtu2NO60PoVt/1YIEIUsGG/Fq1+UDjtUgHv+TF0Qu2p8FKW3V5bWp7DtpQSMYLSFQqD9VwcSKh9xhjUJ0flHRFRo6wIatUtZsUBaEoi2hcfgygT8dZ6ohJoAl7bgrX1uw2hb1DZZGst9R+aVxvXtq/3B2Ug8Su2agE8aMJLMJBwFLmdPqheiZ8a2dpTo1jMyunB4kfQT7bxrAn4TWUkoBS6XaLTPaHxPViBzFThCJkrUC6zpmD+DUBTPPZqk+ErHo063nu1Q2Z4+njPO3S7penXPrWjGRvp6212TVAG9Ckf8YO518MlkVkLPc7TPjNlisuou86i42Vo5JVFV1nMRjzBKwsiL+LoHtOHdYagWnnKIjPUN3E7sVglOe4lWFG7qv6BFURQc/9PedC4cH6XoAAAAAElFTkSuQmCC");
const font = loadImg2("data:image/png;base64,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");
const fontMap = {};

font.onload = () => {

	const fontChars = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~";
	const cols = font.width / 8;
	const chars = fontChars.split("");

	chars.forEach((ch, i) => {
		fontMap[ch] = [~~(i % cols), ~~(i / cols)];
	});

};

const toolData = {
	pen: {
		cursor: "crosshair",
		key: "q",
		icon: 0,
	},
	erasor: {
		cursor: "crosshair",
		key: "w",
		icon: 1,
	},
	bucket: {
		cursor: "crosshair",
		key: "e",
		icon: 2,
	},
	rect: {
		cursor: "crosshair",
		key: "a",
		icon: 3,
	},
	circle: {
		cursor: "crosshair",
		key: "s",
		icon: 4,
	},
	line: {
		cursor: "crosshair",
		key: "d",
		icon: 5,
	},
	select: {
		cursor: "cell",
		key: "z",
		icon: 6,
	},
	move: {
		cursor: "move",
		key: "x",
		icon: 7,
	},
	eyedropper: {
		cursor: "crosshair",
		key: "c",
		icon: 8,
	},
};

function loadImg(src) {

	const img = new Image();

	img.src = src;

	return new Promise((resolve, reject) => {
		img.onload = () => {
			resolve(img);
		};
		img.onerror = () => {
			reject();
		};
	});

}

function loadImg2(src, f) {
	const img = new window.Image();
	img.src = src;
	if (f) {
		img.onload = () => {
			f(img);
		};
	}
	return img;
}

function clamp(v, a, b) {
	return Math.max(Math.min(v, b), a);
}

function makeCanvasFromDataURL(src) {
	return loadImg(src).then((img) => {
		return makeCanvas(img);
	});
}

function makeCanvas(width, height) {

	const el = document.createElement("canvas");

	let img = (() => {
		if (width instanceof window.ImageData) {
			return new window.ImageData(
				new Uint8ClampedArray(width.data),
				width.width,
				width.height
			);
		} else if (width instanceof window.Image) {
			el.width = width.width;
			el.height = width.height;
			const ctx = el.getContext("2d");
			ctx.drawImage(width, 0, 0);
			return ctx.getImageData(0, 0, width.width, width.height);
		} else {
			return new window.ImageData(
				new Uint8ClampedArray(width * height * 4).fill(0),
				width,
				height,
			);
		}
	})();

	function updateEl() {

		el.width = img.width;
		el.height = img.height;

		const ctx = el.getContext("2d");

		ctx.putImageData(img, 0, 0);

	};

	function getIndex(x, y) {
		return y * 4 * img.width + x * 4;
	};

	const canvas = {

		blend: "alpha",
		scissorRect: null,

		width() {
			return img.width;
		},

		height() {
			return img.height;
		},

		toImageData() {
			return new window.ImageData(
				new Uint8ClampedArray(img.data),
				img.width,
				img.height,
			);
		},

		clone() {
			return makeCanvas(this.toImageData());
		},

		clear() {
			img = new window.ImageData(
				new Uint8ClampedArray(img.width * img.height * 4).fill(0),
				img.width,
				img.height,
			);
		},

		set(x, y, c) {

			if (!this.checkPt(x, y)) {
				return false;
			}

			const i = getIndex(x, y);

			switch (this.blend) {

				case "alpha": {

					const a = c[3] / 255;

					img.data[i + 0] = img.data[i + 0] * (1 - a) + c[0] * a;
					img.data[i + 1] = img.data[i + 1] * (1 - a) + c[1] * a;
					img.data[i + 2] = img.data[i + 2] * (1 - a) + c[2] * a;
					img.data[i + 3] = img.data[i + 3] * (1 - a) + c[3] * a;

					break;

				}

				case "replace":

					img.data[i + 0] = c[0];
					img.data[i + 1] = c[1];
					img.data[i + 2] = c[2];
					img.data[i + 3] = c[3];

					break;

				case "add": {

					const da = img.data[i + 3] / 255;
					const sa = c[3] / 255;

					img.data[i + 0] = img.data[i + 0] * da + c[0] * sa;
					img.data[i + 1] = img.data[i + 1] * da + c[1] * sa;
					img.data[i + 2] = img.data[i + 2] * da + c[2] * sa;
					img.data[i + 3] = img.data[i + 3] * da + c[3] * sa;

					break;

				}

			}

			return true;

		},

		get(x, y) {

			const i = getIndex(x, y);
			const r = img.data[i + 0];
			const g = img.data[i + 1];
			const b = img.data[i + 2];
			const a = img.data[i + 3];

			return [r, g, b, a];

		},

		line(x0, y0, x1, y1, c) {

			const dx = x1 - x0;
			const dy = y1 - y0;
			const adx = Math.abs(dx);
			const ady = Math.abs(dy);
			let eps = 0;
			const sx = dx > 0 ? 1 : -1;
			const sy = dy > 0 ? 1 : -1;

			if (adx > ady) {
				for (let x = x0, y = y0; sx < 0 ? x >= x1 : x <= x1; x += sx) {
					this.set(x, y, c);
					eps += ady;
					if (eps << 1 >= adx) {
						y += sy;
						eps -= adx;
					}
				}
			} else {
				for (let x = x0, y = y0; sy < 0 ? y >= y1 : y <= y1; y += sy) {
					this.set(x, y, c);
					eps += adx;
					if (eps << 1 >= ady) {
						x += sx;
						eps -= ady;
					}
				}
			}

		},

		fillRect(x, y, w, h, c) {

			if (w < 0) {
				x += w;
				w = -w;
			}

			if (h < 0) {
				y += h;
				h = -h;
			}

			for (let xx = x; xx < x + w; xx++) {
				for (let yy = y; yy < y + h; yy++) {
					this.set(xx, yy, c);
				}
			}

		},

		strokeRect(x, y, w, h, c) {

			if (w < 0) {
				x += w;
				w = -w;
			}

			if (h < 0) {
				y += h;
				h = -h;
			}

			this.line(x, y, x + w, y, c);
			this.line(x + w, y, x + w, y + h, c);
			this.line(x + w, y + h, x, y + h, c);
			this.line(x, y + h, x, y, c);

		},

		fillCircle(x, y, r, c) {

			r = Math.abs(r);

			for (let xx = x - r; xx <= x + r; xx++) {
				for (let yy = y - r; yy <= y + r; yy++) {
					const dist = Math.sqrt((xx - x) ** 2 + (yy - y) ** 2);
					if (dist <= r) {
						this.set(xx, yy, c);
					}
				}
			}

		},

		bucket(x, y, color) {

			if (!this.checkPt(x, y)) {
				return false;
			}

			const target = this.get(x, y);

			if (colorEq(target, color)) {
				return false;
			}

			const stack = [];

			stack.push([x, y]);

			while (stack.length) {

				const [x, y] = stack.pop();

				if (!this.checkPt(x, y)) {
					continue;
				}

				if (!colorEq(this.get(x, y), target)) {
					continue;
				}

				this.set(x, y, color);
				stack.push([x, y - 1]);
				stack.push([x - 1, y]);
				stack.push([x + 1, y]);
				stack.push([x, y + 1]);

			}

			return true;

		},

		merge(other, x = 0, y = 0) {
			for (let i = 0; i < img.width; i++) {
				for (let j = 0; j < img.height; j++) {
					const c = other.get(i, j);
					if (
						c
						&& i + x >= 0 && i + x < img.width
						&& j + y >= 0 && j + y < img.height
					) {
						this.set(i + x, j + y, c);
					}
				}
			}
		},

		checkPt(x, y) {
			if (this.scissorRect) {
				const r = this.scissorRect;
				return x >= r[0][0] && x < r[1][0] && y >= r[0][1] && y < r[1][1];
			}
			return x >= 0 && x < img.width && y >= 0 && y < img.height;
		},

		clampPt(pt) {
			return [clamp(pt[0], 0, img.width), clamp(pt[1], 0, img.height)];
		},

		// TODO: smarter
		// get the bounding box of content
		bbox() {

			let p1 = [0, 0];
			let p2 = [img.width - 1, img.height - 1];

			loopX:
			for (let x = p1[0]; x <= p2[0]; x++) {
				loopY:
				for (let y = p1[1]; y <= p2[1]; y++) {
					const i = getIndex(x, y);
					if (img.data[i + 3] !== 0) {
						p1[0] = x;
						break loopX;
					}
				}
			}

			loopX:
			for (let x = p2[0]; x >= p1[0]; x--) {
				loopY:
				for (let y = p1[1]; y <= p2[1]; y++) {
					const i = getIndex(x, y);
					if (img.data[i + 3] !== 0) {
						p2[0] = x;
						break loopX;
					}
				}
			}

			loopY:
			for (let y = p1[1]; y <= p2[1]; y++) {
				loopX:
				for (let x = p1[0]; x <= p2[0]; x++) {
					const i = getIndex(x, y);
					if (img.data[i + 3] !== 0) {
						p1[1] = y;
						break loopY;
					}
				}
			}

			loopY:
			for (let y = p2[1]; y >= p1[1]; y--) {
				loopX:
				for (let x = p1[0]; x <= p2[0]; x++) {
					const i = getIndex(x, y);
					if (img.data[i + 3] !== 0) {
						p2[1] = y;
						break loopY;
					}
				}
			}

			return [ p1, p2 ];

		},

		crop(p1, p2) {

			const w = p2[0] - p1[0] + 1;
			const h = p2[1] - p1[1] + 1;
			const newCanvas = makeCanvas(w, h);

			for (let x = p1[0]; x <= p2[0]; x++) {
				for (let y = p1[1]; y <= p2[1]; y++) {
					newCanvas.set(x - p1[0], y - p1[1], this.get(x, y));
				}
			}

			img = newCanvas.toImageData();

		},

		toDataURL() {
			updateEl();
			return el.toDataURL("image/png");
		},

		toPNG() {
			const base64Str = this.toDataURL().replace(/^data:image\/png;base64,/, '');
			const binStr = window.atob(base64Str);
			const bytes = new Uint8Array(binStr.length);
			for (let i = 0; i < bytes.length; i++) {
				bytes[i] = binStr.charCodeAt(i);
			}
			return bytes.buffer;
		},

		drawable() {
			updateEl();
			return el;
		}

	};

	return canvas;

}

function colorEq(c1, c2) {
	return c1[0] === c2[0] && c1[1] === c2[1] && c1[2] === c2[2] && c1[3] === c2[3];
}

function colorCSS(c) {
	return `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${c[3]})`;
}

function hex2rgb(hex) {
	const val = parseInt(hex, 16);
	const r = (val >> 16) & 255;
	const g = (val >> 8) & 255;
	const b = val & 255;
	return [r, g, b, 255];
}

const canvasEl = gconf.canvas;
const ctx = gconf.canvas.getContext("2d");

// serializable editor state
const ed = {

	width: gconf.width,
	height: gconf.height,

	// frames
	curFrame: 0,
	frames: [
		makeCanvas(gconf.width, gconf.height)
	],

	// tmp buffer
	fCanvas: makeCanvas(gconf.width, gconf.height),

	// anim
	anims: {},

	tool: "pen",
	color: [0, 0, 0, 255],
	palette: gconf.palette || [
		[0, 0, 0, 255],
		[255, 255, 255, 255],
		[255, 255, 128, 255],
		[255, 128, 255, 255],
		[0, 128, 128, 255],
		[128, 0, 255, 255],
		[255, 0, 128, 255],
		[0, 255, 255, 255],
	],

	// viewport state
	view: {
		offset: [0, 0],
		scale: 1,
	},

	// undo / redo states
	// TODO: use linked list?
	state: {
		stack: [],
		offset: 0,
	},

	modified: false,
	readOnly: false,

	events: {},

	animPlaying: null,

};

// discardable session state
const session = {
	mouseDown: false,
	mousePressed: false,
	mouseMoved: false,
	mousePos: [0, 0],
	mousePosPrev: [0, 0],
	mouseStartPos: null,
	grabbin: false,
	delCb: () => {},
	hideUI: false,
	loopID: null,
};

scaleFit();
ctx.imageSmoothingEnabled = false;

const actions = {
	export: {
		icon: 13,
		action: () => {
			trigger("export");
		},
	},
	save: {
		icon: 12,
		action: () => {
			trigger("save");
		},
	},
	crop: {
		icon: 9,
		action: crop,
	},
	undo: {
		icon: 10,
		key: "shift+z",
		action: undo,
	},
	redo: {
		icon: 11,
		key: "meta+shift+z",
		action: redo,
	},
};

const colorSelDom = document.createElement("input");

colorSelDom.type = "color";

colorSelDom.addEventListener("change", (e) => {
	const c = hex2rgb(e.target.value.substring(1))
	ed.palette.push(c);
	setColor(c);
	trigger("change", ed.palette);
});

function crop() {

	let p1;
	let p2;

	// find the biggest bbox of all frames
	ed.frames.forEach(c => {
		const [ pp1, pp2 ] = c.bbox();
		if (p1 && p2) {
			p1[0] = Math.min(p1[0], pp1[0]);
			p1[1] = Math.min(p1[1], pp1[0]);
			p2[0] = Math.max(p2[0], pp2[0]);
			p2[1] = Math.max(p2[1], pp2[0]);
		} else {
			p1 = pp1;
			p2 = pp2;
		}
	});

	ed.frames.forEach(c => c.crop(p1, p2));
	ed.width = curFrame().width();
	ed.height = curFrame().height();
	pushState();

}

function toCanvasPos(pt) {
	const x = ~~((pt[0] - ed.view.offset[0]) / ed.view.scale);
	const y = ~~((pt[1] - ed.view.offset[1]) / ed.view.scale);
	return [x, y];
}

// TODO: scale according to cursor instead of center
function scaleDown() {

	if (ed.view.scale <= MIN_SCALE) {
		return;
	}

	ed.view.scale--;
	ed.view.offset[0] += ed.width / 2;
	ed.view.offset[1] += ed.height / 2;

}

function scaleUp() {

	if (ed.view.scale >= MAX_SCALE) {
		return;
	}

	ed.view.scale++;
	ed.view.offset[0] -= ed.width / 2;
	ed.view.offset[1] -= ed.height / 2;

}

// scale viewport to the fittest
function scaleFit() {

	const cw = canvasEl.width;
	const ch = canvasEl.height;
	const sw = (cw - PADDING) / ed.width;
	const sh = (ch - PADDING) / ed.height;

	ed.view.scale = ~~Math.min(sw, sh);

	ed.view.offset = [
		(cw - ed.width * ed.view.scale) / 2,
		(ch - ed.height * ed.view.scale) / 2,
	];

}

function newFrame(n = ed.curFrame) {
	ed.frames.splice(ed.curFrame, 0, curFrame().clone());
	if (n === ed.curFrame) {
		ed.curFrame++;
	}
	pushState();
}

function delFrame(n = ed.curFrame) {

	if (ed.frames.length > 1) {
		ed.frames.splice(n, 1);
		if (ed.curFrame === ed.frames.length) {
			setFrame(ed.frames.length - 1);
		}
	}

	pushState();

}

function setFrame(n) {
	ed.curFrame = n;
	session.delCb = () => {
		if (confirm(`removed frame ${n}?`)) {
			delFrame(n);
		}
	};
}

function setColor(c) {
	ed.color = c;
	session.delCb = () => {
		if (confirm("remove selected color?")) {
			ed.palette = ed.palette.filter(c => !colorEq(c, ed.color));
			trigger("change", ed.palette);
		}
	}
}

function prevFrame() {
	setFrame(ed.curFrame === 0 ? ed.frames.length - 1 : ed.curFrame - 1);
}

function nextFrame() {
	setFrame((ed.curFrame + 1) % ed.frames.length);
}

function mouseInRect(x, y, w, h) {

	if (w < 0) {
		x += w;
		w = -w;
	}

	if (h < 0) {
		y += h;
		h = -h;
	}

	const [mx, my] = session.mousePos;

	return mx >= x && mx <= x + w && my >= y && my <= y + h;

}

function deleteSelection() {

	const canvas = curFrame();
	const [p1, p2] = canvas.scissorRect;

	canvas.blend = "replace";
	canvas.fillRect(p1[0], p1[1], p2[0] - p1[0], p2[1] - p1[1], [0, 0, 0, 0]);
	canvas.blend = "alpha";
	pushState();

}

function trigger(ev, ...args) {
	if (!ed.events[ev]) {
		return;
	}
	for (const f of ed.events[ev]) {
		f(...args);
	}
}

function pushState() {

	if (ed.state.stack.length >= MAX_STATES) {
		return;
	}

	if (ed.state.offset > 0) {
		ed.state.stack.splice(ed.state.stack.length - ed.state.offset, ed.state.offset);
		ed.state.offset = 0;
	}

	ed.state.stack.push({
		frames: frameData(),
		curFrame: ed.curFrame,
	});

	trigger("change");

}

function applyState(state) {
	ed.frames = state.frames.map((f) => {
		return makeCanvas(f);
	});
	ed.curFrame = state.curFrame;
	trigger("change");
}

function undo() {

	if (ed.state.offset >= ed.state.stack.length - 1) {
		return;
	}

	ed.state.offset++;
	applyState(ed.state.stack[ed.state.stack.length - ed.state.offset - 1]);

	if (ed.curFrame >= ed.frames.length) {
		ed.curFrame = ed.frames.length - 1;
	}

}

function redo() {

	if (ed.state.offset === 0) {
		return;
	}

	ed.state.offset--;
	applyState(ed.state.stack[ed.state.stack.length - ed.state.offset - 1]);

}

// get all frames pure data
function frameData() {
	return ed.frames.map(f => f.toImageData());
}

function playAnim(name) {
	ed.animPlaying = name;
	ed.readOnly = true;
}

function stopAnim(name) {
	ed.animPlaying = null;
	ed.readOnly = false;
}

function update(time) {

	let hovering = false;
	let mousePressProcessed = false;
	let tooltip = null;
	const canvas = curFrame();
	const cw = canvasEl.width;
	const ch = canvasEl.height;
	const s = ed.view.scale;
	const ox = ed.view.offset[0];
	const oy = ed.view.offset[1];

	function rect(w, h, conf = {}) {

		const lineWidth = conf.lineWidth || 2;
		let pos;

		return {

			width: w,
			height: h,

			update() {

				if (!pos) {
					return;
				}

				if (conf.click || conf.hover) {
					if (mouseInRect(pos.x, pos.y, w, h)) {
						hovering = true;
						conf.hover && conf.hover();
						if (session.mousePressed && !mousePressProcessed) {
							conf.click && conf.click();
							mousePressProcessed = true;
						}
					}
				}

			},

			draw() {

				pos = ctx.getTransform().transformPoint();
				this.update();

				if (conf.bg) {
					ctx.fillStyle = colorCSS(conf.bg);
					ctx.fillRect(0, 0, w, h);
				}

				if (conf.border) {
					ctx.lineWidth = lineWidth;
					ctx.strokeStyle = colorCSS(conf.border);
					ctx.strokeRect(0, 0, w, h);
				}

			},

		};

	}

	function vstack(list, conf = {}) {

		const align = conf.align || "left";
		const margin = conf.margin || 0;
		const padding = conf.padding || 0;
		let cw = 0;
		let ch = 0;

		for (const item of list) {
			cw = Math.max(item.width, cw);
			ch += item.height + margin;
		}

		const bw = cw + padding * 2;
		const bh = ch + padding * 2;
		const area = rect(bw, bh, conf);

		return {

			width: bw,
			height: bh,

			update() {
				list.reverse().forEach((item) => {
					item.update();
				});
			},

			draw() {

				area.draw();
				ctx.save();
				ctx.translate(padding, padding);

				list.forEach((item) => {

					const offset = (() => {
						switch (align) {
							case "left":   return 0;
							case "center": return (cw - item.width) / 2;
							case "left":   return (cw - item.width);
						}
					})();

					ctx.translate(offset, 0);
					item.draw();
					ctx.translate(-offset, item.height + margin);

				});

				ctx.restore();

			},

		};

	}

	function hstack(list, conf = {}) {

		const align = conf.align || "top";
		const margin = conf.margin || 0;
		const padding = conf.padding || 0;
		let cw = 0;
		let ch = 0;

		for (const item of list) {
			cw += item.width;
			ch = Math.max(item.height, ch);
		}

		const bw = cw + padding * 2;
		const bh = ch + padding * 2;
		const area = rect(bw, bh, conf);

		return {

			width: bw,
			height: bh,

			update() {
				list.reverse().forEach((item) => {
					item.update();
				});
			},

			draw() {

				area.draw();
				ctx.save();
				ctx.translate(padding, padding);

				list.forEach((item) => {

					const offset = (() => {
						switch (align) {
							case "top":    return 0;
							case "center": return (ch - padding * 2 - item.height) / 2;
							case "bottom": return (ch - padding * 2 - item.height);
						}
					})();

					ctx.translate(0, offset);
					item.draw();
					ctx.translate(item.width + margin, -offset);

				});

				ctx.restore();

			},

		};

	}

	function img(src, conf = {}) {

		const padding = conf.padding || 0;
		const sw = conf.sw || src.width;
		const sh = conf.sh || src.height;
		const cw = (conf.width || sw) + padding * 2;
		const ch = (conf.height || sh) + padding * 2;
		const bw = cw + padding * 2;
		const bh = ch + padding * 2;
		const sx = conf.sx || 0;
		const sy = conf.sy || 0;
		const lineWidth = conf.lineWidth || 2;
		const area = rect(bw, bh, conf);

		return {

			width: bw,
			height: bh,

			update() {
				area.update();
			},

			draw() {

				area.draw();

				ctx.drawImage(
					src,
					sx, sy,
					sw, sh,
					padding, padding,
					cw, ch
				);

			},

		};

	}

	function text(content, conf = {}) {

		content += "";
		const size = conf.size || 12;
		const padding = conf.padding || 0;
		const cw = content.length * size;
		const ch = size;
		const bw = cw + padding * 2;
		const bh = ch + padding * 2;
		const color = conf.color || [0, 0, 0, 255];
		const lineWidth = conf.lineWidth || 2;
		const area = rect(bw, bh, conf);

		return {

			width: bw,
			height: bh,

			update() {
				area.update();
			},

			draw() {

				area.draw();
				ctx.fillStyle = colorCSS(color);

				const chars = content.split("");
				let x = 0;

				for (const ch of chars) {
					if (fontMap[ch]) {
						const [col, row] = fontMap[ch];
						ctx.drawImage(
							font,
							8 * col, 8 * row,
							8, 8,
							padding + x, padding,
							size, size
						);
						x += size;
					}
				}

			},

		};

	}

	function move(x, y, item, conf = {}) {

		return {

			width: item.width,
			height: item.height,

			update() {
				item.update();
			},

			draw() {
				ctx.save();
				ctx.translate(x, y);
				item.draw();
				ctx.restore();
			},

		};

	}

	function draw(obj, x, y) {
		if (x || y) {
			move(x, y, obj).draw();
		} else {
			obj.draw();
		}
	}

	// absolute frame
	function aframe(w, h, list, conf = {}) {

		const area = rect(w, h, conf);

		return {

			width: w,
			height: h,

			update() {
				list.reverse().forEach(([ item, ]) => {
					item.update();
				});
			},

			draw() {

				area.draw();

				list.forEach(([ item, [ x, y ] ]) => {

					ctx.save();
					ctx.translate(x, y);
					item.draw();
					ctx.restore();

				});

			},

		};

	}

	// propotinal frame
	function pframe(w, h, list, conf = {}) {
		return aframe(w, h, list.map(([item, pos]) => {
			return [item, [pos[0] * (w - item.width), pos[1] * (h - item.height)]];
		}), conf);
	}

	// bg
	const bgUI = rect(cw, ch, {
		bg: [170, 170, 170, 255],
	});

	const frameNumUI = hstack([
		...ed.frames.map((_, i) => {
			const cur = i === ed.curFrame;
			return text(i, {
				padding: cur ? 6 : 3,
				bg: cur ? [255, 255, 255, 255] : [230, 230, 230, 255],
				border: [0, 0, 0, 255],
				size: 16,
				click() {
					setFrame(i);
				},
			});
		}),
		text("+", {
			padding: 3,
			bg: [230, 230, 230, 255],
			border: [0, 0, 0, 255],
			size: 16,
			click() {
				newFrame();
			},
		}),
	], { align: "bottom", });

	const canvasBgUI = rect(canvas.width() * s, canvas.height() * s, {
		bg: [255, 255, 255, 255],
	});

	const canvasBorderUI = rect(canvas.width() * s, canvas.height() * s, {
		border: [0, 0, 0, 255],
	});

	function ucanvas(ca, conf = {}) {
		const dx = conf.dx || 0;
		const dy = conf.dy || 0;
		return {
			width: ca.width() * s,
			height: ca.height() * s,
			draw() {
				ctx.save();
				ctx.scale(s, s);
				ctx.translate(dx, dy);
				ctx.drawImage(ca.drawable(), 0, 0);
				ctx.restore();
			},
		};
	}

	const canvasUI = ucanvas(canvas);

	const fCanvasUI = (() => {
		if (ed.tool === "move" && session.mouseStartPos) {
			const [cx, cy] = toCanvasPos(session.mousePos);
			const [scx, scy] = toCanvasPos(session.mouseStartPos);
			const [dcx, dcy] = [ cx - scx, cy - scy ];
			return ucanvas(ed.fCanvas, {
				dx: dcx,
				dy: dcy,
			});
		} else {
			return ucanvas(ed.fCanvas);
		}
	})();

	aframe(cw, ch, [
		[ bgUI,           [ 0,  0 ] ],
		[ canvasBgUI,     [ ox, oy ] ],
		[ canvasUI,       [ ox, oy ] ],
		[ fCanvasUI,      [ ox, oy ] ],
		[ frameNumUI,     [ ox, oy - frameNumUI.height ] ],
		[ canvasBorderUI, [ ox, oy ] ],
	]).draw();

	// draw selection
	if (canvas.scissorRect) {

		const p1 = canvas.scissorRect[0];
		const p2 = canvas.scissorRect[1];

		ctx.lineDashOffset = time / 100;
		ctx.strokeStyle = colorCSS([0, 0, 0, 255]);
		ctx.setLineDash([5, 5]);
		ctx.strokeRect(
			p1[0] * s + ox,
			p1[1] * s + oy,
			(p2[0] - p1[0]) * s,
			(p2[1] - p1[1]) * s,
		);

		ctx.strokeStyle = colorCSS([255, 255, 255, 255]);
		ctx.setLineDash([0, 5, 5, 0]);
		ctx.strokeRect(
			p1[0] * s + ox,
			p1[1] * s + oy,
			(p2[0] - p1[0]) * s,
			(p2[1] - p1[1]) * s,
		);

		ctx.setLineDash([]);

	}

	// cursor
	{

		const [mx, my] = toCanvasPos(session.mousePos);
		const px = mx * s + ox;
		const py = my * s + oy;

		if (canvas.checkPt(mx, my)) {
			switch (ed.tool) {
				case "pen":
				case "rect":
				case "line":
				case "circle":
				case "bucket":
					draw(rect(s, s, {
						bg: ed.color,
					}), px, py);
					break;
				case "erasor":
					draw(rect(s, s, {
						bg: [255, 255, 255, 255],
						border: [0, 0, 0, 255],
					}), px, py);
					break;
			}
		}

	}

	const style = {
		padding: 3,
		size: 16,
		bg: [255, 255, 255, 255],
		border: [0, 0, 0, 255],
	};

	const paletteUI = vstack([
		...ed.palette.map((c) => {
			return rect(24, 24, {
				bg: c,
				border: [0, 0, 0, 255],
				lineWidth: colorEq(c, ed.color) ? 4 : 2,
				click() {
					setColor(c);
				},
			});
		}),
		text("+", {
			size: 24,
			bg: [255, 255, 255, 255],
			border: [0, 0, 0, 255],
			click() {
				// TODO: not working on safari
				colorSelDom.click();
			},
		}),
	]);

	const toolsUI = vstack([
		...Object.keys(toolData).map((tool) => {
			const data = toolData[tool];
			return img(icons, {
				sx: 16 * data.icon,
				sw: 16,
				sh: 16,
				width: 32,
				height: 32,
				bg: [255, 255, 255, 255],
				border: [0, 0, 0, 255],
				lineWidth: ed.tool === tool ? 4 : 2,
				click() {
					ed.tool = tool;
				},
				hover() {
					tooltip = {
						msg: `${tool} (${data.key})`,
						pos: [-1, 1],
					};
				},
			});
		}),
	]);

	const actionsUI = hstack([
		...Object.keys(actions).map((name) => {
			const action = actions[name];
			return img(icons, {
				sx: 16 * action.icon,
				sw: 16,
				sh: 16,
				width: 32,
				height: 32,
				bg: [255, 255, 255, 255],
				border: [0, 0, 0, 255],
				click() {
					action.action();
				},
				hover() {
					tooltip = {
						msg: `${name}`,
						pos: [-1, -1],
					};
				},
			});
		}),
	]);

	const animsUI = vstack([
		text("+", {
			...style,
			click() {
				const name = prompt("anim name:");
				if (name) {
					ed.anims[name] = [0, 0];
					trigger("change");
				}
			},
		}),
		...Object.keys(ed.anims).map((name) => {
			const bound = ed.anims[name];
			return hstack([
				text(name, {
					...style,
					click() {
						playAnim(name);
					},
				}),
				text(bound[0], {
					...style,
					click() {
						bound[0] = (bound[0] + 1) % ed.frames.length;
						trigger("change");
					},
				}),
				text(bound[1], {
					...style,
					click() {
						bound[1] = (bound[1] + 1) % ed.frames.length;
						trigger("change");
					},
				}),
			]);
		}),
	]);

	if (!session.hideUI) {
		pframe(cw, ch, [
			[ paletteUI, [ 0, 0 ], ],
			[ toolsUI,   [ 1, 0 ], ],
			[ actionsUI, [ 1, 1 ], ],
			[ animsUI,   [ 0, 1 ], ],
		]).draw();
	}

	// tooltip
	if (tooltip) {

		const margin = 6;
		const [mx, my] = session.mousePos;

		const tooltipUI = text(tooltip.msg, {
			padding: 3,
			bg: [255, 255, 255, 255],
			border: [0, 0, 0, 255],
		});

		// calculate tooltip position offset
		const px = tooltipUI.width * (tooltip.pos[0] - 1) / 2 + tooltip.pos[0] * margin;
		const py = tooltipUI.height * (tooltip.pos[1] - 1) / 2 + tooltip.pos[1] * margin;

		draw(tooltipUI, mx + px, my + py);

	}

	if (hovering) {
		canvasEl.style.cursor = "pointer";
	} else if (session.grabbin) {
		canvasEl.style.cursor = "grab";
	} else {
		canvasEl.style.cursor = toolData[ed.tool].cursor;
	}

	if (session.mousePressed && !mousePressProcessed) {

		const [cx, cy] = toCanvasPos(session.mousePos);

		session.mouseDown = true;

		switch (ed.tool) {

			case "pen": {
				canvas.set(cx, cy, ed.color);
				break;
			}

			case "erasor": {
				canvas.blend = "replace";
				canvas.set(cx, cy, [0, 0, 0, 0]);
				canvas.blend = "alpha";
				break;
			}

			case "bucket": {
				canvas.bucket(cx, cy, ed.color);
				break;
			}

			case "move": {
				if (canvas.scissorRect) {
					// TODO: only copy the parts inside
					ed.fCanvas.scissorRect = canvas.scissorRect;
					ed.fCanvas.merge(canvas);
					ed.fCanvas.scissorRect = null;
					deleteSelection();
				}
				break;
			}

			case "eyedropper": {
				// TODO: jump back to prev tool
				ed.color = canvas.get(cx, cy);
				break;
			}

		}

	}

	session.mousePressed = false;
	session.loopID = window.requestAnimationFrame(update);

}

session.loopID = window.requestAnimationFrame(update);

const events = {

	wheel(e) {
		e.preventDefault();
		if (e.altKey) {
			if (e.deltaY < 0) {
				scaleUp();
			} else if (e.deltaY > 0) {
				scaleDown();
			}
		} else {
			ed.view.offset[0] -= e.deltaX;
			ed.view.offset[1] -= e.deltaY;
		}
	},

	mousedown(e) {
		session.mousePressed = true;
		session.mousePosPrev = [...session.mousePos];
		session.mousePos = [e.offsetX, e.offsetY];
		session.mouseStartPos = [...session.mousePos];
	},

	mousemove(e) {

		session.mousePosPrev = [...session.mousePos];
		session.mousePos = [e.offsetX, e.offsetY];
		session.mouseMoved = true;

		if (session.grabbin) {
			ed.view.offset[0] += e.movementX;
			ed.view.offset[1] += e.movementY;
		}

		if (!session.mouseDown) {
			return;
		}

		const canvas = curFrame();
		const [cx, cy] = toCanvasPos(session.mousePos);
		const [pcx, pcy] = toCanvasPos(session.mousePosPrev);
		const [scx, scy] = toCanvasPos(session.mouseStartPos);

		switch (ed.tool) {
			case "pen":
				canvas.line(pcx, pcy, cx, cy, ed.color);
				break;
			case "erasor":
				canvas.blend = "replace";
				canvas.line(pcx, pcy, cx, cy, [0, 0, 0, 0]);
				canvas.blend = "alpha";
				break;
			case "rect":
				ed.fCanvas.clear();
				ed.fCanvas.fillRect(scx, scy, cx - scx, cy - scy, ed.color);
				break;
			case "line":
				ed.fCanvas.clear();
				ed.fCanvas.line(scx, scy, cx, cy, ed.color);
				break;
			case "circle":
				ed.fCanvas.clear();
				ed.fCanvas.fillCircle(scx, scy, Math.max(cx - scx, cy - scy), ed.color);
				break;
			case "select": {
				const [cscx, cscy] = canvas.clampPt([scx, scy]);
				const [dcx, dcy] = canvas.clampPt([cx, cy]);
				canvas.scissorRect = [
					[cscx, cscy],
					[dcx, dcy],
				];
				break;
			}
			case "move": {
				const [dcx, dcy] = [ cx - pcx, cy - pcy ];
				canvas.scissorRect[0][0] += dcx;
				canvas.scissorRect[1][0] += dcx;
				canvas.scissorRect[0][1] += dcy;
				canvas.scissorRect[1][1] += dcy;
				break;
			}
		}

	},

	mouseup(e) {

		session.mouseDown = false;
		session.mousePosPrev = [session.mousePos, session.mousePos];
		session.mousePos = [e.offsetX, e.offsetY];

		const canvas = curFrame();
		const [cx, cy] = toCanvasPos(session.mousePos);
		// TODO: sometimes mouseStartPos is null (mouseup fired without any mousedown before)
		const [scx, scy] = toCanvasPos(session.mouseStartPos);

		session.mouseStartPos = null;

		// TODO: only pushState() if actually changed
		switch (ed.tool) {
			case "pen":
			case "erasor":
			case "bucket":
				pushState();
				break;
			case "rect":
			case "circle":
			case "line":
				canvas.merge(ed.fCanvas);
				ed.fCanvas.clear();
				pushState();
				break;
			case "move":
				if (canvas.scissorRect) {
					const [dcx, dcy] = [ cx - scx, cy - scy ];
					canvas.merge(ed.fCanvas, dcx, dcy);
					ed.fCanvas.clear();
					pushState();
				}
				break;
		}

	},

	keydown(e) {

		if (!e.metaKey) {
			for (const tool in toolData) {
				const data = toolData[tool];
				if (data.key === e.key) {
					ed.tool = tool;
					return;
				}
			}
		}

		const canvas = curFrame();

		switch (e.key) {
			case "-":
				scaleDown();
				break;
			case "=":
				scaleUp();
				break;
			case "1":
			case "2":
			case "3":
			case "4":
			case "5":
			case "6":
			case "7":
			case "8":
			case "9":
				setColor(ed.palette[parseInt(e.key, 10) - 1] || ed.color);
				break;
			case "0":
				scaleFit();
				break;
			case "+":
				newFrame();
				break;
			case "_":
				delFrame();
				break;
			case "ArrowLeft":
				prevFrame();
				break;
			case "ArrowRight":
				nextFrame();
				break;
			case "z":
				if (e.metaKey) {
					e.preventDefault();
					if (e.shiftKey) {
						redo();
					} else {
						undo();
					}
				}
				break;
			case "s":
				if (e.metaKey) {
					e.preventDefault();
					trigger("save");
				}
				break;
			case "l":
				if (e.metaKey) {
					e.preventDefault();
					trigger("load");
				}
				break;
			case " ":
				session.grabbin = true;
				e.preventDefault();
				break;
			case "Backspace":
				if (canvas.scissorRect) {
					deleteSelection();
					canvas.scissorRect = null;
				} else {
					session.delCb();
				}
				break;
			case "Escape":
				canvas.scissorRect = null;
				break;
			case "Tab":
				e.preventDefault();
				session.hideUI = !session.hideUI;
				break;
		}

	},

	keyup(e) {
		switch (e.key) {
			case " ":
				session.grabbin = false;
				break;
		}
	},

};

canvasEl.onselectstart = () => {
	return false;
};

for (const e in events) {
	canvasEl.addEventListener(e, events[e]);
}

function frames() {
	return ed.frames;
}

function curFrame() {
	return ed.frames[ed.curFrame];
}

function on(ev, f) {
	if (!ed.events[ev]) {
		ed.events[ev] = [];
	}
	ed.events[ev].push(f);
}

function setTool(tool) {
	if (!toolData[tool]) {
		throw new Error(`no tool called ${tool} bro`);;
	}
	ed.tool = tool;
}

function setPalette(palette) {
	ed.palette = palette;
}

function save() {
	return {
		version: VERSION,
		width: ed.width,
		height: ed.height,
		palette: ed.palette,
		anims: ed.anims,
		frames: ed.frames.map(f => f.toDataURL()),
	};
}

function load(data) {

	ed.width = data.width;
	ed.height = data.height;
	ed.palette = data.palette;
	ed.anims = data.anims;

	ed.curFrame = 0;
	ed.frames.length = data.frames.length;

	return Promise.all(data.frames.map((f, i) => {
		return makeCanvasFromDataURL(f).then((canvas) => {
			ed.frames[i] = canvas;
		});
	})).then(() => {
		initStack();
		scaleFit();
	});


}

function downloadBlob(name, ...args) {
	const url = URL.createObjectURL(new Blob(...args));
	const link = document.createElement("a");
	link.href = url;
	link.download = name;
	link.click();
}

function download(name) {
	downloadBlob(name, [JSON.stringify(save())]);
}

function downloadPNG(name) {
	downloadBlob(name, [curFrame().toPNG()]);
}

function cleanUp() {
	for (const e in events) {
		canvasEl.removeEventListener(e, events[e]);
	}
	window.cancelAnimationFrame(session.loopID);
};

function initStack() {
	ed.state.stack = [
		{
			frames: frameData(),
			curFrame: ed.curFrame,
		},
	];
}

initStack();

if (gconf.data) {
	load(gconf.data);
}

return {
	frames,
	curFrame,
	on,
	setTool,
	setColor,
	setPalette,
	save,
	load,
	undo,
	redo,
	pushState,
	scaleUp,
	scaleDown,
	scaleFit,
	newFrame,
	delFrame,
	prevFrame,
	nextFrame,
	download,
	downloadPNG,
	cleanUp,
};

};
