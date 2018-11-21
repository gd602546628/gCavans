/**
 * Created by gd on 2017/11/14/014.
 *
 */
let _default = {
    speed: [-1, 1], // 速度范围
    ball_count: 30,// 球总个数
    r_range: [10, 20], // 小球半径范围
    line_range: 200, // 连线范围
    ballColor: [240, 91, 114]
}
class Canvas {
    constructor(id, option) {
        this.balls = [] // 添加的小球池
        this.rendedBalls = [] // 已近渲染的小球池
        this.canvas = document.getElementById(id)
        this.ctx = this.canvas.getContext('2d')
        this.options = Object.assign(_default, option)
        this.width = this.canvas.width = this.canvas.offsetWidth
        this.height = this.canvas.height = this.canvas.offsetHeight
        console.log(this.width)
        console.log(this.height)
        this.init()
    }

    init() {
        this.mouse = {
            x: 0,
            y: 0,
            isMouse: true
        }
        this.balls.push(this.mouse)
        for (let i = 0; i <= this.options.ball_count; i++) {
            this.addBall()
        }
        this.start()
        this.canvas.addEventListener('mousemove', (e) => {
            this.mouse.x = e.pageX
            this.mouse.y = e.pageY
        })
    }

    start() {
        let step = () => {
            this.ctx.clearRect(0, 0, this.width, this.height)
            this.render()
            this.updata()
            requestAnimationFrame(step)
        }
        // step()
        requestAnimationFrame(step)
    }

    render() {
        this.renderBall()
    }

    // 跟新下一帧的小球状态
    updata() {
        this.balls.forEach((ball, index) => {
            if (ball.isMouse) return
            ball.x += ball.vx
            ball.y += ball.vy

            if (ball.x <= 0 || ball.x >= this.width) { // x轴边缘碰撞
                ball.vx = -ball.vx
            }
            if (ball.y <= 0 || ball.y >= this.height) { // y轴边缘碰撞
                ball.vy = -ball.vy
            }

            // 两球碰撞
            this.crashHandle(ball)
        })
    }


    renderBall() { // 小球渲染
        this.rendedBalls = []
        this.balls.forEach((ball, index) => {

            if (!ball.isMouse) {
                this.ctx.beginPath()
                this.ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2, true)
                this.ctx.fillStyle = this.getRGBA(ball)
                this.ctx.fill()
                // this.ctx.stroke()
            }
            this.rendedBalls.push(ball)

            // 连线
            this.rendedBalls.forEach(rendedBall => {
                let d = this.getTwoBallDis(ball, rendedBall)
                if (d <= this.options.line_range) {
                    this.renderLine(ball, rendedBall)
                }
            })
        })
    }

    // 碰撞检测
    crashHandle(ball) {
        ball.creashing = true
        this.balls.forEach((b, index) => {
            let d = this.getTwoBallDis(ball, b)
            if (d <= (ball.r + b.r)) {
                if (ball.x == b.x && ball.y == b.y) {
                } else {
                    b.vx = -b.vx
                    b.vy = -b.vy
                    ball.vx = -ball.vx
                    ball.vy = -ball.vy
                }
            }
        })
    }

    getTwoBallDis(ball1, ball2) {
        let d = Math.sqrt(Math.pow(ball1.x - ball2.x, 2) + Math.pow(ball1.y - ball2.y, 2))
        return d
    }

    // 画线
    renderLine(b1, b2) {
        let d = this.getTwoBallDis(b1, b2)
        let r = this.options.ballColor[0]
        let g = this.options.ballColor[1]
        let b = this.options.ballColor[2]
        let opacity = 1 - (Math.abs(d) / this.options.line_range)
        this.ctx.beginPath()
        this.ctx.moveTo(b1.x, b1.y)
        this.ctx.lineTo(b2.x, b2.y)
        this.ctx.strokeStyle = `rgba(${r},${g},${b},${opacity})`
        this.ctx.stroke()
    }

    addBall() { // 添加小球
        let ball = {
            vx: this.getRandomNumber(this.options.speed),
            vy: this.getRandomNumber(this.options.speed),
            r: this.getRandomNumber(this.options.r_range),
        }
        ball.x = this.getRandomNumber([ball.r, this.width - ball.r])
        ball.y = this.getRandomNumber([ball.r, this.height - ball.r])
        if (this.isOverlap(ball)) { // 如果重叠，就重新添加一个球
            return this.addBall()
        }
        this.balls.push(ball)
    }

    // 判断该位置是否与其他小球重叠
    isOverlap(ball) {
        let result = this.balls.every((b) => {
            let d = this.getTwoBallDis(ball, b)
            if (d <= (ball.r + b.r)) {
                return false
            }
            return true
        })
        return !result
    }

    // 获取范围内随机数
    getRandomNumber([min, max]) {
        return (Math.random() * (max - min)) + min
    }

    getRGBA(ball) {
        let opacity = ball.r / this.options.r_range[1]
        let r = this.options.ballColor[0]
        let g = this.options.ballColor[1]
        let b = this.options.ballColor[2]
        return `rgba(${r},${g},${b},${opacity})`
    }
}

new Canvas('canvas')