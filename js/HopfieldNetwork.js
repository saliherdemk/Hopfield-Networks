class HopfieldNetwork {
  constructor(size) {
    this.size = size;
    this.weights = this.createWeightMatrix();
  }

  createWeightMatrix() {
    let weights = Array(this.size)
      .fill(0)
      .map(() => Array(this.size).fill(0));
    return weights;
  }
}
