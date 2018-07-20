import { Component, OnInit, ElementRef, ViewChild, HostListener } from '@angular/core'
import { Board, Drawer } from './bord'
import { Point } from './point'
import { Snake } from './snake'

@Component({
    selector: 'app-snake',
    templateUrl: './snake.component.html',
    styleUrls: ['./snake.component.scss']
})
export class SnakeComponent implements OnInit, Drawer {

    @ViewChild('canvas') canvas: ElementRef
    showMenu = true

    ctx: CanvasRenderingContext2D

    board: Board
    snake: Snake
    pixels = 31
    size = 1
    pixelSize = 1

    started = false
    interval

    constructor(readonly root: ElementRef) { }

    getScore(): number { return this.board.score }

    isGameOver(): boolean { return this.board.gameOver }

    isFullScreen(): boolean {
        return document.fullscreenElement ||
            (document as any).mozFullScreenElement ||
            document.webkitFullscreenElement ||
            (document as any).msFullscreenElement
    }

    ngOnInit() {
        this.ctx = this.canvas.nativeElement.getContext('2d')
        this.setupBoard()

        this.refresh()
        this.fill(this.snake.nose)
    }

    @HostListener('window:keydown', ['$event'])
    keyDown(event) {
        let velocity: Point
        switch (event.key) {
            case 'a':
            case 'ArrowLeft': velocity = Point.Xminus; break
            case 'd':
            case 'ArrowRight': velocity = Point.X; break
            case 'w':
            case 'ArrowUp': velocity = Point.Yminus; break
            case 's':
            case 'ArrowDown': velocity = Point.Y; break
        }
        const handled = this.updateVelocity(velocity)
        if (handled) {
            event.preventDefault()
        }
    }

    onTouchstart(event: TouchEvent) {
        const touch = event.touches[0]
        if ((event.target as any).nodeName === 'BUTTON' || !touch) {
            return
        }
        const bounds = this.ctx.canvas.getBoundingClientRect()
        const x = Math.floor((touch.pageX - bounds.left) * 3 / bounds.width) - 1
        const y = Math.floor((touch.pageY - bounds.top) * 3 / bounds.height) - 1
        this.updateVelocity(new Point(x, y))
        if (!this.isGameOver()) {
            event.preventDefault()
        }
    }

    updateVelocity(velocity: Point) {
        if (velocity && !this.board.gameOver) {
            this.snake.updateVelocity(velocity)
            this.start()
            return true
        }
        return false
    }

    newGame() {
        this.setupBoard()
        this.refresh()
        this.showMenu = false
    }

    @HostListener('window:resize', ['$event'])
    refresh() {
        this.size = this.ctx.canvas.offsetWidth
        this.pixelSize = this.ctx.canvas.offsetWidth / this.pixels
        this.ctx.canvas.width = this.size
        this.ctx.canvas.height = this.size

        this.ctx.fillStyle = '#AAA'
        this.board.render()
    }

    start() {
        if (!this.started) {
            this.started = true
            this.showMenu = false
            this.interval = window.setInterval(() => { this.gameLoop() }, 100)
        }
    }

    setupBoard() {
        this.board = new Board(this.pixels, this.pixels, this)
        this.snake = this.board.addSnake()
    }

    gameLoop() {
        this.board.update()
        if (this.board.gameOver) {
            window.clearInterval(this.interval)
            this.started = false
            this.showMenu = true
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

    toggleFullScreen() {
        const element = this.root.nativeElement
        if (!this.isFullScreen()) {
            this.requestFullScreen(element)
        } else {
            this.exitFullScreen(element)
        }
    }

    requestFullScreen(element) {
        // https://stackoverflow.com/a/7525760/1020871
        // Supports most browsers and their versions.
        const requestMethod = element.requestFullScreen ||
            element.webkitRequestFullScreen ||
            element.mozRequestFullScreen ||
            element.msRequestFullScreen

        if (requestMethod) {
            requestMethod.call(element)
        } else {
            alert('Full screen is not supported')
        }
    }

    exitFullScreen(element) {
        if (document.exitFullscreen) {
            document.exitFullscreen()
        } else if ((document as any).mozCancelFullScreen) {
            (document as any).mozCancelFullScreen()
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen()
        }
    }
}
