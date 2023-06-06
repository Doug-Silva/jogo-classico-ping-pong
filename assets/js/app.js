const canvasEl = document.querySelector("canvas");
const canvasCtx = canvasEl.getContext("2d");
const gapX = 10;
const mouse = { x: 0, y: 0 };

//desenha o campo
const field = {
    w: window.innerWidth,
    h: window.innerHeight,

    draw: function () {
        canvasCtx.fillStyle = "#286047";
        canvasCtx.fillRect(0, 0, this.w, this.h);
    },
}

//desenha a linha central
const line = {
    w: 15,
    h: field.h,

    draw: function () {
        canvasCtx.fillStyle = "#ffffff";
        canvasCtx.fillRect(field.w / 2 - this.w / 2, 0, this.w, this.h)
    },
}

//desenha a raquete esquerda
const leftPaddle = {
    x: gapX,
    y: 0,
    w: line.w,
    h: 200,

    _move: function () {
        this.y = mouse.y - this.h / 2;
    },

    draw: function () {
        canvasCtx.fillStyle = "#ffffff";
        canvasCtx.fillRect(this.x, this.y, this.w, this.h);

        this._move();
    },
}

//desenha a raquete direita
const rightPaddle = {
    x: field.w - line.w - gapX,
    y: 100,
    w: line.w,
    h: 200,

    _move: function () {
        this.y = ball.y;
    },

    draw: function () {
        canvasCtx.fillStyle = "#ffffff";
        canvasCtx.fillRect(this.x, this.y, this.w, this.h);

        this._move();
    },
}

//desenha o placar
const score = {
    human: 1,
    computer: 2,

    increaseHuman: function () {
        this.human++;
    },

    increaseComputer: function () {
        this.computer++;
    },

    draw: function () {
        canvasCtx.font = "bold 72px Arial";
        canvasCtx.textAlign = "center";
        canvasCtx.textBaseline = "top";
        canvasCtx.fillStyle = "#01341D";
        canvasCtx.fillText(this.human, field.w / 4, 50);
        canvasCtx.fillText(this.computer, field.w / 4 + field.w / 2, 50);
    },
}

//desenha a bolinha
const ball = {
    x: 0,
    y: 0,
    r: 20,
    speed: 5,
    directionX: 1,
    directionY: 1,

    _calcPosition: function () {

        //verifica se o jogador 1 fez um ponto (x > largura do campo)
        if (this.x > field.w - this.r - rightPaddle.w - gapX) {

            //verifica a raquete direita está na posição y da bola
            if (this.y + this.r > rightPaddle.y && 
                this.y - this.r < rightPaddle.y + rightPaddle.h) 
            {
                //rebate a bola invertendo o sinal do eixo X
                this._reverseX();
            } else {

                //pontuar o jogador 1
                score.increaseHuman();
                this._pointUp();
            }
        }

        //verifica as laterais superior e inferior da tela
        if (
            (this.y - this.r < 0 && this.directionY < 0) || 
            (this.y > field.h - this.r && this.directionY > 0)
        ) {
            //rebate a bola invertendo o sinal do eixo Y
            this._reverseY();
        }
    },

    // 1 * -1 = -1
    // -1 * -1 = 1
    _reverseX: function () {
        this.directionX *= -1;
    },

    // 1 * -1 = -1
    // -1 * -1 = 1
    _reverseY: function () {
        this.directionY *= -1;
    },

    _pointUp: function () {
        this.x = field.w / 2;
        this.y = field.h / 2;
    },

    _move: function () {
        this.x += this.directionX * this.speed;
        this.y += this.directionY * this.speed;
    },

    draw: function () {
        canvasCtx.fillStyle = "#ffffff";
        canvasCtx.beginPath();
        canvasCtx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false);
        canvasCtx.fill();

        this._calcPosition();
        this._move();
    },
}

function setup() {
    canvasEl.width = canvasCtx.width = field.w;
    canvasEl.height = canvasCtx.height = field.h;
}

function draw() {
    field.draw();
    line.draw();
    leftPaddle.draw();
    rightPaddle.draw();
    score.draw();
    ball.draw();
}

window.animateFrame = (function () {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            return window.setTimeout(callback, 1000 / 60)
        }
    )
})()

function main() {
    animateFrame(main);
    draw();
}

setup();
main();

canvasEl.addEventListener('mousemove', function (e) {
    mouse.x = e.pageX;
    mouse.y = e.pageY;
})