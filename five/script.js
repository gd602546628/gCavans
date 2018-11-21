/**
 * Created by gd on 2017/11/15/015.
 *
 * 五子棋
 */

let _default = {
    size: 50
}

const WIN5 = 0 // 5连
const ALIVE4 = 1 // 活四
const DIE4 = 2 // 死四
const ALIVE3 = 3 // 活3
const DIE3 = 4 // 死3
const LOWDIE4 = 5 // 低级死4
const ALIVE2 = 6 // 活2
const TIAO3 = 7 // 跳活3
const DIE2 = 8 // 死2
const LOWALIVE2 = 9 // 低级活2
const NOTHREAT = 10 // 无威胁
const LevelOne = 1
const Leveltwo = 2
const Levelthree = 3
const Levelfour = 4
const Levelfive = 5
const Levelsix = 6
const Levelseven = 7
const LevelEight = 8
const LevelNight = 9
const LevelTen = 10
const LevelEleven = 11
const LevelTwelve = 12
const LevelThirteen = 13
const LevelFourteen = 14
const NOTHINGFLAG = 'empty'
class Piece {
    constructor(x, y, color) {
        this.x = x
        this.y = y
        this.color = color
    }
}
class Five {
    constructor(id, options) {
        this.colorFlag = true // 起始为白子
        this.checkerboard = [] // 棋盘
        this.positionMap = [] // 棋盘坐标地图
        this.canvas = document.getElementById(id)
        this.ctx = this.canvas.getContext('2d')
        this.options = Object.assign(_default, options)
        this.init()
    }

    // 初始化
    init() {
        this.width = this.height = this.canvas.height = this.canvas.width = this.options.size * 15
        this.drawRect()
        this.initCheckerboard()
        this.bindClick()
    }

    drawRect() {
        this.ctx.strokeRect(0, 0, this.width, this.height)
        for (let i = 1; i < 15; i++) {
            this.ctx.beginPath()
            this.ctx.moveTo(i * this.options.size, 0)
            this.ctx.lineTo(i * this.options.size, this.height)
            this.ctx.stroke()
            this.ctx.beginPath()
            this.ctx.moveTo(0, i * this.options.size)
            this.ctx.lineTo(this.width, i * this.options.size)
            this.ctx.stroke()
        }
    }

    initCheckerboard() { // 初始棋盘数组
        for (let i = 0; i < 15; i++) {
            let result = []
            let mapResult = []
            for (let j = 0; j < 15; j++) {
                result.push(null)
                mapResult.push({
                    x: i * this.options.size,
                    y: j * this.options.size
                })
            }
            this.checkerboard.push(result)
            this.positionMap.push(mapResult)
        }
    }

    bindClick() {
        this.canvas.addEventListener('click', (e) => {
            if (!this.colorFlag) return
            let clickPosition = this.findClickPosition(e.layerX, e.layerY)
            let checkerPoint = clickPosition && this.checkerboard[clickPosition.x][clickPosition.y]
            if (clickPosition && !checkerPoint) { // 落子点有效并且棋盘位置为空
                let piece = this.renderPiece(clickPosition)
                if (this.winCheck(clickPosition, piece)) {
                    setTimeout(() => {
                        alert('白棋胜')
                        window.location.reload()
                    }, 0)
                }
                this.colorFlag = false
                piece = this.AIPlay()
                if (this.winCheck(piece, piece)) {
                    setTimeout(() => {
                        alert('黑棋胜')
                        window.location.reload()
                    }, 0)
                }
                this.colorFlag = true
            }
        })
    }

    renderPiece(position) {
        let color = this.colorFlag ? '#ffffff' : '#000000'
        let point = this.positionMap[position.x][position.y]
        this.ctx.beginPath()
        this.ctx.arc(point.x, point.y, 18, 0, Math.PI * 2, true)
        this.ctx.fillStyle = color
        this.ctx.fill()
        let piece = new Piece(position.x, position.y, color)
        this.checkerboard[position.x][position.y] = piece
        return piece
    }

    findClickPosition(x, y) { // 找到点击的坐标
        let result = null
        this.positionMap.forEach((line, xIndex) => {
            line.forEach((point, yIndex) => {
                let pointX1 = point.x + 10
                let pointX2 = point.x - 10
                let pointY1 = point.y + 10
                let pointY2 = point.y - 10
                if ((x <= pointX1 && x >= pointX2) && (y <= pointY1 && y >= pointY2)) {
                    result = {x: xIndex, y: yIndex}
                }
            })
        })
        return result
    }

    winCheck(position, piece) { // 获胜判断
        let count = 0
        // 左边判断
        for (let i = position.x; i >= 0; i--) {
            let boardPiece = this.checkerboard[i][position.y]
            if (boardPiece && boardPiece.color === piece.color) {
                count++
            } else {
                break
            }
        }
        // 右边判断
        for (let i = position.x; i <= 14; i++) {
            let boardPiece = this.checkerboard[i][position.y]
            if (boardPiece && boardPiece.color === piece.color) {
                count++
            } else {
                break
            }
        }
        if (count >= 6) return true
        count = 0


        // 上边判断
        for (let i = position.y; i >= 0; i--) {
            let boardPiece = this.checkerboard[position.x][i]
            if (boardPiece && boardPiece.color === piece.color) {
                count++
            } else {
                break
            }
        }
        // 下边判断
        for (let i = position.y; i <= 14; i++) {
            let boardPiece = this.checkerboard[position.x][i]
            if (boardPiece && boardPiece.color === piece.color) {
                count++
            } else {
                break
            }
        }
        if (count >= 6) return true
        count = 0

        // 左上判断
        let i = position.x
        let j = position.y
        while (i >= 0 && j >= 0) {
            let boardPiece = this.checkerboard[i][j]
            if (boardPiece && boardPiece.color === piece.color) {
                i--
                j--
                count++
            } else {
                break
            }
        }
        // 右下判断
        i = position.x
        j = position.y
        while (i <= 14 && j <= 14) {
            let boardPiece = this.checkerboard[i][j]
            if (boardPiece && boardPiece.color === piece.color) {
                i++
                j++
                count++
            } else {
                break
            }
        }
        if (count >= 6) return true
        count = 0


        // 左下判断
        i = position.x
        j = position.y
        while (i >= 0 && j <= 14) {
            let boardPiece = this.checkerboard[i][j]
            if (boardPiece && boardPiece.color === piece.color) {
                i--
                j++
                count++
            } else {
                break
            }
        }
        // 右上判断

        i = position.x
        j = position.y
        while (i <= 14 && j >= 0) {
            let boardPiece = this.checkerboard[i][j]
            if (boardPiece && boardPiece.color === piece.color) {
                i++
                j--
                count++
            } else {
                break
                // i = -1
            }
        }
        if (count >= 6) return true
        return false
    }

    AIPlay() {
        let position = this.findAiPosition()
        return this.renderPiece(position)
    }

    getScoreArr(color) { // 玩家各空位评分
        let scoreArr = []
        let scoreObj = {
            [LevelOne]: [],
            [Leveltwo]: [],
            [Levelthree]: [],
            [Levelfour]: [],
            [Levelfive]: [],
            [Levelsix]: [],
            [Levelseven]: [],
            [LevelEight]: [],
            [LevelNight]: [],
            [LevelTen]: [],
            [LevelEleven]: [],
            [LevelTwelve]: [],
            [LevelThirteen]: [],
            [LevelFourteen]: []
        }
        this.checkerboard.forEach((out, xIndex) => {
            out.forEach((item, yIndex) => {
                if (!item) {
                    let score = this.score({x: xIndex, y: yIndex}, color)
                    let result = {
                        x: xIndex,
                        y: yIndex,
                        score: score
                    }
                    scoreObj[score].push(result)
                    scoreArr.push(result)
                }
            })
        })
        return scoreObj
    }

    findAiPosition() { // 找到ai应该落子的位置
        let manScore = {}
        let AIScore = {}
        manScore = this.getScoreArr('#ffffff')
        AIScore = this.getScoreArr('#000000')
        let manMaxArr = []
        let AIMaxArr = []
        for (let i = 1; i <= 14; i++) {
            if (manScore[i].length >= 1) {
                manMaxArr = manScore[i]
                break
            }
        }
        for (let i = 1; i <= 14; i++) {
            if (AIScore[i].length >= 1) {
                AIMaxArr = AIScore[i]
                break
            }
        }
        // console.log(manScore)
        //  console.log(AIScore)
        console.log('man', manMaxArr)
        console.log('ai', AIMaxArr)
        let position = null
        if (AIMaxArr[0].score <= manMaxArr[0].score) { // ai进攻
            if (AIMaxArr.length > 1) { // 有多个高分点
                position = this.findIntersection(AIMaxArr, manMaxArr)
                if (position) {
                    return position
                } else {
                    return AIMaxArr[this.getRandomNumber([0, AIMaxArr.length - 1])]
                }
            } else {
                return AIMaxArr[this.getRandomNumber([0, AIMaxArr.length - 1])]
            }
        } else { // ai防守
            if (manMaxArr.length > 1) { // 敌方有多个高分点
                position = this.findIntersection(AIMaxArr, manMaxArr)
                if (position) {
                    return position
                } else {
                    return manMaxArr[this.getRandomNumber([0, manMaxArr.length - 1])]
                }
            } else {
                return manMaxArr[this.getRandomNumber([0, manMaxArr.length - 1])]
            }
        }
    }

    findIntersection(arr1, arr2) { // 寻找交点
        let position = null
        for (let i = 0; i < arr1.length; i++) {
            for (let j = 0; j < arr2.length; j++) {
                if (arr1[i].x === arr2[j].x && arr1[i].y === arr2[j].y) {
                    position = {
                        x: arr1[i].x,
                        y: arr1[i].y
                    }
                    return position
                }
            }
        }
        return position
    }

    score(position, color) { // 评分
        let leftRight = this.leftRight(position, color)
        let topBottom = this.topBottom(position, color)
        let slash = this.slash(position, color)
        let backslash = this.backslash(position, color)
        let arr = [leftRight, topBottom, slash, backslash]
        let situation = {
            win5: 0,
            alive4: 0,
            die4: 0,
            alive3: 0,
            die3: 0,
            lowdie4: 0,
            alive2: 0,
            tiao3: 0,
            die2: 0,
            lowalive2: 0,
            nothreat: 0
        }
        arr.forEach(item => {
            switch (item) {
                case WIN5:
                    situation.win5 += 1
                    break
                case ALIVE4:
                    situation.alive4 += 1
                    break
                case DIE4:
                    situation.die4 += 1
                    break
                case ALIVE3:
                    situation.alive3 += 1
                    break
                case DIE3:
                    situation.die3 += 1
                    break
                case LOWDIE4:
                    situation.lowdie4 += 1
                    break
                case ALIVE2:
                    situation.alive2 += 1
                    break
                case TIAO3:
                    situation.tiao3 += 1
                    break
                case DIE2:
                    situation.die2 += 1
                    break
                case LOWALIVE2:
                    situation.lowalive2 += 1
                    break
                case NOTHREAT:
                    situation.nothreat += 1
                    break
            }
        })
        return this.mergeScore(situation)
    }

    leftRight(position, color) { // 位置在横线上的评分
        let result = {
            x: position.x,
            y: position.y,
            count: 0,
            limitOne: 0,
            limitTwo: 0,
            color: color
        }
        for (let i = position.x - 1; i >= 0; i--) {
            let piece = this.checkerboard[i][position.y]
            if (piece && piece.color === color) { // 有相连子
                result.count++
            } else {
                result.limitOne = i
                break
            }
        }

        for (let i = position.x + 1; i <= 14; i++) {
            let piece = this.checkerboard[i][position.y]
            if (piece && piece.color === color) { // 有相连子
                result.count++
            } else {
                result.limitTwo = i
                break
            }
        }
        let limitOneVector = [] // 边界1方向向量
        let limitTwoVector = [] // 边界2方向向量
        for (let i = result.limitOne; i >= 0; i--) {
            limitOneVector.push({
                x: i,
                y: position.y
            })
        }
        for (let i = result.limitTwo; i <= 14; i++) {
            limitTwoVector.push({
                x: i,
                y: position.y
            })
        }
        return this.model(result, limitOneVector, limitTwoVector)
    }

    topBottom(position, color) { // 位置在垂直方向上的评分
        let result = {
            x: position.x,
            y: position.y,
            count: 0,
            limitOne: 0,
            limitTwo: 0,
            color: color
        }

        for (let i = position.y-1; i >= 0; i--) {
            let piece = this.checkerboard[position.x][i]
            if (piece && piece.color === color) {
                result.count++
            } else {
                result.limitOne = i
                break
            }
        }

        for (let i = position.y+1; i <= 14; i++) {
            let piece = this.checkerboard[position.x][i]
            if (piece && piece.color === color) {
                result.count++
            } else {
                result.limitTwo = i
                break
            }
        }

        let limitOneVector = []
        let limitTwoVector = []
        for (let i = result.limitOne; i >= 0; i--) {
            limitOneVector.push({
                x: position.x,
                y: i
            })
        }
        for (let i = result.limitOne; i <= 14; i++) {
            limitTwoVector.push({
                x: position.x,
                y: i
            })
        }

        return this.model(result, limitOneVector, limitTwoVector)
    }

    slash(position, color) { // 斜线上评分
        let result = {
            x: position.x,
            y: position.y,
            count: 0,
            limitOne: {},
            limitTwo: {},
            color: color
        }
        let i = position.x + 1
        let j = position.y - 1
        while (i <= 14 && j >= 0) { // 右上
            let piece = this.checkerboard[i][j]
            if (piece && piece.color === color) {
                result.count++
            } else {
                result.limitOne = {x: i, y: j}
                break
            }
            i++
            j--
        }

        i = position.x - 1
        j = position.y + 1
        while (i >= 0 && j <= 14) { // 左下
            let piece = this.checkerboard[i][j]
            if (piece && piece.color === color) {
                result.count++
            } else {
                result.limitTwo = {x: i, y: j}
                break
            }
            i--
            j++
        }
        let limitOneVector = []
        let limitTwoVector = []
        i = result.limitOne.x
        j = result.limitOne.y
        while (i <= 14 && j >= 0) {
            limitOneVector.push({
                x: i,
                y: j
            })
            i++
            j--
        }

        i = result.limitTwo.x
        j = result.limitTwo.y
        while (i >= 0 && j <= 14) {
            limitTwoVector.push({
                x: i,
                y: j
            })
            i--
            j++
        }
        return this.model(result, limitOneVector, limitTwoVector)
    }

    backslash(position, color) {
        let result = {
            x: position.x,
            y: position.y,
            count: 0,
            limitOne: {},
            limitTwo: {},
            color: color
        }
        let i = position.x - 1
        let j = position.y - 1
        while (i >= 0 && j >= 0) { // 左上
            let piece = this.checkerboard[i][j]
            if (piece && piece.color === color) {
                result.count++
            } else {
                result.limitOne.x = i
                result.limitOne.y = i
                break
            }
            i--
            j--
        }
        i = position.x + 1
        j = position.y + 1
        while (i <= 14 && j <= 14) {
            let piece = this.checkerboard[i][j]
            if (piece && piece.color === color) {
                result.count++
            } else {
                result.limitTwo.x = i
                result.limitTwo.y = j
                break
            }
            i++
            j++
        }

        let limitOneVector = []
        let limitTwoVector = []
        i = result.limitOne.x
        j = result.limitOne.y
        while (i >= 0 && j >= 0) {
            limitOneVector.push({
                x: i,
                y: j
            })
            i--
            j--
        }
        i = result.limitTwo.x
        j = result.limitTwo.y
        while (i <= 14 && j <= 14) {
            limitTwoVector.push({
                x: i,
                y: j
            })
            i++
            j++
        }
        return this.model(result, limitOneVector, limitOneVector)
    }

    model(result, limitOneVector, limitTwoVector) { // 估分数据
        let limit = {}
        let mycolor = result.color
        let hiscolor = mycolor === '#000000' ? '#ffffff' : '#000000'
        limitOneVector.forEach((vector, index) => {
            let check = this.checkerboard[vector.x][vector.y]
            if (check) {
                limit[`limitOne${index}`] = check.color
            } else if (!check && typeof(check) != "undefined" && check != 0) {
                limit[`limitOne${index}`] = NOTHINGFLAG
            }
        })
        limitTwoVector.forEach((vector, index) => {
            let check = this.checkerboard[vector.x][vector.y]
            if (check) {
                limit[`limitTwo${index}`] = check.color
            } else if (!check && typeof(check) != "undefined" && check != 0) {
                limit[`limitTwo${index}`] = NOTHINGFLAG
            }
        })

        let colorleft = limit['limitOne0']
        let colorleft1 = limit['limitOne1']
        let colorleft2 = limit['limitOne2']
        let colorleft3 = limit['limitOne3']
        let colorright = limit['limitTwo0']
        let colorright1 = limit['limitTwo1']
        let colorright2 = limit['limitTwo2']
        let colorright3 = limit['limitTwo3']

        if (result.count == 4) return WIN5 // 活5

        if (result.count == 3) { // 连续4连线
            if (colorleft == NOTHINGFLAG && colorright == NOTHINGFLAG)//两边断开位置均空
                return ALIVE4;//活四
            else if (colorleft == hiscolor && colorright == hiscolor)//两边断开位置均非空
                return NOTHREAT;//没有威胁
            else if (colorleft == NOTHINGFLAG || colorright == NOTHINGFLAG)//两边断开位置只有一个空
                return DIE4;//死四

        }

        if (result.count == 2) { // 连续3连线
            if (colorleft == NOTHINGFLAG && colorright == NOTHINGFLAG)//两边断开位置均空
            {

                if (colorleft1 == hiscolor && colorright1 == hiscolor)//均为对手棋子
                    return DIE3;
                else if (colorleft1 == mycolor || colorright1 == mycolor)//只要一个为自己的棋子
                    return LOWDIE4;
                else if (colorleft1 == NOTHINGFLAG || colorright1 == NOTHINGFLAG)//只要有一个空
                    return ALIVE3;

            }
            else if (colorleft == hiscolor && colorright == hiscolor)//两边断开位置均非空
            {
                return NOTHREAT;//没有威胁
            }
            else if (colorleft == NOTHINGFLAG || colorright == NOTHINGFLAG)//两边断开位置只有一个空
            {

                if (colorleft == hiscolor) {//左边被对方堵住
                    if (colorright1 == hiscolor)//右边也被对方堵住
                        return NOTHREAT;
                    if (colorright1 == NOTHINGFLAG)//右边均空
                        return DIE3;
                    if (colorright1 == mycolor)
                        return LOWDIE4;

                }
                if (colorright == hiscolor) {//右边被对方堵住
                    if (colorleft1 == hiscolor)//左边也被对方堵住
                        return NOTHREAT;
                    if (colorleft1 == NOTHINGFLAG)//左边均空
                        return DIE3;
                    if (colorleft1 == mycolor)//左边还有自己的棋子
                        return LOWDIE4;
                }
            }
        }

        if (result.count == 1) { // 两连线
            if (colorleft == NOTHINGFLAG && colorright == NOTHINGFLAG) {//两边断开位置均空
                if ((colorright1 == NOTHINGFLAG && colorright2 == mycolor) ||
                    (colorleft1 == NOTHINGFLAG && colorleft2 == mycolor))
                    return DIE3;//死3
                else if (colorleft1 == NOTHINGFLAG && colorright1 == NOTHINGFLAG)
                    return ALIVE2;//活2

                if ((colorright1 == mycolor && colorright2 == hiscolor) ||
                    (colorleft1 == mycolor && colorleft2 == hiscolor))
                    return DIE3;//死3

                if ((colorright1 == mycolor && colorright2 == mycolor) ||
                    (colorleft1 == mycolor && colorleft2 == mycolor))
                    return LOWDIE4;//死4

                if ((colorright1 == mycolor && colorright2 == NOTHINGFLAG) ||
                    (colorleft1 == mycolor && colorleft2 == NOTHINGFLAG))
                    return TIAO3;//跳活3
                //其他情况在下边返回NOTHREAT
            }
            else if (colorleft == hiscolor && colorright == hiscolor)//两边断开位置均非空
            {
                return NOTHREAT;
            }
            else if (colorleft == NOTHINGFLAG || colorright == NOTHINGFLAG)//两边断开位置只有一个空
            {
                if (colorleft == hiscolor) {//左边被对方堵住
                    if (colorright1 == hiscolor || colorright2 == hiscolor) {//只要有对方的一个棋子
                        return NOTHREAT;//没有威胁
                    }
                    else if (colorright1 == NOTHINGFLAG && colorright2 == NOTHINGFLAG) {//均空
                        return DIE2;//死2
                    }
                    else if (colorright1 == mycolor && colorright2 == mycolor) {//均为自己的棋子
                        return LOWDIE4;//死4
                    }
                    else if (colorright1 == mycolor || colorright2 == mycolor) {//只有一个自己的棋子
                        return DIE3;//死3
                    }
                }
                if (colorright == hiscolor) {//右边被对方堵住
                    if (colorleft1 == hiscolor || colorleft2 == hiscolor) {//只要有对方的一个棋子
                        return NOTHREAT;//没有威胁
                    }
                    else if (colorleft1 == NOTHINGFLAG && colorleft2 == NOTHINGFLAG) {//均空
                        return DIE2;//死2
                    }
                    else if (colorleft1 == mycolor && colorleft2 == mycolor) {//均为自己的棋子
                        return LOWDIE4;//死4
                    }
                    else if (colorleft1 == mycolor || colorleft2 == mycolor) {//只有一个自己的棋子
                        return DIE3;//死3
                    }
                } else if (colorleft == mycolor || colorright == mycolor) {
                    return DIE2
                }
            }
        }

        if (result.count == 0) { // 单点
            if (colorleft == NOTHINGFLAG && colorleft1 == mycolor &&
                colorleft2 == mycolor && colorleft3 == mycolor)
                return LOWDIE4;
            if (colorright == NOTHINGFLAG && colorright1 == mycolor &&
                colorright2 == mycolor && colorright3 == mycolor)
                return LOWDIE4;

            if (colorleft == NOTHINGFLAG && colorleft1 == mycolor &&
                colorleft2 == mycolor && colorleft3 == NOTHINGFLAG && colorright == NOTHINGFLAG)
                return TIAO3;
            if (colorright == NOTHINGFLAG && colorright1 == mycolor &&
                colorright2 == mycolor && colorright3 == NOTHINGFLAG && colorleft == NOTHINGFLAG)
                return TIAO3;

            if (colorleft == NOTHINGFLAG && colorleft1 == mycolor &&
                colorleft2 == mycolor && colorleft3 == hiscolor && colorright == NOTHINGFLAG)
                return DIE3;
            if (colorright == NOTHINGFLAG && colorright1 == mycolor &&
                colorright2 == mycolor && colorright3 == hiscolor && colorleft == NOTHINGFLAG)
                return DIE3;

            if (colorleft == NOTHINGFLAG && colorleft1 == NOTHINGFLAG &&
                colorleft2 == mycolor && colorleft3 == mycolor)
                return DIE3;
            if (colorright == NOTHINGFLAG && colorright1 == NOTHINGFLAG &&
                colorright2 == mycolor && colorright3 == mycolor)
                return DIE3;

            if (colorleft == NOTHINGFLAG && colorleft1 == mycolor &&
                colorleft2 == NOTHINGFLAG && colorleft3 == mycolor)
                return DIE3;
            if (colorright == NOTHINGFLAG && colorright1 == mycolor &&
                colorright2 == NOTHINGFLAG && colorright3 == mycolor)
                return DIE3;

            if (colorleft == NOTHINGFLAG && colorleft1 == mycolor &&
                colorleft2 == NOTHINGFLAG && colorleft3 == NOTHINGFLAG && colorright == NOTHINGFLAG)
                return LOWALIVE2;
            if (colorright == NOTHINGFLAG && colorright1 == mycolor &&
                colorright2 == NOTHINGFLAG && colorright3 == NOTHINGFLAG && colorleft == NOTHINGFLAG)
                return LOWALIVE2;

            if (colorleft == NOTHINGFLAG && colorleft1 == NOTHINGFLAG &&
                colorleft2 == mycolor && colorleft3 == NOTHINGFLAG && colorright == NOTHINGFLAG)
                return LOWALIVE2;
            if (colorright == NOTHINGFLAG && colorright1 == NOTHINGFLAG &&
                colorright2 == mycolor && colorright3 == NOTHINGFLAG && colorleft == NOTHINGFLAG)
                return LOWALIVE2;
        }

        return NOTHREAT
    }

    mergeScore(situation) {
        if (situation.win5 >= 1) {
            return LevelOne//赢5
        }

        if (situation.alive4 >= 1 || situation.die4 >= 2 || (situation.die4 >= 1 && situation.alive3 >= 1)) {
            return Leveltwo//活4 双死4 死4活3
        }

        if (situation.alive3 >= 2) {
            return Levelthree//双活3
        }

        if (situation.die3 >= 1 && situation.alive3 >= 1) {
            return Levelfour//死3高级活3
        }

        if (situation.die4 >= 1) {
            return Levelfive//高级死4
        }

        if (situation.lowdie4 >= 1) {
            return Levelsix//低级死4
        }

        if (situation.alive3 >= 1) {
            return Levelseven//单活3
        }

        if (situation.tiao3 >= 1) {
            return LevelEight//跳活3
        }

        if (situation.alive2 >= 2) {
            return LevelNight//双活2
        }

        if (situation.alive2 >= 1) {
            return LevelTen//活2
        }

        if (situation.lowalive2 >= 1) {
            return LevelEleven//低级活2
        }

        if (situation.die3 >= 1) {
            return LevelTwelve//死3
        }

        if (situation.die2 >= 1) {
            return LevelThirteen//死2
        }

        return LevelFourteen;//没有威胁
    }

    getRandomNumber([min, max]) {
        return Math.ceil((Math.random() * (max - min)) + min)
    }
}
new Five('canvas')