import Island from "./island.js";
import Tuple from "./tuple.js";

export default class Puzzle {
  cntX: number;
  cntY: number;
  maxIslands: number;
  board: Tuple[];

  rnd: (n: number) => number;
  invDir: (d: number) => number;
  spotIsFree: (x: any, y: any) => boolean;
  rndArray: (arr: any[]) => any;

  constructor(cx = 11, cy = 11, dens = 35) {
    this.cntX = cx;
    this.cntY = cx;
    this.maxIslands = Math.floor(cx * cy * dens / 100);
    this.invDir = (d: number): number => (d === 0 ? 2 : d === 1 ? 3 : d === 2 ? 0 : 1);
    this.rnd = (n: number): number => Math.floor(Math.random() * n);
    this.rndArray = (arr: any[]) => { return arr[this.rnd(arr.length)]; }
  }

  draw(ctx: CanvasRenderingContext2D) {
    //this.ctx.beginPath();
    //this.lines.forEach(e => e.draw(this.ctx));
    //this.ctx.stroke();

    ctx.beginPath();
    this.board.forEach(e => { if (e.island) e.island.draw(ctx) });
    ctx.stroke();
  }

  create() {
    let islands: Tuple[];
    do {
      this.board = new Array(this.cntX * this.cntY).fill(null).map(e => new Tuple());
      const i = new Island(this.rnd(this.cntX), this.rnd(this.cntY));
      this.board[i.x + i.y * this.cntX].set(i);
      this.createIslands(0, 0);
      islands = this.board.filter(e => e.island);
      if (islands.length >= this.maxIslands) break;
    } while (true);

    islands.forEach(e => e.island.selected = false);
  }

  createIslands(test: number, mi: number) {
    if (test > 1000 || mi >= this.maxIslands) {
      return;
    }

    const i = this.rndArray(this.board.filter(e => e.island)).island;
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

          if (ex > -1 && ex < this.cntX && ey > -1 && ey < this.cntY && !this.board[ex + ey * this.cntX].island && this.setIsland(i, ex, ey, dir)) {
            mi++;
            test = 0;
            break out;
          }
        }
        dir = (dir + 1) % 4;
      }
    }
    this.createIslands(test + 1, mi);
  }

  setIsland(i: Island, ex: number, ey: number, dir: number) {
    let steps = 0, x = i.x, y = i.y;
    const dx = dir === 1 ? 1 : dir === 3 ? -1 : 0, dy = dir === 0 ? -1 : dir === 2 ? 1 : 0;
    do {
      steps++;
      x += dx;
      y += dy;
      if (x < 0 || x >= this.cntX || y < 0 || y >= this.cntY || this.board[x + this.cntX * y].str !== " ") return false;
    } while (!(x === ex && y === ey));

    const ni = new Island(ex, ey);
    this.board[x + this.cntX * y].set(ni);
    i.setConnection(dir, ni, false);
    ni.setConnection(this.invDir(dir), i, false);

    const str = dx != 0 ? (Math.random() < .06 ? "H" : "h") : (Math.random() < .06 ? "V" : "v");
    if (str === "H" || str === "V") {
      ni.count = i.count = 2;
    }

    while (--steps) {
      x -= dx;
      y -= dy;
      this.board[x + this.cntX * y].str = str;
    }

    return true;
  }

  getIsland(x: number, y: number): Island {
    for (const e of this.board.filter(e => e.island)) {
      if (e.island.hasPoint(x, y))
        return e.island;
    }
    return null;
  }
}

new Puzzle();