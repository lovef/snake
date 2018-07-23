import { Board, Apple, Drawer } from './bord'
import { Point } from './point'
import { Snake } from './snake'

class BoardTester {
    constructor(readonly board: Board, readonly snake: Snake) {
        board.apple = new Apple(Point.Xminus, 0) // Ensure apple is not eaten
    }

    updateVelocity(velocity: Point): BoardTester {
        this.snake.updateVelocity(velocity)
        return this
    }

    xShouldBe(...expectedXCoordinates: number[]): BoardTester {
        const actualCoordinates = []
        expectedXCoordinates.forEach((x) => {
            this.board.update()
            actualCoordinates.push(this.snake.nose.x)
        })
        expect(actualCoordinates).toEqual(expectedXCoordinates)
        return this
    }

    yShouldBe(...expectedXCoordinates: number[]): BoardTester {
        const actualCoordinates = []
        expectedXCoordinates.forEach((x) => {
            this.board.update()
            actualCoordinates.push(this.snake.nose.y)
        })
        expect(actualCoordinates).toEqual(expectedXCoordinates)
        return this
    }

    velocityShouldBe(...expectedVelocities: Point[]) {
        const actualVelocities = []
        expectedVelocities.forEach((x) => {
            actualVelocities.push(this.snake.velocity)
            this.board.update()
        })
        this.shouldEqual(actualVelocities, expectedVelocities)
        return this
    }

    shouldEqual(actual: Point[], expected: Point[]) {
        let failed = ''
        if (actual.length !== expected.length) {
            failed += '\nlengths differ: ' + actual.length + ' != ' + expected.length
        }
        for (let i = 0; i < Math.max(actual.length, expected.length); i++) {
            const a = expected[i]
            const b = actual[i]
            if (a && !b || !a && b || a && !a.equals(b)) {
                failed += '\n' + i + ': ' + b + ' != ' + a
            }
        }
        if (failed) {
            fail('Arrays differ\n' +
                'Expected: ' + expected + '\n' +
                'Actual:   ' + actual +
                failed)
        }
    }
}

describe('Board', () => {

    let filled: Point[]
    let filledCollor: string[]
    let cleared: Point[]
    const mockDrawer: Drawer = {
        fill(point, color) { filled.push(point); filledCollor.push(color) },
        clear(point) { cleared.push(point) }
    }
    let board: Board

    beforeEach(() => {
        board = new Board(5, 5, mockDrawer)
        filled = []
        filledCollor = []
        cleared = []
    })

    it('center is correct', () => {
        expect(board.center).toEqual(new Point(2, 2))
    })

    it('snake is default placed in the center', () => {
        const snake = board.addSnake()
        expect(snake.nose).toBe(board.center)
        expect(snake.tail).toBe(board.center)
    })

    it('snake is initialized in the center of the board', () => {
        const snake = board.addSnake()
        expect(snake.nose).toBe(board.center)
    })

    it('snake may be initialized on a specific set of points', () => {
        const points = [Point.random(), Point.random(), Point.random()]
        const snake = board.addSnake(...points)
        expect(snake.tail).toBe(points[0])
        expect(snake.nose).toBe(points[2])
    })

    it('will move snake from one edge to the other', () => {
        const snake = board.addSnake()
        new BoardTester(board, snake)
            .updateVelocity(Point.X)
            .xShouldBe(3, 4, 0, 1)
            .updateVelocity(Point.Y)
            .yShouldBe(3, 4, 0, 1)
            .updateVelocity(Point.Xminus)
            .xShouldBe(0, 4)
            .updateVelocity(Point.Yminus)
            .yShouldBe(0, 4)
    })

    it('velocity only changes perpendicular to current velocity', () => {
        const snake = board.addSnake()
        new BoardTester(board, snake)
            .updateVelocity(Point.X)
            .velocityShouldBe(Point.X, Point.X)
            .updateVelocity(Point.X)
            .velocityShouldBe(Point.X, Point.X)
            .updateVelocity(Point.Xminus)
            .velocityShouldBe(Point.X, Point.X)
            .updateVelocity(Point.Y)
            .velocityShouldBe(Point.Y, Point.Y)
            .updateVelocity(Point.Yminus)
            .velocityShouldBe(Point.Y, Point.Y)
    })

    it('can handle multiple velocity updates per iteration', () => {
        const snake = board.addSnake()
        new BoardTester(board, snake)
        .updateVelocity(Point.X)
        .updateVelocity(Point.Xminus)
        .velocityShouldBe(Point.X, Point.X)
        .updateVelocity(Point.Y)
        .updateVelocity(Point.Yminus)
        .velocityShouldBe(Point.Y, Point.Y)
        .updateVelocity(Point.X)
        .updateVelocity(Point.Yminus)
        .velocityShouldBe(Point.X, Point.Yminus, Point.Yminus)
        .updateVelocity(Point.Xminus)
        .updateVelocity(Point.Y)
        .velocityShouldBe(Point.Xminus, Point.Y, Point.Y)
    })

    it('can update velocity with a diagonal vector', () => {
        const snake = board.addSnake()
        new BoardTester(board, snake)
            .updateVelocity(Point.X)
            .velocityShouldBe(Point.X)
            .updateVelocity(new Point(1, 1))
            .velocityShouldBe(Point.Y)
            .updateVelocity(new Point(1, 1))
            .velocityShouldBe(Point.X)
    })

    it('can update velocity with a diagonal vector multiple times', () => {
        const snake = board.addSnake()
        new BoardTester(board, snake)
            .updateVelocity(Point.X)
            .velocityShouldBe(Point.X)
            .updateVelocity(new Point(1, 1))
            .updateVelocity(new Point(1, 1))
            .velocityShouldBe(Point.Y, Point.X, Point.X)
            .updateVelocity(new Point(-1, -1))
            .updateVelocity(new Point(-1, -1))
            .velocityShouldBe(Point.Yminus, Point.Xminus, Point.Xminus)
    })

    it('can render the entire frame', () => {
        const spine = [board.randomPoint(), board.randomPoint()]
        board.addSnake(...spine)
        expect(filled).toEqual([])
        board.render()
        expect(filled).toEqual(spine)
        board.apple = new Apple(board.randomPoint(), 0)
        filled = []
        board.render()
        expect(filled).toEqual([...spine, board.apple.position])
    })

    it('renders snake as it moves', () => {
        board.apple = new Apple(Point.Zero, 0)
        const snake = board.addSnake()
        snake.updateVelocity(Point.X)
        expect(filled).toEqual([])
        expect(filledCollor).toEqual([])
        board.update()
        expect(filled).toEqual([snake.nose])
        expect(filledCollor).toEqual([undefined])
    })

    it('erases snake tail as it moves', () => {
        board.apple = new Apple(Point.Zero, 0)
        const snake = board.addSnake()
        snake.updateVelocity(Point.X)
        expect(cleared).toEqual([])
        const oldTailPosition = snake.tail
        board.update()
        expect(cleared).toEqual([oldTailPosition])
    })

    it('renders apple that is added', () => {
        const snake = board.addSnake()
        do {
            board.update()
        } while (!board.apple)
        board.update()
        expect(filled).toContain(board.apple.position)
    })

    it('snake do not move without velocity', () => {
        const spine = [new Point(0, 0), new Point(0, 1)]
        const snake = board.addSnake(...spine)
        expect(snake.tail).toBe(spine[0])
        expect(snake.nose).toBe(spine[1])
        board.update()
        expect(snake.tail).toBe(spine[0])
        expect(snake.nose).toBe(spine[1])
    })

    it('apples are generated in free spots on the board', () => {
        const spine = [
            new Point(0, 0),
            new Point(0, 1)
        ]
        const apples: Apple[] = []
        for (let i = 0; i < 100; i++) {
            board = new Board(2, 2, mockDrawer)
            const snake = board.addSnake(...spine)
            expect(board.apple).toBeNull()
            board.update()
            if (board.apple) {
                expect(spine).not.toContain(board.apple.position)
                expect(board.apple.position.x).toEqual(Math.round(board.apple.position.x))
                expect(board.apple.position.y).toEqual(Math.round(board.apple.position.y))
                apples.push(board.apple)
            }
        }
        expect(apples.length).toBeGreaterThanOrEqual(20)
        expect(apples.length).toBeLessThanOrEqual(80)
    })

    it('consumes apples as the snake move over it', () => {
        const snake = board.addSnake()
        snake.updateVelocity(Point.X)
        const apple = new Apple(snake.nose.plus(snake.velocity), Math.ceil(Math.random() * 10))
        board.apple = apple
        board.update()
        expect(snake.nutrition).toEqual(apple.nutrition)
        expect(board.apple).not.toBe(apple)
    })

    it('apple nutrition increases for each new apple', () => {
        for (let i = 1; i < 100; i++) {
            board.apple = null
            board.update()
            expect(board.apple.nutrition).toEqual(i)
        }
    })

    it('exposes the score that starts with 0 and increases with the snake length', () => {
        const snake = board.addSnake()
        snake.updateVelocity(Point.X)
        snake.eat(new Apple(Point.random(), 5))
        for (let i = 0; i < 5; i++) {
            expect(board.score).toEqual(i)
            board.update()
        }
    })

    it('stops game when snake collides with itself', () => {
        board.apple = new Apple(new Point(3, 3), 0)
        const snake = board.addSnake(
            new Point(-1, 0),
            new Point(0, 0),
            new Point(1, 0),
            new Point(1, 1),
            new Point(0, 1)
        )
        snake.updateVelocity(new Point(0, -1))
        expect(filled).toEqual([])
        board.update()
        expect(filled).toEqual([new Point(0, 0)])
        expect(filledCollor).toEqual(['#F00'])
        expect(board.gameOver).toBe(true)
        expect(() => { board.update() }).toThrow(new Error('Game over'))
    })
})
