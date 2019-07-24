import Island from "./island.js";

export default class Tuple {
  island: Island;
  str: string;

  constructor(i: Island = null) {
    this.island = i;
    this.str = " ";
  }

  set(i: Island) {
    this.island = i;
    this.str = "#";
  }
}