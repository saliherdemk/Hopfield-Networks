class HopfieldNetwork {
  constructor(size) {
    this.size = size;
    this.weights = this.createWeightMatrix();
    this.maskMatrix = this.createMaskMatrix();
    this.maxIterations = 5;
  }

  setMaxIterations(value) {
    this.maxIterations = value;
  }

  createWeightMatrix() {
    const data = Array(this.size * this.size)
      .fill(0)
      .map(() => Array(this.size * this.size).fill(0));
    return new Matrix(data);
  }

  createMaskMatrix() {
    const data = Array(this.size * this.size)
      .fill(0)
      .map((_, i) =>
        Array(this.size * this.size)
          .fill(0)
          .map((_, j) => (i === j ? 0 : 1)),
      );
    return new Matrix(data);
  }

  train(patterns) {
    this.weights = this.createWeightMatrix();

    const data = [];
    console.log(JSON.stringify(patterns));

    patterns.forEach((_pattern) => {
      const pattern = new Matrix(_pattern);
      const prevWeights = this.weights;
      const patternT = pattern.transpose();
      const a = pattern.mul(patternT);
      const b = this.weights.add(a);
      this.weights = b.elementWiseMul(this.maskMatrix);
      data.push([
        pattern,
        patternT,
        a,
        prevWeights,
        b,
        this.maskMatrix,
        this.weights,
      ]);
    });
    organizer.calculationCanvas.setTrainData(data);
  }

  recallPattern(inputPattern) {
    let state = new Matrix(inputPattern);
    let isConverged = false;

    const data = [];

    for (let i = 0; i < this.maxIterations; i++) {
      const prevState = state;

      const weightedSum = this.weights.mul(state);
      state = new Matrix(
        weightedSum.getData().map((value) => (value >= 0 ? 1 : -1)),
      );

      data.push([this.weights, prevState, weightedSum, state]);

      if (
        JSON.stringify(state.getData()) === JSON.stringify(prevState.getData())
      ) {
        isConverged = true;
        break;
      }
    }
    organizer.calculationCanvas.setTestData(data);
    return isConverged ? state : null;
  }
}
