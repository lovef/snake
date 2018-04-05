export class Point {
    static readonly Zero = new Point(0, 0)
    static readonly X = new Point(1, 0)
    static readonly Y = new Point(0, 1)
    static readonly Xminus = new Point(-1, 0)
    static readonly Yminus = new Point(0, -1)

    static random(limitX: number = 1, limitY: number = 1): Point {
        return new Point(Math.floor(Math.random() * limitX), Math.floor(Math.random() * limitY))
    }
    constructor(readonly x: number, readonly y: number) { }

    plus(point: Point): Point {
        return new Point(this.x + point.x, this.y + point.y)
    }

    toString() {
        return '(' + Math.round(this.x * 100) / 100 + ', ' + Math.round(this.y * 100) / 100 + ')'
    }

    equals(other: Point): boolean {
        return this.x === other.x && this.y === other.y
    }
}
