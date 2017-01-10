var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var sizeInput = document.getElementById('size');
var changeSizeButton = document.getElementById('change-size-button');
var scoreText = document.getElementsByClassName('score-desc')[0];
var restartButton = document.getElementById('start');
var menu = document.getElementById('menu');
CanvasRenderingContext2D.prototype.roundRect = function(x, y, width, height, radius, fill, stroke) {
    if (typeof stroke == "undefined") {
        stroke = true;
    }
    if (typeof radius === "undefined") {
        radius = 5;
    }
    this.beginPath();
    this.moveTo(x + radius, y);
    this.lineTo(x + width - radius, y);
    this.quadraticCurveTo(x + width, y, x + width, y + radius);
    this.lineTo(x + width, y + height - radius);
    this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    this.lineTo(x + radius, y + height);
    this.quadraticCurveTo(x, y + height, x, y + height - radius);
    this.lineTo(x, y + radius);
    this.quadraticCurveTo(x, y, x + radius, y);
    this.closePath();
    if (stroke) {
        this.stroke();
    }
    if (fill) {
        this.fill();
    }
}

function Game(canvas, context, sizeInput, changeSizeButton) {
    this.canvas = canvas;
    this.context = context;
    this.sizeInput = sizeInput;
    this.changeSizeButton = changeSizeButton;
    this.score = 0;
    this.size = 4;
    this.widthField = this.canvas.width / this.size - 6;
    this.cells = [];
    this.loose = false;
    this.fontSize = 0;
}
Game.prototype.cell = function(row, column, width) {
    this.value = 0;
    this.x = column * width + 5 * (column + 1);
    this.y = row * width + 5 * (row + 1);
}
Game.prototype.createCells = function() {
    for (var i = 0; i < this.size; i++) {
        this.cells[i] = [];
        for (var j = 0; j < this.size; j++) {
            this.cells[i][j] = new this.cell(i, j, this.widthField);
        }
    }
}
Game.prototype.drawCells = function(cell) {
    var cornerRadius = 15;
    this.context.beginPath();
    this.context.roundRect(cell.x + (cornerRadius / 2), cell.y + (cornerRadius / 2), this.widthField - (cornerRadius / 2), this.widthField - (cornerRadius / 2), 10, false, false);
    switch (cell.value) {
        case 0:
            this.context.fillStyle = '#3d2963';
            break;
        case 2:
            this.context.fillStyle = '#41c9b8';
            break;
        case 4:
            this.context.fillStyle = '#00b2a1';
            break;
        case 8:
            this.context.fillStyle = '#ed5471';
            break;
        case 16:
            this.context.fillStyle = '#e73c75';
            break;
        case 32:
            this.context.fillStyle = '#b81c64';
            break;
        case 64:
            this.context.fillStyle = '#cf3768';
            break;
        case 128:
            this.context.fillStyle = '#ffb33c';
            break;
        case 256:
            this.context.fillStyle = '#f68530';
            break;
        case 512:
            this.context.fillStyle = '#e85938';
            break;
        case 1024:
            this.context.fillStyle = '#9e005d';
            break;
        case 2048:
            this.context.fillStyle = '#58407c';
            break;
        case 4096:
            this.context.fillStyle = '#65407c';
            break;
        default:
            this.context.fillStyle = '#3d2963';
    }
    this.context.fill();
    if (cell.value) {
        this.fontSize = this.widthField / 2;
        this.context.font = 'bold ' + this.fontSize + 'px Comic Sans MS';
        this.context.fillStyle = 'white';
        this.context.textAlign = 'center';
        this.context.fillText(cell.value, cell.x + this.widthField / 2, cell.y + this.widthField / 2 + this.widthField / 7);
    }
}
Game.prototype.gameOver = function() {
    this.loose = true;
    menu.style.opacity = '1';
    menu.style.display = 'flex';
}
Game.prototype.drawAllCells = function() {
    for (var i = 0; i < this.size; i++) {
        for (var j = 0; j < this.size; j++) {
            this.drawCells(this.cells[i][j]);
        }
    }
}

Game.prototype.changeSizeField = function() {
    var that = this;
    this.changeSizeButton.onclick = function() {
        if (that.sizeInput.value >= 2 && that.sizeInput.value <= 10) {
            that.size = that.sizeInput.value;
            that.widthField = that.canvas.width / that.size - 6;
            that.context.clearRect(0, 0, 500, 500);
            that.startGame();
        }
    };
}
Game.prototype.onRestart = function() {
    var that = this;
    restartButton.onclick = function() {
        menu.style.opacity = '0';
        menu.style.display = 'none';
        that.score = 0;
        that.loose = false;
        scoreText.innerHTML = that.score;
        that.context.clearRect(0, 0, 500, 500);
        that.startGame();
    }
}
Game.prototype.onKeyDown = function() {
    var that = this;
    document.onkeydown = function(event) {
        if (!that.loose) {
            if (event.keyCode === 38 || event.keyCode === 87) {
                that.moveUp();
            } else if (event.keyCode === 39 || event.keyCode === 68) {
                that.moveRight();
            } else if (event.keyCode === 40 || event.keyCode === 83) {
                that.moveDown();
            } else if (event.keyCode === 37 || event.keyCode === 65) {
                that.moveLeft();
            }
            scoreText.innerHTML = that.score;
        }
    }
}
Game.prototype.moveRight = function() {
    for (var i = 0; i < this.size; i++) {
        for (var j = this.size - 2; j >= 0; j--) {
            if (this.cells[i][j].value) {
                var column = j;
                while (column + 1 < this.size) {
                    if (!this.cells[i][column + 1].value) {
                        this.cells[i][column + 1].value = this.cells[i][column].value;
                        this.cells[i][column].value = 0;
                        column++;
                    } else if (this.cells[i][column].value == this.cells[i][column + 1].value) {
                        this.cells[i][column + 1].value *= 2;
                        this.score += this.cells[i][column + 1].value;
                        this.cells[i][column].value = 0;
                        break;
                    } else break;
                }
            }
        }
    }
    this.createNewCell();
}
Game.prototype.moveUp = function() {
    for (var j = 0; j < this.size; j++) {
        for (var i = 1; i < this.size; i++) {
            if (this.cells[i][j].value) {
                var row = i;
                while (row > 0) {
                    if (!this.cells[row - 1][j].value) {
                        this.cells[row - 1][j].value = this.cells[row][j].value;
                        this.cells[row][j].value = 0;
                        row--;
                    } else if (this.cells[row][j].value == this.cells[row - 1][j].value) {
                        this.cells[row - 1][j].value *= 2;
                        this.score += this.cells[row - 1][j].value;
                        this.cells[row][j].value = 0;
                        break;
                    } else break;
                }
            }
        }
    }
    this.createNewCell();
}
Game.prototype.moveDown = function() {
    for (var j = 0; j < this.size; j++) {
        for (var i = this.size - 2; i >= 0; i--) {
            if (this.cells[i][j].value) {
                var row = i;
                while (row + 1 < this.size) {
                    if (!this.cells[row + 1][j].value) {
                        this.cells[row + 1][j].value = this.cells[row][j].value;
                        this.cells[row][j].value = 0;
                        row++;
                    } else if (this.cells[row][j].value == this.cells[row + 1][j].value) {
                        this.cells[row + 1][j].value *= 2;
                        this.score += this.cells[row + 1][j].value;
                        this.cells[row][j].value = 0;
                        break;
                    } else break;
                }
            }
        }
    }
    this.createNewCell();
}
Game.prototype.moveLeft = function() {
    for (var i = 0; i < this.size; i++) {
        for (var j = 1; j < this.size; j++) {
            if (this.cells[i][j].value) {
                var column = j;
                while (column - 1 >= 0) {
                    if (!this.cells[i][column - 1].value) {
                        this.cells[i][column - 1].value = this.cells[i][column].value;
                        this.cells[i][column].value = 0;
                        column--;
                    } else if (this.cells[i][column].value == this.cells[i][column - 1].value) {
                        this.cells[i][column - 1].value *= 2;
                        this.score += this.cells[i][column - 1].value;
                        this.cells[i][column].value = 0;
                        break;
                    } else {
                        break;
                    }
                }
            }
        }
    }
    this.createNewCell();
}
Game.prototype.createNewCell = function() {
    var countCells = 0;
    for (var i = 0; i < this.size; i++) {
        for (var j = 0; j < this.size; j++) {
            if (!this.cells[i][j].value) {
                countCells++;
            }
        }
    }
    if (!countCells) {
        this.gameOver();
        return;
    }
    while (true) {
        var row = Math.floor(Math.random() * this.size);
        var column = Math.floor(Math.random() * this.size);
        if (!this.cells[row][column].value) {
            this.cells[row][column].value = 2 * Math.ceil(Math.random() * 2);
            this.drawAllCells();
            return;
        }
    }
}
Game.prototype.startGame = function() {
    this.createCells();
    this.createNewCell();
    this.drawAllCells();
    this.changeSizeField();
    this.onRestart();
    this.onKeyDown();

}

var game = new Game(canvas, context, sizeInput, changeSizeButton);
game.startGame();
