class DrawableCanvas {
  constructor(parentId, rows = 5, cols = 5) {
    this.rows = rows;
    this.cols = cols;
    this.grid = Array.from({ length: this.rows }, () =>
      Array(this.cols).fill(-1),
    );
    this.rectWidth = 0;
    this.rectHeight = 0;

    this.p5Instance = new p5((p) => {
      p.setup = () => {
        p.createCanvas(150, 150).parent(document.getElementById(parentId));
        this.rectWidth = p.width / this.cols;
        this.rectHeight = p.height / this.rows;
        p.drawGrid();
      };

      p.drawGrid = () => {
        for (let i = 0; i < this.rows; i++) {
          for (let j = 0; j < this.cols; j++) {
            p.fill(this.grid[i][j] === 1 ? 0 : 255);
            p.stroke(0);
            p.rect(
              j * this.rectWidth + 0.5,
              i * this.rectHeight + 0.5,
              this.rectWidth - 1,
              this.rectHeight - 1,
            );
          }
        }
      };

      const toggleRectangle = (x, y) => {
        if (x >= 0 && x < this.cols && y >= 0 && y < this.rows) {
          this.grid[y][x] = this.grid[y][x] === -1 ? 1 : -1;
          p.drawGrid();
        }
      };

      p.mouseDragged = () => {
        const x = Math.floor(p.mouseX / this.rectWidth);
        const y = Math.floor(p.mouseY / this.rectHeight);
        toggleRectangle(x, y);
      };

      p.mousePressed = () => {
        const x = Math.floor(p.mouseX / this.rectWidth);
        const y = Math.floor(p.mouseY / this.rectHeight);
        toggleRectangle(x, y);
      };
    });
  }

  remove() {
    this.p5Instance.remove();
  }

  getGrid() {
    return this.grid;
  }

  setGrid(newGrid) {
    this.grid = newGrid.map((row) => [...row]);
    this.p5Instance.drawGrid();
  }
}
