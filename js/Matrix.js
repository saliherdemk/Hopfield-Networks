class Matrix {
  constructor(data) {
    this.data = Array.isArray(data[0]) ? data : data.map((value) => [value]);
    this.shape = [data.length, Array.isArray(data[0]) ? data[0].length : 1];
  }

  getData() {
    return this.data;
  }

  fill(value) {
    for (let i = 0; i < this.shape[0]; i++) {
      for (let j = 0; j < this.shape[1]; j++) {
        this.data[i][j] = value;
      }
    }
  }

  add(otherMatrix) {
    let [rows1, cols1] = this.shape;
    let [rows2, cols2] = otherMatrix.shape;

    if (
      (rows1 !== rows2 && rows1 !== 1 && rows2 !== 1) ||
      (cols1 !== cols2 && cols1 !== 1 && cols2 !== 1)
    ) {
      throw new Error("Matrices are not compatible for broadcasting");
    }

    let resultData = Array(Math.max(rows1, rows2))
      .fill(0)
      .map(() => Array(Math.max(cols1, cols2)).fill(0));

    for (let i = 0; i < Math.max(rows1, rows2); i++) {
      for (let j = 0; j < Math.max(cols1, cols2); j++) {
        let value1 =
          i < rows1 && j < cols1
            ? this.data[i][j]
            : this.data[i % rows1][j % cols1];
        let value2 =
          i < rows2 && j < cols2
            ? otherMatrix.data[i][j]
            : otherMatrix.data[i % rows2][j % cols2];
        resultData[i % rows1][j % cols1] = value1 + value2;
      }
    }

    return new Matrix(resultData);
  }

  mul(otherMatrix) {
    if (this.shape[1] !== otherMatrix.shape[0]) {
      throw new Error(
        "Number of columns of the first matrix must equal the number of rows of the second matrix",
      );
    }

    let result = Array(this.shape[0])
      .fill(0)
      .map(() => Array(otherMatrix.shape[1]).fill(0));

    for (let i = 0; i < this.shape[0]; i++) {
      for (let j = 0; j < otherMatrix.shape[1]; j++) {
        for (let k = 0; k < this.shape[1]; k++) {
          result[i][j] += this.data[i][k] * otherMatrix.data[k][j];
        }
      }
    }

    return new Matrix(result);
  }

  elementWiseMul(otherMatrix) {
    const [rows1, cols1] = this.shape;
    const [rows2, cols2] = otherMatrix.shape;

    if (rows1 !== rows2 || cols1 !== cols2) {
      throw new Error(
        "Matrices must have the same dimensions for element-wise multiplication",
      );
    }

    const resultData = Array(rows1)
      .fill(0)
      .map(() => Array(cols1).fill(0));

    for (let i = 0; i < rows1; i++) {
      for (let j = 0; j < cols1; j++) {
        resultData[i][j] = this.data[i][j] * otherMatrix.data[i][j];
      }
    }

    return new Matrix(resultData);
  }

  transpose() {
    let transposed = Array(this.shape[1])
      .fill(0)
      .map(() => Array(this.shape[0]).fill(0));

    for (let i = 0; i < this.shape[0]; i++) {
      for (let j = 0; j < this.shape[1]; j++) {
        transposed[j][i] = this.data[i][j];
      }
    }

    return new Matrix(transposed);
  }

  scale(x) {
    let scaled = Array(this.shape[1])
      .fill(0)
      .map(() => Array(this.shape[0]).fill(0));

    for (let i = 0; i < this.shape[0]; i++) {
      for (let j = 0; j < this.shape[1]; j++) {
        scaled[i][j] = this.data[i][j] * x;
      }
    }
    return new Matrix(scaled);
  }
}
