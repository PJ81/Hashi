import * as Const from "./const.js";
import Game from "./game.js";
import Island from "./island.js";

class Hashi extends Game {
  countX: number;
  countY: number;
  maxIslands: number;
  islands: Island[];
  islandsTmp: Island[];
  board: string[];
  rnd: (n: number) => number;
  invDir: (d: number) => number;

  constructor(cx = 10, cy = 10, den = 25) {
    super();
    this.countX = cx;
    this.countY = cy;
    this.maxIslands = (cx * cy * den) / 100;
    this.islands;
    this.islandsTmp;
    this.board;

    this.invDir = (d: number): number => (d === 0 ? 2 : d === 1 ? 3 : d === 2 ? 0 : 1);
    this.rnd = (n: number): number => Math.floor(Math.random() * n);
    this.update = (dt) => { };

    this.create();
    this.loop();
  }

  draw() {
    for (let r = 0; r < this.countY; r++) {
      for (let c = 0; c < this.countX; c++) {
        if (this.board[c + r * this.countX] === "#") {
          this.ctx.rect(22 + c * Const.SIZE + Const.SIZE * c, 22 + r * Const.SIZE + Const.SIZE * r, Const.SIZE, Const.SIZE);
        }
      }
    }
    this.ctx.stroke();
  }

  create() {
    do {
      this.islands = [];
      this.islandsTmp = [];
      this.board = new Array(this.countX * this.countY);
      this.board.fill(" ");
      const i = new Island(this.rnd(this.countX), this.rnd(this.countY));
      this.islands.push(i);
      this.board[i.x + this.countX * i.y] = "#";
      this.createIslands();
    } while (this.islands.length + this.islandsTmp.length < this.maxIslands)

    // for (let r = 0; r < this.countY; r++) {
    //   let str = "";
    //   for (let c = 0; c < this.countX; c++) {
    //     str += this.board[c + r * this.countX];
    //   }
    //   console.log(str);
    // }
    // console.log(this.islands.length + this.islandsTmp.length);

    this.islands.push(...this.islandsTmp);
    this.islandsTmp = [];
  }

  createIslands() {
    const len = this.islands.length;
    if (len < 1 || len >= this.maxIslands) {
      return;
    }
    const i = this.islands.shift();
    this.islandsTmp.push(i);
    let dir = this.rnd(4), tries: number;
    out:
    for (let k = 0; k < 4; k++) {
      if (i.hasFreeConnection(dir)) {
        tries = 0;
        while (tries++ < 50) {
          let p: number, ex: number, ey: number, dx = 0, dy = 0;
          switch (dir) {
            case 0: p = this.rnd(i.y) + 1; dy = -1; ex = i.x; ey = i.y - p; break; // N
            case 1: p = this.rnd(this.countX - i.x - 1) + 1; dx = 1; ex = i.x + p; ey = i.y; break; // L
            case 2: p = this.rnd(this.countY - i.y - 1) + 1; dy = 1; ex = i.x; ey = i.y + p; break; // S
            case 3: p = this.rnd(i.x) + 1; dx = -1; ex = i.x - p; ey = i.y; break; // W
          }
          if (this.trySetIsland(i.x, i.y, ex, ey, dx, dy)) {
            this.islands.push(...this.islandsTmp);
            this.islandsTmp = [];
            const ni = new Island(ex, ey);
            i.setConnection(dir, ni);
            ni.setConnection(this.invDir(dir), i);
            this.islands.push(ni);
            this.randomize(this.islands);
            break out;
          }
        }
        dir = (dir + 1) % 4;
      }
    }
    this.createIslands();
  }

  randomize(arr: Island[]) {
    for (let l = arr.length - 1, i = l; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  trySetIsland(x: number, y: number, ex: number, ey: number, dx: number, dy: number) {
    let steps = 0;
    do {
      steps++;
      x += dx;
      y += dy;
      if (x < 0 || x >= this.countX || y < 0 || y >= this.countY || this.board[x + this.countX * y] !== " ") return false;
    } while (!(x === ex && y === ey));

    this.board[x + this.countX * y] = "#";
    while (--steps) {
      x -= dx;
      y -= dy;
      this.board[x + this.countX * y] = ".";
    };
    return true;
  }
}

new Hashi(15, 15, 15);