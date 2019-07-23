import * as Const from "./const.js";

export default class Line {
  horizontal: boolean;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  step: number;
  bxs: number;
  bys: number;
  bxe: number;
  bye: number;

  constructor(x1: number, y1: number, x2: number, y2: number) {
    this.bxs = x1;
    this.bys = y1;
    this.bxe = x2;
    this.bye = y2;
    this.step = 1;
    this.horizontal = y1 === y2;

    this.startX = Const.BOX_SIZE + x1 * Const.BOX_SIZE + Const.BOX_SIZE * x1;
    this.startY = Const.BOX_SIZE + y1 * Const.BOX_SIZE + Const.BOX_SIZE * y1;
    this.endX = Const.BOX_SIZE + x2 * Const.BOX_SIZE + Const.BOX_SIZE * x2;
    this.endY = Const.BOX_SIZE + y2 * Const.BOX_SIZE + Const.BOX_SIZE * y2;

    if (this.horizontal) {
      this.startY += Const.BOX_SIZE / 2;
      this.endY += Const.BOX_SIZE / 2;
    } else {
      this.startX += Const.BOX_SIZE / 2;
      this.endX += Const.BOX_SIZE / 2;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    let x = this.startX, y = this.startY, xx = this.endX, yy = this.endY;
    if (this.step === 2) {
      if (this.horizontal) {
        y -= 3; yy = y;
      } else {
        x -= 3; xx = x;
      }
      ctx.moveTo(x, y);
      ctx.lineTo(xx, yy);

      if (this.horizontal) {
        y += 6; yy = y;
      } else {
        x += 6; xx = x;
      }
    }
    ctx.moveTo(x, y);
    ctx.lineTo(xx, yy);
  }

  equals(l: Line): boolean {
    return ((l.bxs === this.bxs && l.bys === this.bys && l.bxe === this.bxe && l.bye === this.bye) ||
      (l.bxe === this.bxs && l.bye === this.bys && l.bxs === this.bxe && l.bys === this.bye));
  }

  nextStep(): boolean {
    this.step = (this.step + 1) % 3;
    return this.step > 0;
  }
}