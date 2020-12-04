(() => {

const MIN_SCALE = 2;
const MAX_SCALE = 64;
const PADDING = 120;
const MAX_STATES = 64;

function deepCopy(input) {

	if (typeof(input) !== "object" || input === null) {
		return input;
	}

	const out = Array.isArray(input) ? [] : {};

	for (const key in input) {
		out[key] = deepCopy(input[key]);
	}

	return out;

}

function clamp(v, a, b) {
	return Math.max(Math.min(v, b), a);
}

function makeCanvas(w, h) {

	return {

		width: w,
		height: h,
		pixels: Array(w * h * 4).fill(0),
		blend: "alpha",
		scissorRect: undefined,

		clear() {
			this.pixels = Array(w * h * 4).fill(0);
		},

		set(x, y, c) {

			if (!this._checkPt(x, y)) {
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
				case "add":
					const da = this.pixels[i + 3] / 255;
					const sa = c[3] / 255;
					this.pixels[i + 0] = this.pixels[i + 0] * da + c[0] * sa;
					this.pixels[i + 1] = this.pixels[i + 1] * da + c[1] * sa;
					this.pixels[i + 2] = this.pixels[i + 2] * da + c[2] * sa;
					this.pixels[i + 3] = this.pixels[i + 3] * da + c[3] * sa;
					break;
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

			let dx = x1 - x0;
			let dy = y1 - y0;
			let adx = Math.abs(dx);
			let ady = Math.abs(dy);
			let eps = 0;
			let sx = dx > 0 ? 1 : -1;
			let sy = dy > 0 ? 1 : -1;

			if (adx > ady) {
				for(let x = x0, y = y0; sx < 0 ? x >= x1 : x <= x1; x += sx) {
					this.set(x, y, c);
					eps += ady;
					if ((eps << 1) >= adx) {
						y += sy;
						eps -= adx;
					}
				}
			} else {
				for(let x = x0, y = y0; sy < 0 ? y >= y1 : y <= y1; y += sy) {
					this.set(x, y, c);
					eps += adx;
					if ((eps << 1) >= ady) {
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
					const dist = Math.sqrt( Math.pow(xx - x, 2) + Math.pow(yy - y, 2) );
					if (dist <= r) {
						this.set(xx, yy, c);
					}
				}
			}
		},

		strokeCircle(x, y, r, c) {
			// TODO
		},

		bucket(x, y, color) {
			if (!this._checkPt(x, y)) {
				return false;
			}
			const target = this.get(x, y);
			if (colorEq(target, color)) {
				return false;
			}
			this._bucketRec(x, y, target, color);
			return true;
		},

		merge(other) {
			if (other.width !== this.width || other.height !== this.height) {
				return;
			}
			for (let i = 0; i < this.width; i++) {
				for (let j = 0; j < this.height; j++) {
					this.set(i, j, other.get(i, j));
				}
			}
		},

		_checkPt(x, y) {
			if (this.scissorRect) {
				const r = this.scissorRect;
				return x >= r[0][0] && x < r[1][0] && y >= r[0][1] && y < r[1][1];
			} else {
				return x >= 0 && x < this.width && y >= 0 && y < this.height;
			}
		},

		_getIndex(x, y) {
			return y * 4 * this.width + x * 4;
		},

		_bucketRec(x, y, target, color) {

			if (!this._checkPt(x, y)) {
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

		toImageData() {
			return new ImageData(new Uint8ClampedArray(this.pixels), this.width, this.height);
		},

		clampPt(pt) {
			return [
				clamp(pt[0], 0, this.width),
				clamp(pt[1], 0, this.height),
			];
		},

	};

}

function colorEq(c1, c2) {
	return c1[0] == c2[0] && c1[1] == c2[1] && c1[2] == c2[2] && c1[3] == c2[3];
}

const ed = {
	scale: 1,
	width: 0,
	height: 0,
	frames: [],
	curFrame: 0,
	tmpCanvas: undefined,
	mouseDown: false,
	mousePos: [0, 0],
	mousePosPrev: [0, 0],
	mouseStartPos: undefined,
	mode: "pencil",
	color: [0, 0, 0, 255],
	selectArea: undefined,
	colors: [
		[0, 0, 0, 255],
		[255, 255, 255, 255],
		[255, 0, 0, 255],
		[0, 255, 0, 255],
		[0, 0, 255, 255],
		[255, 255, 0, 255],
		[255, 0, 255, 255],
		[0, 255, 255, 255],
	],
	offset: [0, 0],
	states: [],
	stateOffset: 0,
	modified: false,
};

function toCanvasPos(pt) {
	const x = ~~((pt[0] - ed.offset[0]) / ed.scale);
	const y = ~~((pt[1] - ed.offset[1]) / ed.scale);
	return [x, y];
}

function colorCSS(c) {
	return `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${c[3]})`;
}

function scaleDown() {
	if (ed.scale <= MIN_SCALE) {
		return;
	}
	ed.scale--;
	ed.offset[0] += ed.width / 2;
	ed.offset[1] += ed.height / 2;
}

function scaleUp() {
	if (ed.scale >= MAX_SCALE) {
		return;
	}
	ed.scale++;
	ed.offset[0] -= ed.width / 2;
	ed.offset[1] -= ed.height / 2;
}

function scaleFit() {
	const cw = ed.canvasEl.width;
	const ch = ed.canvasEl.height;
	const sw = (cw - PADDING) / ed.width;
	const sh = (ch - PADDING) / ed.height;
	ed.scale = ~~Math.min(sw, sh);
	ed.offset = [
		(cw - ed.width * ed.scale) / 2,
		(ch - ed.height * ed.scale) / 2,
	];
}

function newFrame() {
	ed.frames.push(makeCanvas(ed.width, ed.height));
}

function delFrame() {
	if (ed.frames.length > 1) {
		ed.frames.splice(ed.curFrame, 1);
	}
}

function prevFrame() {
	ed.curFrame = ed.curFrame == 0 ? ed.frames.length - 1 : ed.curFrame - 1;
}

function nextFrame() {
	ed.curFrame = (ed.curFrame + 1) % ed.frames.length;
}

// TODO: buggy
function pushState() {
	if (ed.states.length >= MAX_STATES) {
		return;
	}
	if (ed.stateOffset > 0) {
		ed.states.splice(ed.states.length - ed.stateOffset, ed.stateOffset);
		ed.stateOffset = 0;
	}
	ed.modified = true;
	ed.states.push(deepCopy(ed.frames));
}

function undo() {
	if (ed.stateOffset >= ed.states.length - 1) {
		return;
	}
	if (ed.modified) {
		ed.states.push(deepCopy(ed.frames));
		ed.modified = false;
	}
	ed.stateOffset++;
	ed.frames = deepCopy(ed.states[ed.states.length - ed.stateOffset - 1]);
}

function redo() {
	if (ed.stateOffset === 0) {
		return;
	}
	ed.stateOffset--;
	ed.frames = deepCopy(ed.states[ed.states.length - ed.stateOffset - 1]);
}

function render(t) {

	const ctx = ed.ctx;
	const canvas = ed.frames[ed.curFrame];
	const cw = ed.canvasEl.width;
	const ch = ed.canvasEl.height;
	const s = ed.scale;
	const ox = ed.offset[0];
	const oy = ed.offset[1];

	ctx.lineWidth = 2;

	// bg
	ctx.clearRect(0, 0, cw, ch);
	ctx.fillStyle = colorCSS([200, 200, 200, 255]);
	ctx.fillRect(0, 0, cw, ch);

	// canvas
	ctx.fillStyle = colorCSS([255, 255, 255, 255]);
	ctx.fillRect(ox, oy, canvas.width * s, canvas.height * s);

	for (let x = 0; x < canvas.width; x++) {
		for (let y = 0; y < canvas.height; y++) {
			const c = canvas.get(x, y);
			if (c[3] !== 0) {
				ctx.fillStyle = colorCSS(c);
				ctx.fillRect(x * s + ox, y * s + oy, s, s);
			}
		}
	}

	for (let x = 0; x < ed.tmpCanvas.width; x++) {
		for (let y = 0; y < ed.tmpCanvas.height; y++) {
			const c = ed.tmpCanvas.get(x, y);
			if (c[3] !== 0) {
				ctx.fillStyle = colorCSS(c);
				ctx.fillRect(x * s + ox, y * s + oy, s, s);
			}
		}
	}

	if (ed.selectArea) {
		const p1 = ed.selectArea[0];
		const p2 = ed.selectArea[1];
		ctx.strokeStyle = colorCSS([0, 0, 0, 255]);
		ctx.setLineDash([5, 5]);
		ctx.strokeRect(p1[0] * s + ox, p1[1] * s + oy, (p2[0] - p1[0]) * s, (p2[1] - p1[1]) * s);
		ctx.setLineDash([]);
	}


	ctx.strokeStyle = colorCSS([0, 0, 0, 255]);
	ctx.strokeRect(ox, oy, canvas.width * s, canvas.height * s);

	// frame no.
	{

		let x = 0;

		for (let i = 0; i < ed.frames.length; i++) {
			const w = i == ed.curFrame ? 32 : 24;
			const h = i == ed.curFrame ? 24 : 16;
			const c = i == ed.curFrame ? [255, 255, 255, 255] : [230, 230, 230, 255];
			ctx.fillStyle = colorCSS(c);
			ctx.fillRect(ox + x, oy, w, -h);
			ctx.strokeStyle = colorCSS([0, 0, 0, 255]);
			ctx.strokeRect(ox + x, oy, w, -h);
			x += w;
		}

	}

	ed.colors.forEach((c, i) => {
		ctx.fillStyle = colorCSS(c);
		ctx.fillRect(0, i * 24, 24, 24);
		ctx.strokeStyle = colorCSS([0, 0, 0, 255]);
		ctx.strokeRect(0, i * 24, 24, 24);
	});

	// cursor
	switch (ed.mode) {
		case "pencil": {
			const [x, y] = toCanvasPos(ed.mousePos);
			ctx.fillStyle = colorCSS(ed.color);
			ctx.fillRect(x * s + ox, y * s + oy, s, s);
			break;
		}
		case "erasor": {
			const [x, y] = toCanvasPos(ed.mousePos);
			ctx.fillStyle = colorCSS([255, 255, 255, 255]);
			ctx.fillRect(x * s + ox, y * s + oy, s, s);
			ctx.strokeStyle = colorCSS([0, 0, 0, 255]);
			ctx.strokeRect(x * s + ox, y * s + oy, s, s);
			break;
		}
	}

}

function update(t) {
	render(t);
	requestAnimationFrame(update);
}

function start(conf) {

	ed.canvasEl = conf.canvas;
	ed.ctx = ed.canvasEl.getContext("2d");
	ed.width = conf.width;
	ed.height = conf.height;
	ed.frames[0] = makeCanvas(ed.width, ed.height);
	ed.tmpCanvas = makeCanvas(ed.width, ed.height);

	scaleFit();

	ed.ctx.imageSmoothingEnabled = false;

	ed.canvasEl.addEventListener("wheel", (e) => {
		e.preventDefault();
		if (e.altKey) {
			if (e.deltaY < 0) {
				scaleUp();
			} else if (e.deltaY > 0) {
				scaleDown();
			}
		} else {
			ed.offset[0] -= e.deltaX;
			ed.offset[1] -= e.deltaY;
		}
	});

	ed.canvasEl.addEventListener("mousedown", (e) => {

		ed.mouseDown = true;
		ed.mousePosPrev = [ed.mousePos, ed.mousePos];
		ed.mousePos = [e.offsetX, e.offsetY];
		ed.mouseStartPos = [...ed.mousePos];

		const [x, y] = toCanvasPos(ed.mousePos);
		const canvas = ed.frames[ed.curFrame];

		pushState();

		switch (ed.mode) {
			case "pencil": {
				canvas.set(x, y, ed.color);
				break;
			}
			case "erasor": {
				canvas.blend = "replace";
				canvas.set(x, y, [0, 0, 0, 0]);
				canvas.blend = "alpha";
				break;
			}
			case "bucket": {
				canvas.bucket(x, y, ed.color);
				break;
			}
		}

	});

	ed.canvasEl.addEventListener("mouseup", (e) => {

		ed.mouseDown = false;
		ed.mousePosPrev = [ed.mousePos, ed.mousePos];
		ed.mousePos = [e.offsetX, e.offsetY];
		ed.mouseStartPos = undefined;
		const canvas = ed.frames[ed.curFrame];

		switch (ed.mode) {
			case "rect":
				canvas.merge(ed.tmpCanvas);
				ed.tmpCanvas.clear();
				break;
			case "circle":
				canvas.merge(ed.tmpCanvas);
				ed.tmpCanvas.clear();
				break;
			case "select":
				canvas.scissorRect = deepCopy(ed.selectArea);
				break;
		}

	});

	ed.canvasEl.addEventListener("mousemove", (e) => {

		ed.mousePosPrev = [...ed.mousePos];
		ed.mousePos = [e.offsetX, e.offsetY];

		const [px, py] = toCanvasPos(ed.mousePosPrev);
		const [x, y] = toCanvasPos(ed.mousePos);
		const canvas = ed.frames[ed.curFrame];

		switch (ed.mode) {
			case "pencil":
				if (ed.mouseDown) {
					canvas.line(px, py, x, y, ed.color);
				}
				break;
			case "erasor":
				if (ed.mouseDown) {
					canvas.blend = "replace";
					canvas.line(px, py, x, y, [0, 0, 0, 0]);
					canvas.blend = "alpha";
				}
				break;
			case "rect":
				if (ed.mouseDown) {
					const [sx, sy] = toCanvasPos(ed.mouseStartPos);
					ed.tmpCanvas.clear();
					ed.tmpCanvas.fillRect(sx, sy, x - sx, y - sy, ed.color);
				}
				break;
			case "circle":
				if (ed.mouseDown) {
					const [sx, sy] = toCanvasPos(ed.mouseStartPos);
					ed.tmpCanvas.clear();
					ed.tmpCanvas.fillCircle(sx, sy, x - sx, ed.color);
				}
				break;
			case "select":
				if (ed.mouseDown) {
					const [sx, sy] = canvas.clampPt(toCanvasPos(ed.mouseStartPos));
					const [dx, dy] = canvas.clampPt([x, y]);
					ed.selectArea = [[sx, sy], [dx, dy]];
				}
				break;
		}

	});

	document.addEventListener("keydown", (e) => {
		switch (e.key) {
			case "p":
				ed.mode = "pencil";
				break;
			case "e":
				ed.mode = "erasor";
				break;
			case "b":
				ed.mode = "bucket";
				break;
			case "l":
				ed.mode = "line";
				break;
			case "r":
				ed.mode = "rect";
				break;
			case "c":
				ed.mode = "circle";
				break;
			case "s":
				ed.mode = "select";
				break;
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
				ed.color = ed.colors[parseInt(e.key) - 1];
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
			case "u":
				undo();
				break;
			case "o":
				redo();
				break;
			case "Escape":
				ed.selectArea = undefined;
				ed.frames[ed.curFrame].scissorRect = undefined;
				break;
		}
	});

	update();

};

const lib = {};

lib.start = start;

window.pedit = lib;

})();

