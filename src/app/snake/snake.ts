import { Point } from './point'
import { Apple } from './bord'

export class Snake {

    nutrition = 0

    velocity = Point.Zero
    private velocityIsUpdated = false
    private nextVelocity: Point = undefined

    get nose(): Point { return this.spine[this.spine.length - 1] }
    get tail(): Point { return this.spine[0] }
    spine: Point[]
    get length(): number { return this.spine.length }

    constructor(...points: Point[]) {
        this.spine = points.splice(0)
    }

    updateVelocity(velocity: Point) {
        const current = this.velocity
        const next = this.calculateNextVelocity(current, velocity)
        if (next) {
            if (!this.velocityIsUpdated) {
                this.velocity = next
                this.velocityIsUpdated = true
            } else {
                this.nextVelocity = next
            }
        }
    }

    private calculateNextVelocity(current: Point, next: Point) {
        if (next.x !== 0 && (current.y !== 0 || current.x === 0)) {
            return new Point(next.x, 0)
        } else if (next.y !== 0 && (current.x !== 0 || current.y === 0)) {
            return new Point(0, next.y)
        }
    }

    update() {
        this.velocityIsUpdated = false
        if (this.nextVelocity) {
            this.velocity = this.nextVelocity
            this.nextVelocity = null
        }
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
