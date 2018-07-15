import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core'
import { Board, Drawer } from './bord'
import { Point } from './point'
import { Snake } from './snake'

@Component({
    selector: 'app-snake',
    templateUrl: './snake.component.html',
    styleUrls: ['./snake.component.css']
})
export class SnakeComponent implements OnInit, Drawer {

    @ViewChild('body') body: ElementRef
    @ViewChild('canvas') canvas: ElementRef

    ctx: CanvasRenderingContext2D

    board: Board
    snake: Snake
    pixels = 31
    size = 1
    pixelSize = 1

    started = false
    interval

    getScore(): number { return this.board.score }

    ngOnInit() {
        this.ctx = this.canvas.nativeElement.getContext('2d')
        this.board = new Board(this.pixels, this.pixels, this)
        this.snake = this.board.addSnake()

        this.onResize()
        this.fill(this.snake.nose)
    }

    @HostListener('window:resize', ['$event'])
    onResize() {
        this.size = this.ctx.canvas.offsetWidth
        this.pixelSize = this.ctx.canvas.offsetWidth / this.pixels
        this.ctx.canvas.width = this.size
        this.ctx.canvas.height = this.size

        this.ctx.fillStyle = '#AAA'
        this.board.render()
    }

    @HostListener('window:keydown', ['$event'])
    keyDown(event) {
        let velocity: Point
        switch (event.code) {
            case 'ArrowLeft': velocity = Point.Xminus; break
            case 'ArrowRight': velocity = Point.X; break
            case 'ArrowUp': velocity = Point.Yminus; break
            case 'ArrowDown': velocity = Point.Y; break
        }
        if (velocity) {
            this.snake.updateVelocity(velocity)
            this.start()
        }
    }

    onTouchstart(event: TouchEvent) {
        event.preventDefault()
        const touch = event.touches[0]
        if (!touch) {
            return
        }
        const bounds = this.ctx.canvas.getBoundingClientRect()
        const x = Math.floor((touch.pageX - bounds.left) * 3 / bounds.width) - 1
        const y = Math.floor((touch.pageY - bounds.top) * 3 / bounds.height) - 1
        this.snake.updateVelocity(new Point(x, y))
        this.start()
    }

    start() {
        if (!this.started) {
            this.started = true
            this.interval = window.setInterval(() => { this.gameLoop() }, 100)
        }
    }

    gameLoop() {
        this.board.update()
        if (this.board.gameOver) {
            window.clearInterval(this.interval)
        }
    }

    fill(p: Point, color?: string) {
        this.ctx.fillStyle = color || '#AAA'
        const x = Math.round(p.x * this.pixelSize)
        const y = Math.round(p.y * this.pixelSize)
        const x1 = Math.round((p.x + 1) * this.pixelSize)
        const y1 = Math.round((p.y + 1) * this.pixelSize)
        this.ctx.fillRect(x, y, x1 - x, y1 - y)
    }

    clear(p: Point) {
        const x = Math.round(p.x * this.pixelSize)
        const y = Math.round(p.y * this.pixelSize)
        const x1 = Math.round((p.x + 1) * this.pixelSize)
        const y1 = Math.round((p.y + 1) * this.pixelSize)
        this.ctx.clearRect(x, y, x1 - x, y1 - y)
    }
}
