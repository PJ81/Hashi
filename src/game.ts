export default class Game {
  loop: (time?: number) => void;
  draw() {
    throw new Error("Method not implemented.");
  }
  update(arg0: number) {
    throw new Error("Method not implemented.");
  }
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  lastTime: number;
  accumulator: number;
  deltaTime: number;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = "main";
    this.canvas.width = 5;
    this.canvas.height = 5;
    this.ctx = this.canvas.getContext('2d');
    document.getElementById("board").appendChild(this.canvas);
    this.lastTime = 0;
    this.accumulator = 0;
    this.deltaTime = 1 / 60;
    this.loop = (time = 0) => {
      this.accumulator += (time - this.lastTime) / 1000;
      while (this.accumulator > this.deltaTime) {
        this.accumulator -= this.deltaTime;
        this.update(Math.min(this.deltaTime, .5));
      }
      this.lastTime = time;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.draw();
      requestAnimationFrame(this.loop);
    }
  }
}

