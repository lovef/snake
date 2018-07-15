import { Point } from './point'
import { Apple } from './bord'

export class Snake {

    nutrition = 0
    velocity = Point.Zero
    get nose(): Point { return this.spine[this.spine.length - 1] }
    get tail(): Point { return this.spine[0] }
    spine: Point[]
    get length(): number { return this.spine.length }

    constructor(...points: Point[]) {
        this.spine = points.splice(0)
    }

    updateVelocity(velocity: Point) {
        if (velocity.x !== 0 && (this.velocity.y !== 0 || this.velocity.x === 0)) {
            this.velocity = new Point(velocity.x, 0)
        } else if (velocity.y !== 0 && (this.velocity.x !== 0 || this.velocity.y === 0)) {
            this.velocity = new Point(0, velocity.y)
        }
    }

    update() {
        if (this.velocity === Point.Zero) {
            return
        }
        const nextPosition = this.nose.plus(this.velocity)
        this.moveTo(nextPosition)
    }

    moveTo(point: Point) {
        this.spine.push(point)
        if (this.nutrition > 0) {
            this.nutrition--
        } else {
            this.spine.shift()
        }
    }

    eat(apple: Apple) {
        this.nutrition += apple.nutrition
    }

    colidesWithItself(): boolean {
        return this.spine
            .slice(0, this.spine.length - 1)
            .some(p => p.equals(this.nose))
    }

    colides(point: Point) {
        return this.spine.some(p => p.equals(point))
    }
}
