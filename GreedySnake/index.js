// 点击开始游戏  --> startpag消失   主页面出现，随机出现食物，出现三只小蛇
// 上下左右，改变方向  吃到食物，自身加一，食物消失，再随机出现
// 判断游戏结束，loser出现

var content = document.getElementsByClassName('content')[0];

var startPage = document.getElementsByClassName('startPage')[0];
var startBtn = document.getElementsByClassName('startBtn')[0];

var startOrPause = document.getElementsByClassName('startOrPause')[0];

var headScore = document.getElementById('headScore');
var loserScore = document.getElementsByClassName('loserScore')[0];
var loser = document.getElementsByClassName('loser')[0];
var close = document.getElementsByClassName('close')[0];

var startGameBool = true;
var startPauseBool = true;


var snakeMove,
    speed = 200;

init();

// 初始化
function init() {

    // 地图
    this.mapW = parseInt(getStyle(content, 'width'));
    this.mapH = parseInt(getStyle(content, 'height'));
    this.mapDiv = content;

    // 食物
    this.foodW = 20;
    this.foodH = 20;
    this.foodX = 0;
    this.foodY = 0;

    // 蛇
    this.snakeW = 20;
    this.snakeH = 20;
    //   x  y    头或身体
    this.snakeBody = [[3, 1, 'head'], [2, 1, 'body'], [1, 1, 'body']];

    //游戏属性 - 判断方向
    this.direct = 'right';
    this.left = false;
    this.right = false;
    this.up = true;
    this.down = true;

    this.score = 0; 

    // 初始化的时候，调用点击事件
    bindEvent();
}

// 开始游戏
function startGame() {
    startPage.style.display = 'none';
    startOrPause.style.display = 'block';
    
    food();
    snake(); 
}

// 生成随机食物
function food() {
    var food = document.createElement('div');

    food.style.width = this.foodW + 'px';
    food.style.height = this.foodH + 'px';

    food.style.position = 'absolute';
    this.foodX = Math.floor(Math.random() * (this.mapW / 20));
    this.foodY = Math.floor(Math.random() * (this.mapH / 20));

    food.style.left = this.foodX * 20 + 'px';
    food.style.top = this.foodY * 20 + 'px';

    this.mapDiv.appendChild(food).setAttribute('class', 'food');

}

// 生成蛇
function snake() {

    var len = this.snakeBody.length;

    // 根据最后的蛇的长度来动态生成
    for (var i = 0; i < len; i++) {
        var snake = document.createElement('div');

        snake.style.width = this.snakeW + 'px';
        snake.style.height = this.snakeH + 'px';

        snake.style.position = 'absolute';
        snake.style.left = this.snakeBody[i][0] * 20 + 'px';
        snake.style.top = this.snakeBody[i][1] * 20 + 'px';

        // 添加两个 class 名
        snake.classList.add('snake', this.snakeBody[i][2]);
        this.mapDiv.appendChild(snake);

        // 判断蛇头的方向
        switch (this.direct) {
            case 'right':
                break;
            case 'left':
                snake.style.transform = 'rotate(180deg)';
                break;
            case 'down':
                snake.style.transform = 'rotate(90deg)';
                break;
            case 'up':
                snake.style.transform = 'rotate(270deg)';
                break;
            default:
                break;
        }
    }
}

function move() {

    var len = this.snakeBody.length;

    // 上一位的蛇身体 附到 下一位
    for (var i = len - 1; i > 0; i --) {
        this.snakeBody[i][0] = this.snakeBody[i - 1][0];
        this.snakeBody[i][1] = this.snakeBody[i - 1][1];
    }

    // 判断方向 让它运动
    switch (this.direct) {
        case 'right':
            this.snakeBody[0][0] += 1;
            break;
        case 'left':
            this.snakeBody[0][0] -= 1;
            break;
        case 'down':
            this.snakeBody[0][1] += 1;
            break;
        case 'up':
            this.snakeBody[0][1] -= 1;
            break;
        default:
            break;
    }

    // 移除上一个蛇， 重新渲染一个
    removeClass('snake');
    snake();

    // 碰到食物
    if (this.snakeBody[0][0] == this.foodX && this.snakeBody[0][1] == this.foodY) {

        // 取出数组的最后一位的坐标，判断方向
        var snakeEndX = this.snakeBody[len - 1][0];
        var snakeEndY = this.snakeBody[len - 1][1];

        switch (this.direct) {
            case 'right':
                this.snakeBody.push([snakeEndX + 1, snakeEndY, 'body']);
                break;
            case 'left':
                this.snakeBody.push([snakeEndX - 1, snakeEndY, 'body']);
                break;
            case 'down':
                this.snakeBody.push([snakeEndX, snakeEndY + 1, 'body']);
                break;
            case 'up':
                this.snakeBody.push([snakeEndX, snakeEndY - 1, 'body']);
                break;
            default:
                break;
        }

        this.score += 1;
        headScore.innerHTML = this.score;
        removeClass('food');
        food();

    }

    // 左右边界
    if (this.snakeBody[0][0] < 0 || this.snakeBody[0][0] >= this.mapW / 20) {
        relodGame();
    }

    // 上下边界
    if (this.snakeBody[0][1] < 0 || this.snakeBody[0][1] >= this.mapH / 20) {
        relodGame();
    }

    // 碰到自身
    var snakeHX = snakeBody[0][0];
    var snakeHY = snakeBody[0][1];

    for (var i = 1; i < this.snakeBody.length - 1; i ++) {
        if (snakeHX == this.snakeBody[i][0] && snakeHY == this.snakeBody[i][1]) {
            relodGame();
        }
    }

}

function relodGame() {
    removeClass('snake');
    removeClass('food');
    clearInterval(snakeMove);

    this.snakeBody = [[3, 1, 'head'], [2, 1, 'body'], [1, 1, 'body']];

    this.direct = 'right';
    this.left = false;
    this.right = false;
    this.up = true;
    this.down = true;

    loser.style.display = 'block';
    loserScore.innerHTML = this.score;
    this.score = 0;
    headScore = this.score;

    startGameBool = true;
    startPauseBool = true;
    startOrPause.setAttribute('src', './image/start.png');
}

// 移除class属性
function removeClass(className) {
    var ele = document.getElementsByClassName(className);

    while (ele.length > 0) {
        ele[0].parentNode.removeChild(ele[0]);
    }

}

// 判断键盘的方向, 传入 方向
function setCode(code) {

    switch (code) {
        case 37:
            if (this.left) {
                this.direct = 'left';
                this.left = false;
                this.right = false;
                this.down = true;
                this.up = true;
            }
            break;
        case 38:
            if (this.up) {
                this.direct = 'up';
                this.left = true;
                this.right = true;
                this.down = false;
                this.up = false;
            }
            break;
        case 39:
            if (this.right) {
                this.direct = 'right';
                this.left = false;
                this.right = false;
                this.down = true;
                this.up = true;
            }
            break;
        case 40:
            if (this.down) {
                this.direct = 'down';
                this.left = true;
                this.right = true;
                this.down = false;
                this.up = false;
            }
            break;
        default:
            break;
    }

}

function bindEvent() {

    close.onclick = function () {
        loser.style.display = 'none';
    }
    startBtn.onclick = function () {
        startAndPause()
    }
    startOrPause.onclick = function () {
        startAndPause()
    }

}

// 进入游戏界面
function startAndPause() {
    if (startPauseBool) {
        if (startGameBool) {
            startGame();
            startGameBool = false;
        }
        startOrPause.setAttribute('src', './image/pause.png');
        document.onkeydown = function (e) {
            var code = e.keyCode;
            setCode(code);
        }
        snakeMove = setInterval(function () {
            move();
        },speed)
        startPauseBool = false;
    }else{
        startOrPause.setAttribute('src', './image/start.png');
        clearInterval(snakeMove);
        document.onkeydown = null;
        startPauseBool = true;
    }
}
