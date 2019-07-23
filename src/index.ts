import * as Const from "./const.js";
import Game from "./game.js";
import Island from "./island.js";
import Line from "./line.js";

class Hashi extends Game {
  countX: number;
  countY: number;
  maxIslands: number;
  selected: Island;
  islands: Island[];
  islandsTmp: Island[];
  lines: Line[];
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
    this.selected = null;

    this.canvas.width = cx * Const.BOX_SIZE + cx * Const.BOX_SIZE + Const.BOX_SIZE;
    this.canvas.height = cy * Const.BOX_SIZE + cy * Const.BOX_SIZE + Const.BOX_SIZE;
    this.ctx.font = "20px Consolas";

    this.canvas.addEventListener("click", (me) => this.click(me, null));
    this.canvas.addEventListener("touchstart", (te) => this.click(null, te));
    this.invDir = (d: number): number => (d === 0 ? 2 : d === 1 ? 3 : d === 2 ? 0 : 1);
    this.rnd = (n: number): number => Math.floor(Math.random() * n);
    this.update = (dt) => { };
    this.draw = () => {
      this.ctx.beginPath();
      this.lines.forEach(e => e.draw(this.ctx));
      this.ctx.stroke();

      this.ctx.beginPath();
      this.islands.forEach(e => e.draw(this.ctx));
      this.ctx.stroke();
    }
    this.create();
    this.loop();
  }

  //#region SELECTION
  click(me: MouseEvent, te: TouchEvent) {
    let x: number, y: number;
    if (me) {
      x = me.clientX - (me.srcElement as HTMLCanvasElement).offsetLeft;
      y = me.clientY - (me.srcElement as HTMLCanvasElement).offsetTop;
    } else {
      x = te.touches[0].clientX - (te.srcElement as HTMLCanvasElement).offsetLeft;
      y = te.touches[0].clientY - (te.srcElement as HTMLCanvasElement).offsetTop;
    }

    for (let e = 0, l = this.islands.length; e < l; e++) {
      const i = this.islands[e];
      if (i.hasPoint(x, y)) {
        this.selectIsland(i)
        return;
      }
    }
  }

  selectIsland(i: Island) {
    if (!this.selected) {
      this.selected = i;
      i.selected = true;
    } else {
      if (i !== this.selected && (i.x === this.selected.x || i.y === this.selected.y)) {
        const ln = new Line(this.selected.x, this.selected.y, i.x, i.y);
        if (this.updateLine(ln, false)) {
          this.selected.selected = false;
          this.selected = null;
          return;
        }

        const rx = i.x - this.selected.x, ry = i.y - this.selected.y,
          dx = rx < 0 ? -1 : rx === 0 ? 0 : 1,
          dy = ry < 0 ? -1 : ry === 0 ? 0 : 1;
        let x = this.selected.x, y = this.selected.y, f = false;
        while (x !== i.x || y !== i.y) {
          x += dx; y += dy;
          if (this.board[x + y * this.countX] !== " ") break;
          this.board[x + y * this.countX] = "+";
        }
        if (x === i.x && y === i.y) {
          f = true;
          this.updateLine(ln, true);
        }
        this.board.forEach((el, idx) => {
          if (el === "+")
            this.board[idx] = f ? "." : " ";
        });
      }
      this.selected.selected = false;
      this.selected = null;
    }
  }

  updateLine(ln: Line, add: boolean): boolean {
    for (let l = this.lines.length - 1, r = l; r > -1; r--) {
      const li = this.lines[r];
      if (li.equals(ln)) {
        if (!li.nextStep()) {
          this.clearLine(li);
          this.lines.splice(r, 1);
        }
        return true;
      }
    }
    if (add) this.lines.push(ln);
    return false;
  }

  clearLine(li: Line) {
    let s: number, e: number, step = 1;
    if (li.bxe === li.bxs) {
      step = this.countY;
      s = li.bxe + li.bys * this.countX;
      e = li.bxe + li.bye * this.countX;
    } else {
      s = li.bxs + li.bye * this.countX;
      e = li.bxe + li.bye * this.countX;
    }
    for (let z = s; z < e; z += step) {
      if (this.board[z] === ".") {
        this.board[z] = " ";
      }
    }
  }

  //#endregion

  //#region CREATE ISLANDS
  create() {
    do {
      this.lines = [];
      this.islands = [];
      this.islandsTmp = [];
      this.board = new Array(this.countX * this.countY);
      this.board.fill(" ");
      const i = new Island(this.rnd(this.countX), this.rnd(this.countY));
      this.islands.push(i);
      this.board[i.x + this.countX * i.y] = "#";
      this.createIslands();
    } while (this.islands.length + this.islandsTmp.length < this.maxIslands)
    this.islands.push(...this.islandsTmp);
    this.islandsTmp = [];
    this.updateConnections(this.islands[0]);
    this.board.forEach((el, idx) => {
      if (el === ".")
        this.board[idx] = " ";
    });
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

  updateConnections(i: Island) {
    for (const c of i.connections) {
      if (c && !c.visited && c.count < 2) {
        c.visited = true;
        if (Math.random() < .06) {
          c.count = 2;
          c.island.connections[this.invDir(c.dir)].count = 2;
        }
        this.updateConnections(c.island);
      }
    }
  }

  randomize(arr: Island[]) {
    for (let l = arr.length - 1, i = l; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  //#endregion
}

new Hashi(11, 11, 35);