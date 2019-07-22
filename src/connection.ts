import Island from "./island.js";

export default class Connection {
  count: number;
  visited: boolean;
  island: Island;
  dir: number;

  constructor(dir: number, i: Island) {
    this.count = 1;
    this.island = i;
    this.dir = dir;
    this.visited = false;
  }
}