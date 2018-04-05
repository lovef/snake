import { Snake } from './snake'
import { Point } from './point'
import { Apple } from './bord'

describe('Snake', () => {

    let snake: Snake

    beforeEach(() => {
        snake = new Snake(new Point(4, 4))
    })

    it('can be initialized with multiple points', () => {
        snake = new Snake(Point.X, Point.Y)
        expect(snake.tail).toBe(Point.X)
        expect(snake.nose).toBe(Point.Y)
    })

    it('velocity is default 0', () => {
        expect(snake.velocity).toBe(Point.Zero)
    })

    it('only moves once it has a velocity', () => {
        const originalPosition = snake.nose
        snake.update()
        expect(snake.nose).toEqual(originalPosition)
        snake.velocity = Point.X
        snake.update()
        expect(snake.nose).toEqual(originalPosition.plus(snake.velocity))
    })

    it('length is default 1', () => {
        expect(snake.length).toBe(1)
        expect(snake.nose).toBe(snake.tail)
    })

    it('eating apple gives the snake nutrition', () => {
        expect(snake.nutrition).toBe(0)
        snake.eat(new Apple(Point.random(), 3))
        expect(snake.nutrition).toBe(3)
    })

    it('nutrition does NOT make the snake grow as it stands still', () => {
        snake.eat(new Apple(Point.random(), 3))
        snake.update()
        expect(snake.length).toBe(1)
        expect(snake.nutrition).toBe(3)
    })

    it('consuming nutrition makes the snake grow as it moves', () => {
        const originalTailPosition = snake.tail
        snake.velocity = Point.X
        snake.eat(new Apple(Point.random(), 3))
        for (let i = 1; i <= 3; i++) {
            snake.update()
            expect(snake.length).toBe(1 + i)
            expect(snake.tail).toBe(originalTailPosition)
        }
        snake.update()
        expect(snake.length).toBe(4)
        expect(snake.tail).not.toBe(originalTailPosition)
    })

    it('head may be moved to an arbitrary posistion', () => {
        snake.eat(new Apple(Point.random(), 2))
        const a = Point.random()
        const b = Point.random()
        const c = Point.random()
        snake.moveTo(a)
        snake.moveTo(b)
        snake.moveTo(c)
        expect(snake.tail).toBe(a)
        snake.moveTo(Point.random())
        expect(snake.tail).toBe(b)
        snake.moveTo(Point.random())
        expect(snake.tail).toBe(c)
    })

    it('can detect a collision', () => {
        snake = new Snake(new Point(0, 0), new Point(1, 0), new Point(1, 1))
        expect(snake.colides(new Point(0, 0))).toBe(true)
        expect(snake.colides(new Point(1, 0))).toBe(true)
        expect(snake.colides(new Point(1, 1))).toBe(true)
        expect(snake.colides(new Point(0, 1))).toBe(false)
        expect(snake.colides(new Point(2, 1))).toBe(false)
    })

    it('can detect a collision with itself', () => {
        snake = new Snake(new Point(0, 0), new Point(1, 0), new Point(1, 1))
        expect(snake.colidesWithItself()).toBe(false)

        snake = new Snake(new Point(0, 0), new Point(1, 0), new Point(1, 0))
        expect(snake.colidesWithItself()).toBe(true)

        snake = new Snake(new Point(0, 0), new Point(1, 0), new Point(0, 0))
        expect(snake.colidesWithItself()).toBe(true)

        snake = new Snake(new Point(0, 0), new Point(1, 0), new Point(-1, 0))
        expect(snake.colidesWithItself()).toBe(false)
    })
})
