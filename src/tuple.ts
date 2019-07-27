import Island from "./island.js";

enum TType {
  PUZZLE = 1,
  GUESS = 2
};

class Tuple {
  island: Island;
  str: string;

  constructor() {
    this.island = null;
    this.str = " ";
  }

  set(i: Island, str: string) {
    this.island = i;
    this.str = str;
  }
}

class Cell {
  puzzle: Tuple;
  guess: Tuple;

  constructor(i: Island = null) {
    this.puzzle = new Tuple();
    this.guess = new Tuple();
  }

  set(i: Island, what: TType) {
    if (what === TType.GUESS) {
      this.guess.set(i, "#");
    } else {
      this.puzzle.set(i, "#");
    }
  }
}

export {
  TType, Tuple, Cell
};