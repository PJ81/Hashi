export default class Island {
  x: number;
  y: number;
  size: number;
  posX: number;
  posY: number;
  count: number;
  selected: boolean;
  connections: Island[];
  guesses: Island[];

  hasFreeConnection: (dir: number) => boolean;
  hasPoint: (x: number, y: number) => boolean;
  setConnection: (dir: number, i: Island, guess: boolean) => void;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.count = 0;
    this.size = 21;
    this.selected = false;
    this.posX = this.size + this.x * this.size + this.size * this.x;
    this.posY = this.size + this.y * this.size + this.size * this.y;
    this.connections = [null, null, null, null];
    this.guesses = [null, null, null, null];

    this.setConnection = (dir: number, i: Island, guess: boolean): void => {
      if (guess) this.guesses[dir] = i;
      else this.connections[dir] = i;
    }
    this.hasFreeConnection = (dir: number): boolean => !this.connections[dir];
    this.hasPoint = (x: number, y: number): boolean => !(x < this.posX || x > this.posX + this.size || y < this.posY || y > this.posY + this.size);
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