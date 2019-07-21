export default class Island {
  x: number;
  y: number;
  connections: Island[];
  hasFreeConnection: (dir: number) => boolean;
  setConnection: (dir: number, i: Island) => Island;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.connections = [null, null, null, null];
    this.hasFreeConnection = (dir: number): boolean => !this.connections[dir];
    this.setConnection = (dir: number, i: Island) => this.connections[dir] = i;
  }
}