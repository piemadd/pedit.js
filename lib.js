(() => {

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

		toImageData() {
			return new ImageData(new Uint8ClampedArray(this.pixels), this.width, this.height);
		},

	};

}

const canvas = makeCanvas(32, 32);

const editor = {
	scale: 20,
	color: [0, 0, 255, 255],
	mouseDown: false,
	mousePos: [0, 0],
	mousePosPrev: [0, 0],
	mode: "pencil",
};

const canvasEl = document.querySelector("#editor");
const ctx = canvasEl.getContext("2d");

document.addEventListener("keydown", (e) => {
	switch (e.key) {
		case "1":
			editor.mode = "pencil";
			break;
		case "2":
			editor.mode = "erasor";
			break;
		case "-":
			editor.scale--;
			render();
			break;
		case "=":
			editor.scale++;
			render();
			break;
	}
});

canvasEl.addEventListener("mousedown", (e) => {

	editor.mouseDown = true;
	editor.mousePosPrev = [editor.mousePos, editor.mousePos];
	editor.mousePos = [e.offsetX, e.offsetY];

	const x = ~~(editor.mousePos[0] / editor.scale);
	const y = ~~(editor.mousePos[1] / editor.scale);

	switch (editor.mode) {
		case "pencil": {
			canvas.set(x, y, editor.color);
			render();
			break;
		}
		case "erasor": {
			canvas.set(x, y, [0, 0, 0, 0]);
			render();
			break;
		}
	}

});

canvasEl.addEventListener("mouseup", (e) => {

	editor.mouseDown = false;
	editor.mousePosPrev = [editor.mousePos, editor.mousePos];
	editor.mousePos = [e.offsetX, e.offsetY];

	switch (editor.mode) {
	}

});

canvasEl.addEventListener("mousemove", (e) => {

	editor.mousePosPrev = [...editor.mousePos];
	editor.mousePos = [e.offsetX, e.offsetY];

	const px = ~~(editor.mousePosPrev[0] / editor.scale);
	const py = ~~(editor.mousePosPrev[1] / editor.scale);
	const x = ~~(editor.mousePos[0] / editor.scale);
	const y = ~~(editor.mousePos[1] / editor.scale);

	switch (editor.mode) {
		case "pencil": {
			if (editor.mouseDown) {
				const pts = makeLine(px, py, x, y);
				for (const pt of pts) {
					canvas.set(pt[0], pt[1], editor.color);
				}
				render();
			}
			break;
		}
		case "erasor": {
			if (editor.mouseDown) {
				const pts = makeLine(px, py, x, y);
				for (const pt of pts) {
					canvas.set(pt[0], pt[1], [0, 0, 0, 0]);
				}
				render();
			}
			break;
		}
	}

});

function render() {
	ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
	for (let x = 0; x < canvas.width; x++) {
		for (let y = 0; y < canvas.height; y++) {
			const c = canvas.get(x, y);
			if (c[3] !== 0) {
				ctx.fillStyle = `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${c[3]})`;
				ctx.fillRect(x * editor.scale, y * editor.scale, editor.scale, editor.scale);
			}
		}
	}
}

render();

const lib = {};

})();

