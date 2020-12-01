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
	mouseDown: false,
	mousePos: [0, 0],
	mousePosPrev: [0, 0],
	mode: "pencil",
	color: [0, 0, 255, 255],
	brushSize: 1,
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

function render() {

	const ctx = ed.ctx;
	const canvas = ed.canvas;
	const cw = ed.canvasEl.width;
	const ch = ed.canvasEl.height;
	const s = ed.scale;

	ctx.clearRect(0, 0, cw, ch);

	const ox = ed.offset[0];
	const oy = ed.offset[1];

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

	switch (ed.mode) {
		case "pencil": {
			const [x, y] = toPixelPos(ed.mousePos);
			ctx.fillStyle = colorCSS(ed.color);
			ctx.fillRect(x * s + ox, y * s + oy, s, s);
			break;
		}
		case "erasor": {
			const [x, y] = toPixelPos(ed.mousePos);
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

const lib = {};

lib.start = (conf) => {

	ed.canvasEl = conf.canvas;
	ed.ctx = ed.canvasEl.getContext("2d");
	ed.canvas = makeCanvas(conf.width, conf.height);

	const cw = ed.canvasEl.width;
	const ch = ed.canvasEl.height;
	const ccw = ed.canvas.width * ed.scale;
	const cch = ed.canvas.height * ed.scale;

	ed.offset = [
		(cw - ccw) / 2,
		(ch - cch) / 2,
	];

	ed.ctx.imageSmoothingEnabled = false;

	ed.canvasEl.addEventListener("wheel", (e) => {
		e.preventDefault();
		ed.offset[0] -= e.deltaX;
		ed.offset[1] -= e.deltaY;
	});

	ed.canvasEl.addEventListener("mousedown", (e) => {

		ed.mouseDown = true;
		ed.mousePosPrev = [ed.mousePos, ed.mousePos];
		ed.mousePos = [e.offsetX, e.offsetY];

		const [x, y] = toPixelPos(ed.mousePos);

		switch (ed.mode) {
			case "pencil": {
				ed.canvas.set(x, y, ed.color);
				break;
			}
			case "erasor": {
				ed.canvas.set(x, y, [0, 0, 0, 0]);
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
						ed.canvas.set(pt[0], pt[1], ed.color);
					}
				}
				break;
			}
			case "erasor": {
				if (ed.mouseDown) {
					const pts = makeLine(px, py, x, y);
					for (const pt of pts) {
						ed.canvas.set(pt[0], pt[1], [0, 0, 0, 0]);
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
			case "-":
				ed.scale = Math.max(1, ed.scale - 1);
				break;
			case "=":
				ed.scale++;
				break;
		}
	});

	update();

};

lib.canvas = () => {
	return ed.canvas;
};

window.pedit = lib;

})();

