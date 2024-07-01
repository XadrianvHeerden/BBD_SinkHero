import { clamp } from "./utils.js";

export class BoundingBox {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

export class Vector2 {
    static UP = new Vector2(0, -1)
    static DOWN = new Vector2(0, 1)
    static RIGHT = new Vector2(1, 0)
    static LEFT = new Vector2(-1, 0)

    constructor(x, y) {
        if (x === undefined)
            x = y = 0;

        else if (y === undefined)
            y = x;

        this.x = x;
        this.y = y;
    }

    scale(scalar) {
        this.x *= scalar;
        this.y *= scalar;
    }

    clamp(min, max) {
        this.x = clamp(this.x, min.x, max.x);
        this.y = clamp(this.y, min.y, max.y);
    }

    getMagnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    getDirection() {
        let magnitude = this.getMagnitude();
        
        if (!magnitude)
            return this;

        return new Vector2(this.x / magnitude, this.y / magnitude);        
    }

    equals(other) {
        return this.x == other.x && this.y == other.y;
    }
}