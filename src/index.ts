import Game from "./game.js";
import Island from "./island.js";
import Puzzle from "./puzzle.js";
import { Cell } from "./tuple.js";
import Line from "./line.js";

class Hashi extends Game {
  cntX: number;
  cntY: number;
  puzzle: Puzzle;
  selected: Island;
  board: Cell[];
  lines: Line[];
  game_over: boolean;

  constructor(cx = 10, cy = 10, den = 25) {
    super();
    this.cntX = cx;
    this.cntY = cy;
    this.lines = [];
    this.selected = null;
    this.game_over = false;
    this.puzzle = new Puzzle(cx, cy, den);

    const BOX_SIZE = 21;
    this.canvas.width = cx * BOX_SIZE + cx * BOX_SIZE + BOX_SIZE;
    this.canvas.height = cy * BOX_SIZE + cy * BOX_SIZE + BOX_SIZE;
    this.ctx.font = "20px Consolas";
    this.ctx.lineWidth = 2;
    this.canvas.addEventListener("click", (me) => this.click(me, null));
    this.canvas.addEventListener("touchstart", (te) => this.click(null, te));

    this.update = (dt) => { };
    this.board = this.puzzle.create();
    this.loop();
  }

  draw() {
    this.ctx.beginPath();
    this.lines.forEach(e => e.draw(this.ctx));
    this.ctx.stroke();

    this.ctx.beginPath();
    this.board.forEach(e => { if (e.puzzle.island) e.puzzle.island.draw(this.ctx) });
    this.ctx.stroke();

    if (this.game_over) {
      this.ctx.fillStyle = "#00c";
      this.ctx.textAlign = "center";
      this.ctx.font = "40px Consolas";
      this.ctx.fillText("WELL DONE!", this.canvas.width >> 1, this.canvas.height >> 1);
      this.ctx.font = "20px Consolas";
      this.ctx.textAlign = "start";
    }
  }

  click(me: MouseEvent, te: TouchEvent) {
    if (this.game_over) return;

    let x: number, y: number;
    if (me) {
      x = me.clientX - (me.srcElement as HTMLCanvasElement).offsetLeft;
      y = me.clientY - (me.srcElement as HTMLCanvasElement).offsetTop;
    } else {
      x = te.touches[0].clientX - (te.srcElement as HTMLCanvasElement).offsetLeft;
      y = te.touches[0].clientY - (te.srcElement as HTMLCanvasElement).offsetTop;
    }
    const z = this.getIsland(x, y);
    z && this.selectIsland(z);
  }

  getIsland(x: number, y: number): Island {
    for (const e of this.board.filter(e => e.puzzle.island)) {
      if (e.puzzle.island.hasPoint(x, y))
        return e.puzzle.island;
    }
    return null;
  }

  selectIsland(i: Island) {
    if (!this.selected) {
      this.selected = i;
      i.selected = true;
    } else {
      if (i !== this.selected && (i.x === this.selected.x || i.y === this.selected.y)) {
        let dx = 0, dy = 0;
        if (i.x === this.selected.x) {
          dy = this.selected.y < i.y ? 1 : -1;
        } else {
          dx = this.selected.x < i.x ? 1 : -1;
        }

        let str = this.setPath(i, dx, dy);
        if (str.length > 0) {
          const x = this.selected.x, y = this.selected.y;
          let a: number, b: number;
          if (dx === 0) {
            a = dy > 0 ? 2 : 0;
            b = dy > 0 ? 0 : 2;
          } else {
            a = dx > 0 ? 1 : 3;
            b = dx > 0 ? 3 : 1;
          }

          if (str === "+") {
            const bi = this.board[x + y * this.cntX].guess.island.connections[a].str;
            if (dx === 0) {
              str = bi === " " ? "v" : bi === "v" ? "V" : " ";
            } else {
              str = bi === " " ? "h" : bi === "h" ? "H" : " ";
            }
          }

          this.board[x + y * this.cntX].guess.island.setConnection(a, i, str);
          this.board[i.x + i.y * this.cntX].guess.island.setConnection(b, this.selected, str);

          const ln = new Line(this.selected.x, this.selected.y, i.x, i.y);
          let f = false;
          for (let l = this.lines.length - 1, c = l; c > -1; c--) {
            const z = this.lines[c];
            if (z.equals(ln)) {
              f = true;
              if (!z.nextStep()) {
                this.lines.splice(c, 1);
              };
              break;
            }
          }
          if (!f) this.lines.push(ln);
          if (this.testConnections()) this.game_over = true;
        }
      }
      this.selected.selected = false;
      this.selected = null;
    }
  }

  testConnections() {
    for (const cell of this.board) {
      if (cell.guess.island) {
        for (let c = 0; c < 4; c++) {
          if (cell.guess.island.connections[c].str !== cell.puzzle.island.connections[c].str) return false;
        }
      }
    }
    return true;
  }

  setPath(i: Island, dx: number, dy: number): string {
    let x = this.selected.x, y = this.selected.y,
      str = "", s = dx === 0 ? ". v" : ". h",
      b: string, f = false;
    out:
    while (true) {
      x += dx; y += dy;
      b = this.board[x + y * this.cntX].guess.str;
      switch (b) {
        case " ":
          str = s;
          break;
        case "v":
          str = ".vV";
          f = s !== ". v";
          break;
        case "V":
          str = ".V "
          f = s !== ". v";
          break;
        case "h":
          str = ".hH";
          f = s !== ". h";
          break;
        case "H":
          str = ".H ";
          f = s !== ". h";
          break;
        case "#":
          break out;
      }
      this.board[x + y * this.cntX].guess.str = str;
      if (f) break;
    }

    if (b === "#" && this.board[x + y * this.cntX].puzzle.island === i) {
      this.board.forEach((el, idx) => { if (el.guess.str.charAt(0) === ".") this.board[idx].guess.str = this.board[idx].guess.str.charAt(2); });
      if (str === "") {
        return "+";
      }
      return str.charAt(2);
    }
    this.board.forEach((el, idx) => { if (el.guess.str.charAt(0) === ".") this.board[idx].guess.str = this.board[idx].guess.str.charAt(1); });
    return "";
  }
}

new Hashi(7, 7, 15);