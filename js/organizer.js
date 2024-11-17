class Organizer {
  constructor() {
    this.rows = 5;
    this.cols = 5;
    this.trainCanvases = [];
    this.testCanvas = new DrawableCanvas(
      "test-canvas-container",
      this.rows,
      this.cols,
    );
    this.hopfieldNetwork = new HopfieldNetwork();
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
    console.log(this.trainCanvases.map((canvas) => canvas.getGrid()));
  }

  fix() {}
}
