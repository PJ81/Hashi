import Island from "./island.js";
import { Cell, TType } from "./tuple.js";

export default class Puzzle {
  cntX: number;
  cntY: number;
  maxIslands: number;

  rnd: (n: number) => number;
  invDir: (d: number) => number;
  rndArray: (arr: any[]) => any;

  constructor(cx, cy, dens) {
    this.cntX = cx;
    this.cntY = cx;
    this.maxIslands = Math.floor(cx * cy * dens / 100);
    this.invDir = (d: number): number => (d === 0 ? 2 : d === 1 ? 3 : d === 2 ? 0 : 1);
    this.rnd = (n: number): number => Math.floor(Math.random() * n);
    this.rndArray = (arr: any[]) => { return arr[this.rnd(arr.length)]; }
  }

  create(): Cell[] {
    let islands: Cell[];
    let board: Cell[];
    while (true) {
      board = new Array(this.cntX * this.cntY).fill(null).map(e => new Cell());
      const i = new Island(this.rnd(this.cntX), this.rnd(this.cntY)),
        ni = new Island(i.x, i.y);
      board[i.x + i.y * this.cntX].set(i, TType.PUZZLE);
      board[i.x + i.y * this.cntX].set(ni, TType.GUESS);
      this.createIslands(board, 0, 0);
      islands = board.filter(e => e.puzzle.island);
      if (islands.length >= this.maxIslands) break;
    }
    return board;
  }

  createIslands(board: Cell[], test: number, mi: number) {
    if (test > 1000 || mi >= this.maxIslands) {
      return;
    }

    const i = this.rndArray(board.filter(e => e.puzzle.island)).puzzle.island;
    let dir = this.rnd(4), tries: number;
    out:
    for (let k = 0; k < 4; k++) {
      if (i.hasFreeConnection(dir)) {
        tries = 0;
        while (tries++ < 50) {
          let p: number, ex: number, ey: number;
          switch (dir) {
            case 0: p = this.rnd(i.y) + 1; ex = i.x; ey = i.y - p; break; // N
            case 1: p = this.rnd(this.cntX - i.x - 1) + 1; ex = i.x + p; ey = i.y; break; // L
            case 2: p = this.rnd(this.cntY - i.y - 1) + 1; ex = i.x; ey = i.y + p; break; // S
            case 3: p = this.rnd(i.x) + 1; ex = i.x - p; ey = i.y; break; // W
          }

          if (ex > -1 && ex < this.cntX && ey > -1 && ey < this.cntY && !board[ex + ey * this.cntX].puzzle.island && this.setIsland(board, i, ex, ey, dir)) {
            mi++;
            test = -1;
            break out;
          }
        }
        dir = (dir + 1) % 4;
      }
    }
    this.createIslands(board, test + 1, mi);
  }

  setIsland(board: Cell[], i: Island, ex: number, ey: number, dir: number) {
    let steps = 0, x = i.x, y = i.y;
    const dx = dir === 1 ? 1 : dir === 3 ? -1 : 0, dy = dir === 0 ? -1 : dir === 2 ? 1 : 0;
    do {
      steps++;
      x += dx;
      y += dy;
      if (x < 0 || x >= this.cntX || y < 0 || y >= this.cntY || board[x + this.cntX * y].puzzle.str !== " ") return false;
    } while (!(x === ex && y === ey));

    const ni = new Island(ex, ey),
      nni = new Island(ex, ey);
    board[x + this.cntX * y].set(ni, TType.PUZZLE);
    board[x + this.cntX * y].set(nni, TType.GUESS);

    const str = dx !== 0 ? (Math.random() < .25 ? "H" : "h") : (Math.random() < .25 ? "V" : "v");
    i.setConnection(dir, ni, str);
    ni.setConnection(this.invDir(dir), i, str);

    while (--steps) {
      x -= dx;
      y -= dy;
      board[x + this.cntX * y].puzzle.str = str;
    }
    return true;
  }
}
