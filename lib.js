(() => {

// TODO: undo / redo

function makeLine(x0, y0, x1, y1) {

	const arr = [];
	let dx = x1 - x0;
	let dy = y1 - y0;
	let adx = Math.abs(dx);
	let ady = Math.abs(dy);
	let eps = 0;
	let sx = dx > 0 ? 1 : -1;
	let sy = dy > 0 ? 1 : -1;

	if (adx > ady) {
		for(let x = x0, y = y0; sx < 0 ? x >= x1 : x <= x1; x += sx) {
			arr.push([x, y]);
			eps += ady;
			if ((eps << 1) >= adx) {
				y += sy;
				eps -= adx;
			}
		}
	} else {
		for(let x = x0, y = y0; sy < 0 ? y >= y1 : y <= y1; y += sy) {
			arr.push([x, y]);
			eps += adx;
			if ((eps << 1) >= ady) {
				x += sx;
				eps -= ady;
			}
		}
	}

	return arr;

}

function makeCanvas(w, h) {

	return {

		width: w,
		height: h,
		pixels: Array(w * h * 4).fill(0),

		set(x, y, c) {

			if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
				return;
			}

			const i = y * 4 * this.width + x * 4;

			this.pixels[i + 0] = c[0];
			this.pixels[i + 1] = c[1];
			this.pixels[i + 2] = c[2];
			this.pixels[i + 3] = c[3];

		},

		get(x, y) {

			const i = y * 4 * this.width + x * 4;
			const r = this.pixels[i + 0];
			const g = this.pixels[i + 1];
			const b = this.pixels[i + 2];
			const a = this.pixels[i + 3];

			return [r, g, b, a];

		},

		clear() {
			this.pixels = Array(w * h * 4).fill(0);
		},

		toImageData() {
			return new ImageData(new Uint8ClampedArray(this.pixels), this.width, this.height);
		},

	};

}

const ed = {
	scale: 20,
	width: 0,
	height: 0,
	frames: [],
	curFrame: 0,
	mouseDown: false,
	mousePos: [0, 0],
	mousePosPrev: [0, 0],
	mode: "pencil",
	color: [0, 0, 0, 255],
	offset: [0, 0],
	states: [],
};

function toPixelPos(pt) {
	const x = ~~((pt[0] - ed.offset[0]) / ed.scale);
	const y = ~~((pt[1] - ed.offset[1]) / ed.scale);
	return [x, y];
}

function colorCSS(c) {
	return `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${c[3]})`;
}

// TODO: a little wrong
function scaleDown() {
	ed.scale = Math.max(4, ed.scale - 1);
	ed.offset[0] += ed.scale / 2;
	ed.offset[1] += ed.scale / 2;
}

function scaleUp() {
	ed.scale++;
	ed.offset[0] -= ed.scale / 2;
	ed.offset[1] -= ed.scale / 2;
}

function render() {

	const ctx = ed.ctx;
	const canvas = ed.frames[ed.curFrame];
	const cw = ed.canvasEl.width;
	const ch = ed.canvasEl.height;
	const s = ed.scale;

	ctx.lineWidth = 2;

	ctx.clearRect(0, 0, cw, ch);
	ctx.fillStyle = colorCSS([200, 200, 200, 255]);
	ctx.fillRect(0, 0, cw, ch);

	const ox = ed.offset[0];
	const oy = ed.offset[1];

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

	ctx.strokeStyle = colorCSS([0, 0, 0, 255]);
	ctx.strokeRect(ox, oy, canvas.width * s, canvas.height * s);

	let x = 0;

	for (let i = 0; i < ed.frames.length; i++) {
		const w = i == ed.curFrame ? 32 : 24;
		const h = i == ed.curFrame ? 24 : 16;
		const c = i == ed.curFrame ? [255, 255, 255, 255] : [230, 230, 230, 255];
		ctx.fillStyle = colorCSS(c);
		ctx.fillRect(ox + x, oy, w, -h);
		ctx.strokeStyle = colorCSS([0, 0, 0, 255]);
		ctx.strokeRect(ox + x, oy, w, -h);
// 		ctx.font = "20px Courier";
// 		ctx.fillStyle = colorCSS([0, 0, 0, 255]);
// 		ctx.fillText(i, ox + 9 + x, oy - 5);
		x += w;
	}

	switch (ed.mode) {
		case "pencil": {
			const [x, y] = toPixelPos(ed.mousePos);
			ctx.fillStyle = colorCSS(ed.color);
			ctx.fillRect(x * s + ox, y * s + oy, s, s);
			break;
		}
		case "erasor": {
			const [x, y] = toPixelPos(ed.mousePos);
			ctx.fillStyle = colorCSS([255, 255, 255, 255]);
			ctx.fillRect(x * s + ox, y * s + oy, s, s);
			ctx.strokeStyle = colorCSS([0, 0, 0, 255]);
			ctx.strokeRect(x * s + ox, y * s + oy, s, s);
			break;
		}
	}

}

function update() {
	render();
	requestAnimationFrame(update);
}

function start(conf) {

	ed.canvasEl = conf.canvas;
	ed.ctx = ed.canvasEl.getContext("2d");
	ed.width = conf.width;
	ed.height = conf.height;
	ed.frames[0] = makeCanvas(ed.width, ed.height);

	const cw = ed.canvasEl.width;
	const ch = ed.canvasEl.height;
	const ccw = ed.frames[ed.curFrame].width * ed.scale;
	const cch = ed.frames[ed.curFrame].height * ed.scale;

	ed.offset = [
		(cw - ccw) / 2,
		(ch - cch) / 2,
	];

	ed.ctx.imageSmoothingEnabled = false;

	ed.canvasEl.addEventListener("wheel", (e) => {
		e.preventDefault();
		if (e.altKey) {
			if (e.deltaY > 0) {
				scaleUp();
			} else if (e.deltaY < 0) {
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

		const [x, y] = toPixelPos(ed.mousePos);

		switch (ed.mode) {
			case "pencil": {
				ed.frames[ed.curFrame].set(x, y, ed.color);
				break;
			}
			case "erasor": {
				ed.frames[ed.curFrame].set(x, y, [0, 0, 0, 0]);
				break;
			}
		}

	});

	ed.canvasEl.addEventListener("mouseup", (e) => {

		ed.mouseDown = false;
		ed.mousePosPrev = [ed.mousePos, ed.mousePos];
		ed.mousePos = [e.offsetX, e.offsetY];

		switch (ed.mode) {
		}

	});

	ed.canvasEl.addEventListener("mousemove", (e) => {

		ed.mousePosPrev = [...ed.mousePos];
		ed.mousePos = [e.offsetX, e.offsetY];

		const [px, py] = toPixelPos(ed.mousePosPrev);
		const [x, y] = toPixelPos(ed.mousePos);

		switch (ed.mode) {
			case "pencil": {
				if (ed.mouseDown) {
					const pts = makeLine(px, py, x, y);
					for (const pt of pts) {
						ed.frames[ed.curFrame].set(pt[0], pt[1], ed.color);
					}
				}
				break;
			}
			case "erasor": {
				if (ed.mouseDown) {
					const pts = makeLine(px, py, x, y);
					for (const pt of pts) {
						ed.frames[ed.curFrame].set(pt[0], pt[1], [0, 0, 0, 0]);
					}
				}
				break;
			}
		}

	});

	document.addEventListener("keydown", (e) => {
		switch (e.key) {
			case "b":
				ed.mode = "pencil";
				break;
			case "e":
				ed.mode = "erasor";
				break;
			case "-": {
				scaleDown();
				break;
			}
			case "=":
				scaleUp();
				break;
			case "+":
				ed.frames.push(makeCanvas(ed.width, ed.height));
				break;
			case "_":
				if (ed.frames.length > 1) {
					ed.frames.splice(ed.curFrame, 1);
				}
				break;
			case "ArrowLeft":
				ed.curFrame = Math.abs(ed.curFrame - 1) % ed.frames.length;
				break;
			case "ArrowRight":
				ed.curFrame = (ed.curFrame + 1) % ed.frames.length;
				break;
		}
	});

	update();

};

const lib = {};

lib.start = start;

window.pedit = lib;

})();

