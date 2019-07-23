import Connection from "./connection.js";
import * as Const from "./const.js"

export default class Island {
  x: number;
  y: number;
  size: number;
  posX: number;
  posY: number;
  selected: boolean;
  connections: Connection[];
  guesses: Connection[];

  hasFreeConnection: (dir: number) => boolean;
  hasPoint: (x: number, y: number) => boolean;
  setConnection: (dir: number, i: Island) => Connection;
  setGuess: (t: any) => number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.size = Const.BOX_SIZE;
    this.selected = false;
    this.posX = this.size + this.x * this.size + this.size * this.x;
    this.posY = this.size + this.y * this.size + this.size * this.y;
    this.connections = [null, null, null, null];
    this.guesses = [null, null, null, null];

    this.hasFreeConnection = (dir: number): boolean => !this.connections[dir];
    this.setConnection = (dir: number, i: Island) => this.connections[dir] = new Connection(dir, i);
    this.hasPoint = (x: number, y: number): boolean => !(x < this.posX || x > this.posX + this.size || y < this.posY || y > this.posY + this.size);
    this.setGuess = (t) => this.guesses[t].count++;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "#eee";//rgb(255,255,255)";
    ctx.fillRect(this.posX, this.posY, this.size, this.size);
    ctx.rect(this.posX, this.posY, this.size, this.size);

    const cc = this.connections.reduce((acc, con) => acc + (con ? con.count : 0), 0),
      gc = this.guesses.reduce((acc, con) => acc + (con ? con.count : 0), 0);

    if (gc === cc) {
      ctx.fillStyle = "#0f0";//rgb(0, 255, 0)";
      ctx.fillRect(this.posX, this.posY, this.size, this.size);
      ctx.fillStyle = "#000";
    }
    if (this.selected) {
      ctx.fillStyle = "#ff0";//rgb(255, 255, 0)";
      ctx.fillRect(this.posX, this.posY, this.size, this.size);
      ctx.fillStyle = "#000";
    }

    ctx.fillStyle = "#000";
    ctx.fillText(`${cc}`, this.posX + 5, this.posY + 17);
  }
}