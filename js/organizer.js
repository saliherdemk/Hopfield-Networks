class Organizer {
  constructor() {
    this.rows = 4;
    this.cols = 4;
    this.trainCanvases = [];
    this.testCanvas = new DrawableCanvas(
      "test-canvas-container",
      this.rows,
      this.cols,
    );
    this.hopfieldNetwork = new HopfieldNetwork(this.rows);
    this.calculationCanvas = new TextCanvas();
  }

  addCanvas() {
    const newCanvas = new DrawableCanvas(
      "train-canvas-container",
      this.rows,
      this.cols,
    );
    this.trainCanvases.push(newCanvas);
  }

  removeCanvas() {
    this.trainCanvases.length > 1 && this.trainCanvases.pop()?.remove();
  }

  train() {
    const data = this.trainCanvases.map((canvas) =>
      canvas
        .getGrid()
        .flat()
        .map((v) => [v]),
    );
    this.hopfieldNetwork.train(data);
  }

  fix() {
    const testPattern = this.testCanvas.getGrid().flat();
    const completedPattern = this.hopfieldNetwork.recallPattern(testPattern);
    const errSpan = document.getElementById("err-span");

    if (completedPattern) {
      const updatedGrid = Array.from({ length: this.rows }, (_, i) =>
        completedPattern
          .getData()
          .slice(i * this.cols, (i + 1) * this.cols)
          .map((x) => x[0]),
      );
      this.testCanvas.setGrid(updatedGrid);
      errSpan.classList.remove("active");
      return;
    }
    errSpan.classList.add("active");
  }
}
