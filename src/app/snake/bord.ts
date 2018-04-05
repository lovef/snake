import { Point } from './point'
import { Snake } from './snake'

export interface Drawer {
    fill(point: Point, color?: string)
    clear(point: Point)
}

export class Apple {
    constructor(
        readonly position: Point,
        readonly nutrition: number) { }
}

export class Board {

    center: Point
    apple: Apple = null
    gameOver = false
    private snakes = Array<Snake>()
    private nextAppleNutrition = 1

    get score(): number { return this.snakes[0].length - 1 }

    constructor(
        readonly width: number,
        readonly height: number,
        readonly drawer: Drawer
    ) {
        this.center = new Point((width - 1) / 2, (height - 1) / 2)
    }

    addSnake(...points: Point[]): Snake {
        const snake = points.length === 0 ? new Snake(this.center) : new Snake(...points)
        this.snakes.push(snake)
        return snake
    }

    update() {
        if (this.gameOver) {
            throw new Error('Game over')
        }
        this.snakes.forEach(snake => {
            this.drawer.clear(snake.tail)
            this.updateSnake(snake)
            if (this.apple && this.apple.position.equals(snake.nose)) {
                snake.eat(this.apple)
                this.apple = null
            }
            if (snake.colidesWithItself()) {
                this.gameOver = true
                this.drawer.fill(snake.nose, '#F00')
                return
            }
            this.drawer.fill(snake.nose)
        })
        if (!this.apple) {
            this.apple = this.createApple()
        }
    }

    createApple(): Apple {
        const position = this.randomPoint()
        if (this.snakes.some(snake => snake.colides(position))) {
            return null
        }
        this.drawer.fill(position)
        return new Apple(position, this.nextAppleNutrition++)
    }

    private updateSnake(snake: Snake) {
        if (snake.velocity.equals(Point.Zero)) {
            return
        }
        let next = snake.nose.plus(snake.velocity)
        const x = next.x
        const y = next.y
        next = new Point(
            x >= this.width ? 0 : x < 0 ? this.width - 1 : x,
            y >= this.height ? 0 : y < 0 ? this.height - 1 : y)
        snake.moveTo(next)
    }

    render() {
        this.snakes.forEach(snake => {
            snake.spine.forEach(point => {
                this.drawer.fill(point)
            })
        })
        if (this.apple) {
            this.drawer.fill(this.apple.position)
        }
    }

    randomPoint(): Point {
        return Point.random(this.width, this.height)
    }
}
