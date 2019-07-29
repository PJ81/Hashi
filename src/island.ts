import { Tuple } from "./tuple.js";

export default class Island {
  x: number;
  y: number;
  size: number;
  posX: number;
  posY: number;
  selected: boolean;
  connections: Tuple[];

  hasFreeConnection: (dir: number) => boolean;
  hasPoint: (x: number, y: number) => boolean;
  setConnection: (dir: number, i: Island, s: string) => void;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.size = 21;
    this.selected = false;
    this.posX = this.size + this.x * this.size + this.size * this.x;
    this.posY = this.size + this.y * this.size + this.size * this.y;
    this.connections = [new Tuple(), new Tuple(), new Tuple(), new Tuple()];

    this.setConnection = (dir: number, i: Island, s: string): void => { this.connections[dir].set(i, s); }
    this.hasFreeConnection = (dir: number): boolean => !this.connections[dir].island;
    this.hasPoint = (x: number, y: number): boolean => !(x < this.posX || x > this.posX + this.size || y < this.posY || y > this.posY + this.size);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.selected ? "#ee0" : "#eee";
    ctx.fillRect(this.posX, this.posY, this.size, this.size);
    ctx.rect(this.posX, this.posY, this.size, this.size);

    const cc = this.connections.reduce((acc, con) => acc + (con ? (con.str === "v" || con.str === "h" ? 1 : con.str === "V" || con.str === "H" ? 2 : 0) : 0), 0);
    ctx.fillStyle = "#000";
    ctx.fillText(`${cc}`, this.posX + 5, this.posY + 17);
  }
}
