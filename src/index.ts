import Game from "./game.js";

class Hashi extends Game {
    countX: number;
    countY: number;
    maxIslands: number;
    board: string[];

    constructor(cx = 10, cy = 10, den = 60) {
        super();

        this.countX = cx;
        this.countY = cy;
        this.maxIslands = (cx * cy * den) / 100;
        this.board = new Array(cx * cy);

        this.createIslands();

        this.draw = () => { };
        this.update = (dt) => { };

        this.loop();
    }

    createIslands() {
        //
    }
}

new Hashi();