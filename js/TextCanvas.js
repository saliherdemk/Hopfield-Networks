class TextCanvas {
  constructor() {
    this.minWidth = 1675;
    this.height = 500;
    this.rowHeight = 350;
    this.baseYOffset = 20;

    this.trainData = [];
    this.trainH = ["X", "XT", "A", "W", "B", "M", "W^"];
    this.trainOps = ["@", "=", "+", "=", "⊙", "="];
    this.trainXH = [15, ...Array.from({ length: 6 }, (_, i) => 175 + i * 275)];
    this.trainX = [0, ...Array.from({ length: 6 }, (_, i) => 50 + i * 275)];
    this.trainXOps = Array.from({ length: 6 }, (_, i) => 40 + i * 275);

    this.testData = [];
    this.testH = ["W", "S", "A", "S^"];
    this.testOps = ["@", "=", "sgn ="];
    this.testXH = [175, 565, 1065, 1565];
    this.testX = Array.from({ length: 4 }, (_, i) => i * 500 + 50);
    this.testXOps = [565, 950, 1450].map((x) => x - 150);

    this.p5Instance = new p5((p) => {
      p.setup = () => {
        this.createCanvas(p);
      };
      p.windowResized = () => {
        this.resizeCanvas(p);
      };
    });
  }

  createCanvas(p) {
    p.createCanvas(Math.max(p.windowWidth, this.minWidth), this.height).parent(
      document.getElementById("calc-canvas"),
    );
    p.background(235);
  }

  resizeCanvas(p) {
    p.resizeCanvas(Math.max(p.windowWidth, this.minWidth), this.height);
    this.updateCanvas();
  }

  postAddRow() {
    this.height =
      [...this.trainData, ...this.testData].length * this.rowHeight + 120;
    this.p5Instance.windowResized();
  }

  setTrainData(data) {
    this.trainData = data;
    this.postAddRow();
  }

  setTestData(data) {
    this.testData = data;
    this.postAddRow();
  }

  updateCanvas() {
    const p = this.p5Instance;
    p.background(235);
    p.fill(0);
    p.textSize(12);

    if (this.trainData.length) {
      this.drawTitle(p, "Train", this.baseYOffset);
      this.drawTrainHeader(p);
      this.drawTrainData(p);
      this.drawTrainOps(p);
      this.drawInfo(p);
    }

    if (this.testData.length) {
      const testYOffset =
        this.baseYOffset + 60 + this.trainData.length * this.rowHeight;
      this.drawTitle(p, "Test", testYOffset - 60);
      this.drawTestHeader(p, testYOffset);
      this.drawTestData(p, testYOffset);
      this.drawTestOps(p, testYOffset);
    }
  }

  drawTitle(p, text, yOffset) {
    p.textSize(24);
    p.textAlign(p.CENTER, p.TOP);
    p.text(text, p.width / 2, yOffset);
    p.textSize(12);
  }

  centerX(x) {
    const p = this.p5Instance;
    return (p.width - this.minWidth) / 2 + x;
  }

  drawTrainHeader(p) {
    this.drawTextRow(p, this.trainH, this.trainXH, this.baseYOffset + 30);
  }

  drawTrainOps(p) {
    for (let i = -1; i < this.trainData.length; i++) {
      const yOffset =
        i === -1
          ? this.baseYOffset + 30
          : this.baseYOffset + 195 + i * this.rowHeight;
      this.drawTextRow(p, this.trainOps, this.trainXOps, yOffset);
    }
  }

  drawInfo(p) {
    p.textSize(9);
    p.textAlign(p.CENTER, p.TOP);
    p.text(
      "A more formal way to do it is B−M×I, where M is the number of states and I is the identity matrix.\n This is the same as performing element-wise multiplication of B with M, where M is the mask matrix.",
      p.width / 2 + 325,
      this.baseYOffset,
    );
    p.textSize(12);
  }

  drawTrainData(p) {
    let yOffset = this.baseYOffset + 60;
    this.trainData.forEach((row) => {
      row.forEach((matrix, index) => {
        const y = yOffset + (index == 1 ? 125 : 0);
        this.drawMatrix(p, matrix, this.trainX[index], y);
      });
      yOffset += this.rowHeight;
    });
  }

  drawTestHeader(p, baseYOffset) {
    this.drawTextRow(p, this.testH, this.testXH, baseYOffset + 30);
  }

  drawTestOps(p, baseYOffset) {
    for (let i = -1; i < this.testData.length; i++) {
      const yOffset =
        i === -1 ? baseYOffset + 30 : baseYOffset + 195 + i * this.rowHeight;
      this.drawTextRow(p, this.testOps, this.testXOps, yOffset);
    }
  }

  drawTestData(p, baseYOffset) {
    let yOffset = baseYOffset + 60;
    this.testData.forEach((row) => {
      row.forEach((matrix, index) => {
        this.drawMatrix(p, matrix, this.testX[index], yOffset);
      });
      yOffset += this.rowHeight;
    });
  }

  drawMatrix(p, matrix, x, y) {
    const cellSize = 15;
    const padding = 10;
    const rectWidth = matrix.shape[1] * cellSize + padding * 2 - 5;
    const rectHeight = matrix.shape[0] * cellSize + padding * 2 - 5;
    const centeredX = this.centerX(x);

    p.fill(240);
    p.rect(centeredX, y, rectWidth, rectHeight, 10);
    this.drawMatrixValues(p, matrix, x, y, cellSize, padding);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text(
      `${matrix.shape[0]} × ${matrix.shape[1]}`,
      centeredX + rectWidth / 2,
      y + rectHeight + padding + 5,
    );
  }

  drawMatrixValues(p, matrix, x, y, cellSize, padding) {
    p.fill(0);
    p.textAlign(p.CENTER, p.CENTER);

    for (let i = 0; i < matrix.shape[0]; i++) {
      for (let j = 0; j < matrix.shape[1]; j++) {
        const value = matrix.data[i][j];
        const centerX = this.centerX(x) + padding + j * cellSize + cellSize / 2;
        const centerY = y + padding + i * cellSize + cellSize / 2;

        p.text(value, centerX, centerY);
      }
    }
  }

  drawTextRow(p, texts, offsets, y) {
    p.textAlign(p.CENTER, p.TOP);
    texts.forEach((text, index) => {
      p.text(text, this.centerX(offsets[index]), y);
    });
  }
}
