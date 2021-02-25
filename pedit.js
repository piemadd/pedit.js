const MIN_SCALE = 2;
const MAX_SCALE = 64;
const PADDING = 120;
const MAX_STATES = 64;

const icons = loadImg("iVBORw0KGgoAAAANSUhEUgAAAIAAAAAQCAYAAADeWHeIAAAAAXNSR0IArs4c6QAAAQ9JREFUaIHtmFEOwyAIQHHp/a/svmwcEwERq9aXNKkdCApCJsDhcHgv4WkHJiai8ap7FaHi+wqLqi7AyR4UbFLfsYzF1zzpKPucDyqd2RNAs2h8YjlK80kCyMlYkqCH/VwO86d3KZSLEzjpt2L1r5cPo6sW5QcA48vH2YH80YKD5Bm0NL/EzxRgqwylZ5Xh7P787pkAb6c1CSxI7d1yVAt4GmohM5RWDSPbQSTeS+P0LZwK4M+oShDQe956S604APi2gIgeDdSJ8TxJ0kC1nGjN3BYZqV+3HNUCrBvdI1B401Yq/SVGtQNu/kAOFqdXlbFcBEmoJUHPiyDRPcBOCdCbHa6Cd6qgh0ZG/xU9rMQX+XA9JEvVwYsAAAAASUVORK5CYII=");
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
    key: "p",
    icon: 0,
  },
  erasor: {
    cursor: "crosshair",
    key: "e",
    icon: 1,
  },
  bucket: {
    cursor: "crosshair",
    key: "b",
    icon: 2,
  },
  rect: {
    cursor: "crosshair",
    key: "r",
    icon: 3,
  },
  circle: {
    cursor: "crosshair",
    key: "c",
    icon: 4,
  },
  line: {
    cursor: "crosshair",
    key: "l",
    icon: 5,
  },
  select: {
    cursor: "cell",
    key: "s",
    icon: 6,
  },
  move: {
    cursor: "move",
    key: "m",
    icon: 7,
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

function makeCanvas(width, height) {

  return {

    width: width,
    height: height,
    pixels: Array(width * height * 4).fill(0),
    blend: "alpha",
    scissorRect: null,

    clear() {
      this.pixels = Array(this.width * this.height * 4).fill(0);
    },

    load(pixels) {
      if (pixels.length !== this.width * this.height * 4) {
        throw new Error("not loading the correct canvas bro");
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

    toImageData() {
      return new window.ImageData(
        new Uint8ClampedArray(this.pixels),
        this.width,
        this.height,
      );
    },

    clampPt(pt) {
      return [clamp(pt[0], 0, this.width), clamp(pt[1], 0, this.height)];
    },
  };
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

  const ed = {
    canvasEl: conf.canvas,
    ctx: conf.canvas.getContext("2d"),
    scale: 1,
    width: conf.width,
    height: conf.height,
    frames: [makeCanvas(conf.width, conf.height)],
    curFrame: 0,
    tmpCanvas: makeCanvas(conf.width, conf.height),
    mouseDown: false,
    mousePressed: false,
    mousePos: [0, 0],
    mousePosPrev: [0, 0],
    mouseStartPos: undefined,
    tool: "pen",
    color: [0, 0, 0, 255],
    colors: conf.colors || [
      [0, 0, 0, 255],
      [255, 255, 255, 255],
      [255, 255, 128, 255],
      [0, 128, 128, 255],
      [128, 0, 255, 255],
      [255, 0, 128, 255],
      [0, 255, 255, 255],
      [255, 0, 255, 255],
      //     [88, 0, 215, 255],
    ],
    offset: [0, 0],
    states: [],
    stateOffset: 0,
    modified: false,
  };

  pushState();
  scaleFit();
  ed.ctx.imageSmoothingEnabled = false;

  function toCanvasPos(pt) {
    const x = ~~((pt[0] - ed.offset[0]) / ed.scale);
    const y = ~~((pt[1] - ed.offset[1]) / ed.scale);

    return [x, y];
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
    const canvas = makeCanvas(ed.width, ed.height);
    canvas.load(ed.frames[ed.curFrame].pixels);
    ed.frames.splice(ed.curFrame, 0, canvas);
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

    const [mx, my] = ed.mousePos;

    return mx >= x && mx <= x + w && my >= y && my <= y + h;

  }

  function pushState() {
    if (ed.states.length >= MAX_STATES) {
      return;
    }

    if (ed.stateOffset > 0) {
      ed.states.splice(ed.states.length - ed.stateOffset, ed.stateOffset);
      ed.stateOffset = 0;
    }

    ed.states.push(deepCopy(ed.frames));
  }

  function undo() {

    if (ed.stateOffset >= ed.states.length - 1) {
      return;
    }

    ed.stateOffset++;
    ed.frames = deepCopy(ed.states[ed.states.length - ed.stateOffset - 1]);
    if (ed.curFrame >= ed.frames.length) {
      ed.curFrame = ed.frames.length - 1;
    }

  }

  function redo() {

    if (ed.stateOffset === 0) {
      return;
    }

    ed.stateOffset--;
    ed.frames = deepCopy(ed.states[ed.states.length - ed.stateOffset - 1]);

  }

  function render() {
    let hovering = false;
    let tooltip;
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

    if (canvas.scissorRect) {
      const p1 = canvas.scissorRect[0];
      const p2 = canvas.scissorRect[1];
      ctx.strokeStyle = colorCSS([0, 0, 0, 255]);
      ctx.setLineDash([5, 5]);
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
        const c =
          i === ed.curFrame ? [255, 255, 255, 255] : [230, 230, 230, 255];

        ctx.fillStyle = colorCSS(c);
        ctx.fillRect(ox + x, oy, w, -h);
        drawText(ctx, `${i}`, ox + x + tx, oy - h + ty, ts);
        ctx.strokeStyle = colorCSS([0, 0, 0, 255]);
        ctx.strokeRect(ox + x, oy, w, -h);

        if (mouseInRect(ox + x, oy, w, -h)) {
          hovering = true;
          if (ed.mousePressed) {
            ed.curFrame = i;
          }
        }

        x += w;
      }
    }

    // cursor
    {
      const [x, y] = toCanvasPos(ed.mousePos);

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
    ed.colors.forEach((c, i) => {
      ctx.fillStyle = colorCSS(c);
      ctx.fillRect(0, i * 24, 24, 24);
      ctx.strokeStyle = colorCSS([0, 0, 0, 255]);
      ctx.strokeRect(0, i * 24, 24, 24);

      if (mouseInRect(0, i * 24, 24, 24)) {
        hovering = true;
        if (ed.mousePressed) {
          ed.color = ed.colors[i];
        }
      }
    });

    ed.colors.forEach((c, i) => {
      if (colorEq(c, ed.color)) {
        ctx.lineWidth = 4;
        ctx.strokeStyle = colorCSS([0, 0, 0, 255]);
        ctx.strokeRect(0, i * 24, 24, 24);
        ctx.lineWidth = 2;
      }
    });

    // tools
    {
      let y = 0;
      const w = 32;
      const h = 32;

      for (const tool in toolData) {
        const data = toolData[tool];
        const x = cw - w;

        if (mouseInRect(x, y, w, h)) {
          hovering = true;
          tooltip = `${tool} (${data.key})`;
          if (ed.mousePressed) {
            ed.tool = tool;
          }
        }

        ctx.fillStyle = colorCSS([255, 255, 255, 255]);
        ctx.fillRect(x, y, w, h);
        ctx.drawImage(icons, 16 * data.icon, 0, 16, 16, x, y, w, h);
        ctx.strokeStyle = colorCSS([0, 0, 0, 255]);
        ctx.strokeRect(x, y, w, h);

        y += 32;
      }

      y = 0;

      for (const tool in toolData) {
        if (ed.tool === tool) {
          const x = cw - w;
          ctx.lineWidth = 4;
          ctx.strokeStyle = colorCSS([0, 0, 0, 255]);
          ctx.strokeRect(x, y, w, h);
          ctx.lineWidth = 2;
        }

        y += 32;
      }
    }

    // tooltip
    if (tooltip) {
      const padding = 3;
      const margin = 6;
      const size = 12;
      const w = tooltip.length * size + padding * 2;
      const h = size + padding * 2;
      const [mx, my] = ed.mousePos;
      const x = mx - w - margin;
      const y = my + margin;
      ctx.fillStyle = colorCSS([255, 255, 255, 255]);
      ctx.fillRect(x, y, w, h);
      drawText(ctx, tooltip, x + padding, y + padding, size);
      ctx.strokeStyle = colorCSS([0, 0, 0, 255]);
      ctx.strokeRect(x, y, w, h);
    }

    if (hovering) {
      ed.canvasEl.style.cursor = "pointer";
    } else {
      ed.canvasEl.style.cursor = toolData[ed.tool].cursor;
    }

    ed.mousePressed = false;
  }

  function update() {
    render();
    window.requestAnimationFrame(update);
  }

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
        ed.offset[0] -= e.deltaX;
        ed.offset[1] -= e.deltaY;
      }
    },

    mousedown: (e) => {

      ed.mouseDown = true;
      ed.mousePressed = true;
      ed.mousePosPrev = [ed.mousePos, ed.mousePos];
      ed.mousePos = [e.offsetX, e.offsetY];

      const [x, y] = toCanvasPos(ed.mousePos);
      const canvas = ed.frames[ed.curFrame];

      switch (ed.tool) {
        case "pen": {
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

        // TODO: don't trigger when it's just selected by mouse
        case "rect":
        case "circle":
        case "line":
        case "select":
          ed.mouseStartPos = [...ed.mousePos];
          break;
      }
    },

    mouseup: (e) => {

      ed.mouseDown = false;
      ed.mousePosPrev = [ed.mousePos, ed.mousePos];
      ed.mousePos = [e.offsetX, e.offsetY];
      ed.mouseStartPos = undefined;
      const canvas = ed.frames[ed.curFrame];

      switch (ed.tool) {
        case "rect":
        case "line":
        case "circle":
          canvas.merge(ed.tmpCanvas);
          ed.tmpCanvas.clear();
          break;
      }

      // TODO: should only push on change
      pushState();

    },

    mousemove: (e) => {

      ed.mousePosPrev = [...ed.mousePos];
      ed.mousePos = [e.offsetX, e.offsetY];

      const [px, py] = toCanvasPos(ed.mousePosPrev);
      const [x, y] = toCanvasPos(ed.mousePos);
      const canvas = ed.frames[ed.curFrame];

      if (!ed.mouseDown) {
        return;
      }

      let [sx, sy] = [0, 0];

      if (ed.mouseStartPos) {
        [sx, sy] = toCanvasPos(ed.mouseStartPos);
      }

      switch (ed.tool) {
        case "pen":
          canvas.line(px, py, x, y, ed.color);
          break;
        case "erasor":
          canvas.blend = "replace";
          canvas.line(px, py, x, y, [0, 0, 0, 0]);
          canvas.blend = "alpha";
          break;
        case "rect":
          ed.tmpCanvas.clear();
          ed.tmpCanvas.fillRect(sx, sy, x - sx, y - sy, ed.color);
          break;
        case "line":
          ed.tmpCanvas.clear();
          ed.tmpCanvas.line(sx, sy, x, y, ed.color);
          break;
        case "circle":
          ed.tmpCanvas.clear();
          ed.tmpCanvas.fillCircle(sx, sy, Math.max(x - sx, y - sy), ed.color);
          break;
        case "select": {
          const [dx, dy] = canvas.clampPt([x, y]);
          canvas.scissorRect = [
            [sx, sy],
            [dx, dy],
          ];
          ed.tmpCanvas.scissorRect = [
            [sx, sy],
            [dx, dy],
          ];
          break;
        }
      }

    },

    keydown: (e) => {

      if (!e.metaKey) {
        for (const tool in toolData) {
          const data = toolData[tool];
          if (data.key === e.key) {
            ed.tool = tool;

            return;
          }
        }
      }

      const curCanvas = ed.frames[ed.curFrame];

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
          ed.color = ed.colors[parseInt(e.key, 10) - 1] || ed.color;
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
            if (e.shiftKey) {
              redo();
            } else {
              undo();
            }
          }
          break;
        case "Backspace":
          if (curCanvas.scissorRect) {
            const [p1, p2] = curCanvas.scissorRect;
            curCanvas.scissorRect = null;
            ed.tmpCanvas.scissorRect = null;
            curCanvas.blend = "replace";
            curCanvas.fillRect(p1[0], p1[1], p2[0] - p1[0], p2[1] - p1[1], [0, 0, 0, 0]);
            curCanvas.blend = "alpha";
          }
          break;
        case "Escape":
          curCanvas.scissorRect = null;
          ed.tmpCanvas.scissorRect = null;
          break;
      }
    },
  };
  for (const e in events) {
    ed.canvasEl.addEventListener(e, events[e]);
  }

  update();

  const doc = {
    frames() {
      return ed.frames;
    },
    load(frames) {
      if (!frames || frames.length <= 0) {
        return;
      }

      ed.frames = [];
      frames.forEach((f) => {
        const c = makeCanvas(f.width, f.height);
        c.pixels = f.pixels;
        ed.frames.push(c);
      });
    },
    removeEventListeners() {
      for (const e in events) {
        ed.canvasEl.removeEventListener(e, events[e]);
      }
    },
  };

  if (conf.loadData) {
    doc.load(conf.loadData);
  }

  return doc;
}

export default pedit;
