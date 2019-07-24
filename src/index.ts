import Game from "./game.js";
import Island from "./island.js";
import Puzzle from "./puzzle.js";

class Hashi extends Game {
  countX: number;
  countY: number;
  puzzle: Puzzle;
  selected: Island;

  constructor(cx = 10, cy = 10, den = 25) {
    super();
    this.countX = cx;
    this.countY = cy;
    this.selected = null;
    this.puzzle = new Puzzle(cx, cy, den);

    const BOX_SIZE = 21;

    this.canvas.width = cx * BOX_SIZE + cx * BOX_SIZE + BOX_SIZE;
    this.canvas.height = cy * BOX_SIZE + cy * BOX_SIZE + BOX_SIZE;
    this.ctx.font = "20px Consolas";
    this.canvas.addEventListener("click", (me) => this.click(me, null));
    this.canvas.addEventListener("touchstart", (te) => this.click(null, te));

    this.update = (dt) => { };
    this.draw = () => this.puzzle.draw(this.ctx);

    this.puzzle.create();
    this.loop();
  }

  click(me: MouseEvent, te: TouchEvent) {
    let x: number, y: number;
    if (me) {
      x = me.clientX - (me.srcElement as HTMLCanvasElement).offsetLeft;
      y = me.clientY - (me.srcElement as HTMLCanvasElement).offsetTop;
    } else {
      x = te.touches[0].clientX - (te.srcElement as HTMLCanvasElement).offsetLeft;
      y = te.touches[0].clientY - (te.srcElement as HTMLCanvasElement).offsetTop;
    }

    this.selectIsland(this.puzzle.getIsland(x, y));
  }

  selectIsland(i: Island) {
    if (!this.selected) {
      this.selected = i;
      i.selected = true;
    } else {
      if (i !== this.selected && (i.x === this.selected.x || i.y === this.selected.y)) {
        // ------------- TO DO -------------
        // test if the path between the both islands is clean
      }
      this.selected.selected = false;
      this.selected = null;
    }
  }
}

new Hashi(11, 11, 35);