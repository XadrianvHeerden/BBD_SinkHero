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

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    equals(other) {
        return this.x == other.x && this.y == other.y;
    }
}