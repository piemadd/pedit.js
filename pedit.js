// TODO: make work without any browser stuff
// TODO: separate init code and functions
// TODO: brush size
// TODO: custom color
// TODO: improve move selection
// TODO: rotate selection
// TODO: scale selection
// TODO: stroke rect
// TODO: stroke circle
// TODO: bucket selection
// TODO: cleaner action management
// TODO: putImageData() instead of fillRect()

const MIN_SCALE = 2;
const MAX_SCALE = 64;
const PADDING = 120;
const MAX_STATES = 64;

const icons = loadImg("iVBORw0KGgoAAAANSUhEUgAAAMAAAAAQCAYAAABA4nAoAAAAAXNSR0IArs4c6QAAAXpJREFUaIHtmlEOwyAIQO2y+1/ZfTVzVBAQKXa8ZEm1KhRBsWspSZIkyX9y3K1AYCoo72qrWvbVPSlXR/SQ15OJ1cM2FrIp+RIZmj4WeMtTE31laA050lVq9N54nNVy1GZmxbWQ37aDRJ9vd95IPeZMXAPO9tcyq5+VDhHSjlO+py4cu0rmyEpvdCwsACyAAqVOB9uvnkju+BwH1wYBVz6FxQ6lXcCsdukVC1T3uVcGwL9zx04gcTAsBSzlq3vLAe5rxufq1rvmyMX6tfU/Y0QNAPYDBMczCCjHwQ7VB1Hu4ZFWUYGmPSOhgfuSapeI6a2mq+S010dTB8uw/VkevTE670c5y02PuTIAKvhJwAyw0vBcR9Xm9tyxZ9pw9aLsi+layzWIpEj6Ws41OhaWAs0Kt1AeTsROqU8Pr3Ro9qDKbTNiFMyafF7ykoLVZ3enarHaZaj8k+rHhQoCauKkjpD/AzBIg+A84VOIaDvobi8xkgewzWcJSZI48wEj/mYgkYxC6QAAAABJRU5ErkJggg==");
const font = loadImg("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");
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
		key: "r",
		icon: 3,
	},
	circle: {
		cursor: "crosshair",
		key: "t",
		icon: 4,
	},
	line: {
		cursor: "crosshair",
		key: "y",
		icon: 5,
	},
	select: {
		cursor: "cell",
		key: "u",
		icon: 6,
	},
	move: {
		cursor: "move",
		key: "i",
		icon: 7,
	},
	eyedropper: {
		cursor: "crosshair",
		key: "o",
		icon: 8,
	},
};

function deepCopy(input) {

	if (typeof input !== "object" || input === null) {
		return input;
	}

	const out = Array.isArray(input) ? [] : {};

	for (const key in input) {
		out[key] = deepCopy(input[key]);
	}

	return out;

}

function loadImg(code) {
	const img = new window.Image();
	img.src = "data:image/png;base64," + code;
	return img;
}

function clamp(v, a, b) {
	return Math.max(Math.min(v, b), a);
}

function makeCanvas(width, height, pixels) {

	const canvas = {

		width: width,
		height: height,
		pixels: Array(width * height * 4).fill(0),
		blend: "alpha",
		scissorRect: null,
		el: document.createElement("canvas"),

		data() {
			return {
				width: this.width,
				height: this.height,
				pixels: this.pixels,
			};
		},

		clone() {
			return makeCanvas(this.width, this.height, this.pixels);
		},

		clear() {
			this.pixels = Array(this.width * this.height * 4).fill(0);
		},

		load(pixels) {
			if (pixels.length !== this.width * this.height * 4) {
				throw new Error("bad canvas bro");
			}
			this.pixels = deepCopy(pixels);
		},

		set(x, y, c) {

			if (!this.checkPt(x, y)) {
				return false;
			}

			const i = this._getIndex(x, y);

			switch (this.blend) {

				case "alpha": {

					const a = c[3] / 255;

					this.pixels[i + 0] = this.pixels[i + 0] * (1 - a) + c[0] * a;
					this.pixels[i + 1] = this.pixels[i + 1] * (1 - a) + c[1] * a;
					this.pixels[i + 2] = this.pixels[i + 2] * (1 - a) + c[2] * a;
					this.pixels[i + 3] = this.pixels[i + 3] * (1 - a) + c[3] * a;

					break;

				}

				case "replace":

					this.pixels[i + 0] = c[0];
					this.pixels[i + 1] = c[1];
					this.pixels[i + 2] = c[2];
					this.pixels[i + 3] = c[3];

					break;

				case "add": {

					const da = this.pixels[i + 3] / 255;
					const sa = c[3] / 255;

					this.pixels[i + 0] = this.pixels[i + 0] * da + c[0] * sa;
					this.pixels[i + 1] = this.pixels[i + 1] * da + c[1] * sa;
					this.pixels[i + 2] = this.pixels[i + 2] * da + c[2] * sa;
					this.pixels[i + 3] = this.pixels[i + 3] * da + c[3] * sa;

					break;

				}

			}

			return true;

		},

		get(x, y) {

			const i = this._getIndex(x, y);
			const r = this.pixels[i + 0];
			const g = this.pixels[i + 1];
			const b = this.pixels[i + 2];
			const a = this.pixels[i + 3];

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

		// TODO: stack explosion
		bucket(x, y, color) {

			if (!this.checkPt(x, y)) {
				return false;
			}

			const target = this.get(x, y);

			if (colorEq(target, color)) {
				return false;
			}

			this._bucketRec(x, y, target, color);

			return true;

		},

		merge(other, x = 0, y = 0) {
			for (let i = 0; i < this.width; i++) {
				for (let j = 0; j < this.height; j++) {
					const c = other.get(i, j);
					if (
						c
						&& i + x >= 0 && i + x < this.width
						&& j + y >= 0 && j + y < this.height
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
			return x >= 0 && x < this.width && y >= 0 && y < this.height;
		},

		_getIndex(x, y) {
			return y * 4 * this.width + x * 4;
		},

		_bucketRec(x, y, target, color) {

			if (!this.checkPt(x, y)) {
				return;
			}

			if (!colorEq(this.get(x, y), target)) {
				return;
			}

			this.set(x, y, color);
			this._bucketRec(x, y - 1, target, color);
			this._bucketRec(x - 1, y, target, color);
			this._bucketRec(x + 1, y, target, color);
			this._bucketRec(x, y + 1, target, color);

		},

		clampPt(pt) {
			return [clamp(pt[0], 0, this.width), clamp(pt[1], 0, this.height)];
		},

		// TODO: smarter
		// get the bounding box of content
		bbox() {

			let p1 = [0, 0];
			let p2 = [this.width - 1, this.height - 1];

			loopX:
			for (let x = p1[0]; x <= p2[0]; x++) {
				loopY:
				for (let y = p1[1]; y <= p2[1]; y++) {
					const i = this._getIndex(x, y);
					if (this.pixels[i + 3] !== 0) {
						p1[0] = x;
						break loopX;
					}
				}
			}

			loopX:
			for (let x = p2[0]; x >= p1[0]; x--) {
				loopY:
				for (let y = p1[1]; y <= p2[1]; y++) {
					const i = this._getIndex(x, y);
					if (this.pixels[i + 3] !== 0) {
						p2[0] = x;
						break loopX;
					}
				}
			}

			loopY:
			for (let y = p1[1]; y <= p2[1]; y++) {
				loopX:
				for (let x = p1[0]; x <= p2[0]; x++) {
					const i = this._getIndex(x, y);
					if (this.pixels[i + 3] !== 0) {
						p1[1] = y;
						break loopY;
					}
				}
			}

			loopY:
			for (let y = p2[1]; y >= p1[1]; y--) {
				loopX:
				for (let x = p1[0]; x <= p2[0]; x++) {
					const i = this._getIndex(x, y);
					if (this.pixels[i + 3] !== 0) {
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

			this.width = w;
			this.height = h;
			this.pixels = newCanvas.pixels;

		},

		toImageData() {
			return new window.ImageData(
				new Uint8ClampedArray(this.pixels),
				this.width,
				this.height,
			);
		},

		updateEl() {

			this.el.width = this.width;
			this.el.height = this.height;

			const ctx = this.el.getContext("2d");

			ctx.putImageData(this.toImageData(), 0, 0);

		},

		toDataURL() {
			this.updateEl();
			return this.el.toDataURL();
		},

	};

	if (pixels) {
		canvas.load(pixels);
	}

	canvas.updateEl();

	return canvas;

}

function colorEq(c1, c2) {
	return (
		c1[0] === c2[0] && c1[1] === c2[1] && c1[2] === c2[2] && c1[3] === c2[3]
	);
}

function colorCSS(c) {
	return `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${c[3]})`;
}

function drawText(ctx, text, x, y, size) {
	const chars = text.split("");
	for (const ch of chars) {
		if (fontMap[ch]) {
			const [col, row] = fontMap[ch];
			ctx.drawImage(font, 8 * col, 8 * row, 8, 8, x, y, size, size);
			x += size;
		}
	}
}

function hex2rgb(hex) {
	const val = parseInt(hex, 16);
	const r = (val >> 16) & 255;
	const g = (val >> 8) & 255;
	const b = val & 255;
	return [r, g, b, 255];
}

function pedit(conf) {

	const requiredFields = [
		"canvas",
		"width",
		"height"
	];

	for (const f of requiredFields) {
		if (!conf[f]) {
			throw new Error(`gotta have a ${f} bro`);
		}
	}

	const canvasEl = conf.canvas;
	const ctx = conf.canvas.getContext("2d");

	// serializable editor state
	const ed = {

		width: conf.width,
		height: conf.height,

		// frames
		curFrame: 0,
		frames: [
			makeCanvas(conf.width, conf.height)
		],

		// tmp buffer
		fCanvas: makeCanvas(conf.width, conf.height),

		tool: "pen",
		color: [0, 0, 0, 255],
		palette: conf.palette || [
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

		events: {},

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
	};

	scaleFit();
	ctx.imageSmoothingEnabled = false;

	const actions = {
		crop: {
			icon: 9,
			action: crop,
		},
// 		redo: {
// 			icon: 11,
// 			key: "meta+shift+z",
// 			action: redo,
// 		},
// 		undo: {
// 			icon: 10,
// 			key: "shift+z",
// 			action: undo,
// 		},
	};

	const colorSelDom = document.createElement("input");

	colorSelDom.type = "color";

	colorSelDom.addEventListener("change", (e) => {
		const c = hex2rgb(e.target.value.substring(1))
		ed.palette.push(c);
		ed.color = c;
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
		ed.width = ed.frames[ed.curFrame].width;
		ed.height = ed.frames[ed.curFrame].height;
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

	function newFrame() {
		ed.frames.splice(ed.curFrame, 0, ed.frames[ed.curFrame].clone());
		ed.curFrame++;
		pushState();
	}

	function delFrame() {

		if (ed.frames.length > 1) {
			ed.frames.splice(ed.curFrame, 1);
			if (ed.curFrame === ed.frames.length) {
				ed.curFrame = ed.frames.length - 1;
			}
		}

		pushState();

	}

	function prevFrame() {
		ed.curFrame = ed.curFrame === 0 ? ed.frames.length - 1 : ed.curFrame - 1;
	}

	function nextFrame() {
		ed.curFrame = (ed.curFrame + 1) % ed.frames.length;
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

		const canvas = ed.frames[ed.curFrame];
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
			frames: deepCopy(frameData()),
			curFrame: ed.curFrame,
		});

		trigger("change");

	}

	function applyState(state) {
		ed.frames = state.frames.map((f) => {
			return makeCanvas(f.width, f.height, f.pixels);
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
		return ed.frames.map(f => f.data());
	}

	function frame(time) {

		let hovering = false;
		let mousePressProcessed = false;
		let tooltip = null;
		const canvas = ed.frames[ed.curFrame];
		const cw = canvasEl.width;
		const ch = canvasEl.height;
		const s = ed.view.scale;
		const ox = ed.view.offset[0];
		const oy = ed.view.offset[1];

		const area = (conf = {}) => {
			ctx.save();
			ctx.translate(conf.x, conf.y);
			conf.draw && conf.draw();
			ctx.restore();
			if (mouseInRect(conf.x, conf.y, conf.w, conf.h)) {
				hovering = true;
				conf.hover && conf.hover();
				if (session.mousePressed && !mousePressProcessed) {
					conf.click && conf.click();
					mousePressProcessed = true;
				}
			}
		};

		ctx.lineWidth = 2;

		// bg
		ctx.clearRect(0, 0, cw, ch);
		ctx.fillStyle = colorCSS([200, 200, 200, 255]);
		ctx.fillRect(0, 0, cw, ch);
		ctx.fillStyle = colorCSS([255, 255, 255, 255]);
		ctx.fillRect(ox, oy, canvas.width * s, canvas.height * s);

		// canvas
// 		function drawCanvas(ca, dx = 0, dy = 0) {
// 			ca.updateEl();
// 			ctx.save();
// 			ctx.translate(ox, oy);
// 			ctx.scale(s, s);
// 			ctx.translate(dx, dy);
// 			ctx.drawImage(ca.el, 0, 0);
// 			ctx.restore();
// 		}

		function drawCanvas(ca, dx = 0, dy = 0) {
			for (let x = 0; x < ca.width; x++) {
				for (let y = 0; y < ca.height; y++) {
					const c = ca.get(x, y);
					if (c[3] !== 0) {
						ctx.fillStyle = colorCSS(c);
						ctx.fillRect((x + dx) * s + ox, (y + dy) * s + oy, s, s);
					}
				}
			}
		}

		drawCanvas(canvas);

		if (ed.tool === "move") {
			if (session.mouseStartPos) {
				const [cx, cy] = toCanvasPos(session.mousePos);
				const [scx, scy] = toCanvasPos(session.mouseStartPos);
				const [dcx, dcy] = [ cx - scx, cy - scy ];
				drawCanvas(ed.fCanvas, dcx, dcy);
			}
		} else {
			drawCanvas(ed.fCanvas);
		}

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

		ctx.strokeStyle = colorCSS([0, 0, 0, 255]);
		ctx.strokeRect(ox, oy, canvas.width * s, canvas.height * s);

		// frame no.
		{

			let x = 0;

			for (let i = 0; i < ed.frames.length; i++) {

				const ts = 12;
				const w = i === ed.curFrame ? 32 : 24;
				const h = i === ed.curFrame ? 24 : 16;
				const tx = (w - ts) / 2;
				const ty = (h - ts) / 2;
				const c = i === ed.curFrame ? [255, 255, 255, 255] : [230, 230, 230, 255];

				area({
					x: ox + x,
					y: oy,
					w: w,
					h: -h,
					draw() {
						ctx.fillStyle = colorCSS(c);
						ctx.fillRect(0, 0, w, -h);
						drawText(ctx, `${i}`, tx, -h + ty, ts);
						ctx.strokeStyle = colorCSS([0, 0, 0, 255]);
						ctx.strokeRect(0, 0, w, -h);
					},
					click() {
						ed.curFrame = i;
					},
				});

				x += w;

			}

		}

		// cursor
		{

			const [x, y] = toCanvasPos(session.mousePos);

			if (canvas.checkPt(x, y)) {
				switch (ed.tool) {
					case "pen":
					case "rect":
					case "line":
					case "circle":
					case "bucket":
						ctx.fillStyle = colorCSS(ed.color);
						ctx.fillRect(x * s + ox, y * s + oy, s, s);
						break;
					case "erasor":
						ctx.fillStyle = colorCSS([255, 255, 255, 255]);
						ctx.fillRect(x * s + ox, y * s + oy, s, s);
						ctx.strokeStyle = colorCSS([0, 0, 0, 255]);
						ctx.strokeRect(x * s + ox, y * s + oy, s, s);
						break;
				}
			}

		}

		// colors
		ed.palette.forEach((c, i) => {
			area({
				x: 0,
				y: i * 24,
				w: 24,
				h: 24,
				draw() {
					ctx.fillStyle = colorCSS(c);
					ctx.fillRect(0, 0, 24, 24);
					ctx.strokeStyle = colorCSS([0, 0, 0, 255]);
					ctx.strokeRect(0, 0, 24, 24);
				},
				click() {
					ed.color = ed.palette[i];
				},
			});
		});

		// selected color (need to draw on top)
		const curColorIdx = ed.palette.findIndex(c => colorEq(c, ed.color));

		if (curColorIdx) {
			ctx.lineWidth = 4;
			ctx.strokeStyle = colorCSS([0, 0, 0, 255]);
			ctx.strokeRect(0, curColorIdx * 24, 24, 24);
			ctx.lineWidth = 2;
		}

		// add / remove color
		area({
			x: 0,
			y: ed.palette.length * 24,
			w: 24,
			h: 24,
			draw() {
				ctx.fillStyle = colorCSS([255, 255, 255, 255]);
				ctx.fillRect(0, 0, 24, 24);
				ctx.strokeStyle = colorCSS([0, 0, 0, 255]);
				ctx.strokeRect(0, 0, 24, 24);
				drawText(ctx, "+", 0, 0, 24);
			},
			click() {
				colorSelDom.click();
			},
		});

		area({
			x: 0,
			y: (ed.palette.length + 1) * 24,
			w: 24,
			h: 24,
			draw() {
				ctx.fillStyle = colorCSS([255, 255, 255, 255]);
				ctx.fillRect(0, 0, 24, 24);
				ctx.strokeStyle = colorCSS([0, 0, 0, 255]);
				ctx.strokeRect(0, 0, 24, 24);
				drawText(ctx, "-", 0, 0, 24);
			},
			click() {
				// TODO
			},
		});

		// tools
		{

			const w = 32;
			const h = 32;
			const x = cw - w;
			let y = 0;

			// draw tool list
			for (const tool in toolData) {

				const data = toolData[tool];

				area({
					x: x,
					y: y,
					w: w,
					h: h,
					draw() {
						ctx.fillStyle = colorCSS([255, 255, 255, 255]);
						ctx.fillRect(0, 0, w, h);
						ctx.drawImage(icons, 16 * data.icon, 0, 16, 16, 0, 0, w, h);
						ctx.strokeStyle = colorCSS([0, 0, 0, 255]);
						ctx.strokeRect(0, 0, w, h);
					},
					click() {
						ed.tool = tool;
					},
					hover() {
						tooltip = `${tool} (${data.key})`;
					},
				});

				y += h;

			}

			// TODO: find it
			// highlight current tool
			y = 0;

			for (const tool in toolData) {

				if (ed.tool === tool) {
					const x = cw - w;
					ctx.lineWidth = 4;
					ctx.strokeStyle = colorCSS([0, 0, 0, 255]);
					ctx.strokeRect(x, y, w, h);
					ctx.lineWidth = 2;
				}

				y += h;

			}

		}

		// action
		{

			const w = 32;
			const h = 32;
			let x = cw - w;
			const y = ch - h;

			// draw action list
			for (const name in actions) {

				let curHovering = false;
				const action = actions[name];

				area({
					x: x,
					y: y,
					w: w,
					h: h,
					draw() {
						ctx.fillStyle = colorCSS([255, 255, 255, 255]);
						// TODO: doesn't work
						if (session.mouseDown && curHovering) {
							ctx.fillStyle = colorCSS([128, 128, 128, 255]);
						} else {
							ctx.fillStyle = colorCSS([255, 255, 255, 255]);
						}
						ctx.fillRect(0, 0, w, h);
						ctx.drawImage(icons, 16 * action.icon, 0, 16, 16, 0, 0, w, h);
						ctx.strokeStyle = colorCSS([0, 0, 0, 255]);
						ctx.strokeRect(0, 0, w, h);
					},
					click() {
						action.action();
					},
					hover() {
						curHovering = true;
						tooltip = `${name}`;
					},
				});

				x -= w;

			}

		}

		// tooltip
		if (tooltip) {

			const padding = 3;
			const margin = 6;
			const size = 12;
			const w = tooltip.length * size + padding * 2;
			const h = size + padding * 2;
			const [mx, my] = session.mousePos;
			const x = mx - w - margin;
			const y = my + margin;

			ctx.fillStyle = colorCSS([255, 255, 255, 255]);
			ctx.fillRect(x, y, w, h);
			drawText(ctx, tooltip, x + padding, y + padding, size);
			ctx.strokeStyle = colorCSS([0, 0, 0, 255]);
			ctx.strokeRect(x, y, w, h);

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

		window.requestAnimationFrame(frame);

	}

	window.requestAnimationFrame(frame);

	const events = {

		wheel: (e) => {
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

		mousedown: (e) => {
			session.mousePressed = true;
			session.mouseDown = true;
			session.mousePosPrev = [...session.mousePos];
			session.mousePos = [e.offsetX, e.offsetY];
			session.mouseStartPos = [...session.mousePos];
		},

		mousemove: (e) => {

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

			const canvas = ed.frames[ed.curFrame];
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

		mouseup: (e) => {

			session.mouseDown = false;
			session.mousePosPrev = [session.mousePos, session.mousePos];
			session.mousePos = [e.offsetX, e.offsetY];

			const canvas = ed.frames[ed.curFrame];
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

		keydown: (e) => {

			trigger("key", e);

			if (!e.metaKey) {
				for (const tool in toolData) {
					const data = toolData[tool];
					if (data.key === e.key) {
						ed.tool = tool;
						return;
					}
				}
			}

			const canvas = ed.frames[ed.curFrame];

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
					ed.color = ed.palette[parseInt(e.key, 10) - 1] || ed.color;
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
				case "s":
					if (e.metaKey) {
						e.preventDefault();
					}
					break;
				case "l":
					if (e.metaKey) {
						e.preventDefault();
					}
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
				case " ":
					session.grabbin = true;
					e.preventDefault();
					break;
				case "Backspace":
					if (canvas.scissorRect) {
						deleteSelection();
						canvas.scissorRect = null;
					}
					break;
				case "Escape":
					canvas.scissorRect = null;
					break;
				case "j":
					break;
			}

		},

		keyup: (e) => {
			switch (e.key) {
				case " ":
					session.grabbin = false;
					break;
			}
		},

	};

	for (const e in events) {
		canvasEl.addEventListener(e, events[e]);
	}

	const handle = {

		frames() {
			return ed.frames;
		},

		data() {
			return frameData();
		},

		load(data) {

			if (!data || data.length <= 0) {
				return;
			}

			ed.frames = data.map((d) => {
				return makeCanvas(d.width, d.height, d.pixels);
			});

		},

		on(ev, f) {
			if (!ed.events[ev]) {
				ed.events[ev] = [];
			}
			ed.events[ev].push(f);
		},

		setTool(tool) {
			if (!toolData[tool]) {
				throw new Error(`no tool called ${tool} bro`);;
			}
			ed.tool = tool;
		},

		setColor(color) {
			ed.color = color;
		},

		setPalette(palette) {
			ed.palette = palette;
		},

		cleanUp() {
			for (const e in events) {
				canvasEl.removeEventListener(e, events[e]);
			}
		},

	};

	if (conf.data) {
		handle.load(conf.data);
	}

	if (conf.onChange) {
		handle.on("change", conf.onChange);
	}

	// init state list (don't want to trigger "change" so no pushState())
	ed.state.stack = [
		{
			frames: deepCopy(frameData()),
			curFrame: ed.curFrame,
		},
	];

	return handle;

}

export default pedit;
