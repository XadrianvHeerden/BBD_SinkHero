import { approx_equals, clamp, lerp } from "./utils.js";

export class BoundingBox {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

export class Vector2 {
    static ZERO = new Vector2()
    static UP = new Vector2(0, -1)
    static DOWN = new Vector2(0, 1)
    static RIGHT = new Vector2(1, 0)
    static LEFT = new Vector2(-1, 0)

    constructor(x, y) {
        if (x === undefined)
            x = y = 0;

        else if (y === undefined)
            y = x;

        this.set(x, y);
    }

    set(x, y) {
        this.x = x;
        this.y = y;
    }

    add(other) {
        this.x += other.x;
        this.y += other.y;
    }

    minus(other) {
        this.x -= other.x;
        this.y -= other.y;
    }

    scale(scalar) {
        this.x *= scalar;
        this.y *= scalar;
    }

    clamp(min, max) {
        this.x = clamp(this.x, min.x, max.x);
        this.y = clamp(this.y, min.y, max.y);
    }

    move_toward(end, speed) {
        end = end.getCopy();
        end.minus(this);
        let direction = end.getDirection();
        direction.scale(speed);

        this.add(direction)
    }

    lerp(end, weight) {
        this.x = lerp(this.x, end.x, weight);
        this.y = lerp(this.y, end.y, weight);
    }
    approx_equals(other, tolerance = 0.05) {
        return approx_equals(this.x, other.x, tolerance) && approx_equals(this.y, other.y, tolerance);
    }

    getCopy() {
        return new Vector2(this.x, this.y);
    }
    getMagnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    getDirection() {
        let magnitude = this.getMagnitude();
        
        if (magnitude == 0)
            return this;

        return new Vector2(this.x / magnitude, this.y / magnitude);        
    }

    equals(other) {
        return this.x == other.x && this.y == other.y;
    }
}