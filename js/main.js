let game;
let height;
let width;
let mine_count;
let move_interval;
setDifficulty(0, 0);

let cells = [];

const setting_cells = [];

document.getElementById('setting-apply').addEventListener('click', () => {
    let difficulty = Number.parseInt(document.getElementById('setting-difficulty').value);
    let interval = Number.parseInt(document.getElementById('setting-interval').value);
    setDifficulty(difficulty, interval);
    init();
    render();
});

document.getElementById('setting-difficulty').addEventListener('change', e => {
    if (e.target.value == -1) {
        document.getElementById('custom-height').removeAttribute('disabled');
        document.getElementById('custom-width').removeAttribute('disabled');
        document.getElementById('custom-mines').removeAttribute('disabled');
    }
    else {
        document.getElementById('custom-height').setAttribute('disabled', true);
        document.getElementById('custom-width').setAttribute('disabled', true);
        document.getElementById('custom-mines').setAttribute('disabled', true);
    }
});

document.getElementById('setting-interval').addEventListener('change', e => {
    if (e.target.value == -1) {
        document.getElementById('custom-interval').removeAttribute('disabled');
    }
    else {
        document.getElementById('custom-interval').setAttribute('disabled', true);
    }
});

document.getElementById('custom-height').addEventListener('input', e => { clampNumberInput(e.target); updateMaxMines(); });
document.getElementById('custom-width').addEventListener('input', e => { clampNumberInput(e.target); updateMaxMines(); });
document.getElementById('custom-mines').addEventListener('input', e => clampNumberInput(e.target));
document.getElementById('custom-interval').addEventListener('input', e => clampNumberInput(e.target));

function updateMaxMines() {
    let h = Number.parseInt(document.getElementById('custom-height').value);
    let w = Number.parseInt(document.getElementById('custom-width').value);
    const elm = document.getElementById('custom-mines');
    elm.setAttribute('max', (h - 1) * (w - 1));
    clampNumberInput(elm);
}
updateMaxMines();

function clampNumberInput(e) {
    let val = Number.parseFloat(e.value);
    if (e.getAttribute('min')) val = Math.max(val, Number.parseFloat(e.getAttribute('min')));
    if (e.getAttribute('max')) val = Math.min(val, Number.parseFloat(e.getAttribute('max')));
    e.value = val;
}

function htmlTextSevenSeg(num, digit) {
    let ret = '';
    for (let i = 0; i < digit; i++) {
        ret = `<div class="seven-seg" number="${num % 10}"></div>` + ret;
        num = Math.floor(num / 10);
    }
    ret = `<div class="flex-row seven-seg-container">${ret}</div>`
    return ret;
}

const elm_board = document.querySelector('#game-board');

elm_board.addEventListener('click', e => {
    if (game.win || game.lose) return;
    var elm_clicked = e.target;
    if (elm_clicked.classList.contains('game-cell')) {
        var x = parseInt(elm_clicked.dataset.x);
        var y = parseInt(elm_clicked.dataset.y);
        game.open(x, y);
    }
});

document.getElementById('game-reset').addEventListener('click', () => {
    init();
    render();
});

function setDifficulty(board, interval) {
    switch (board) {
        case 0:
            height = 9;
            width = 9;
            mine_count = 10;
            break;
        case 1:
            height = 16;
            width = 16;
            mine_count = 40;
            break;
        case 2:
            height = 30;
            width = 16;
            mine_count = 99;
            break;
        default:
            height = Number.parseInt(document.getElementById('custom-height').value);
            width = Number.parseInt(document.getElementById('custom-width').value);
            mine_count = Number.parseInt(document.getElementById('custom-mines').value);
            break;
    }
    switch (interval) {
        case 0:
            move_interval = 4000;
            break;
        case 1:
            move_interval = 2000;
            break;
        case 2:
            move_interval = 1000;
            break;
        case 3:
            move_interval = 500;
            break;
        default:
            move_interval = Number.parseFloat(document.getElementById('custom-interval').value) * 1000;
            break;
    }
}

function buildBoard() {
    elm_board.innerHTML = `<div class="flex-row">${'<div class="game-cell"></div>'.repeat(width)}</div>`.repeat(height);
    cells = Array.from(document.getElementsByClassName('game-cell'));
    cells.forEach(function (cell, z) {
        cell.setAttribute('data-x', Math.floor(z / width));
        cell.setAttribute('data-y', z % width);
    });
}

function init() {
    document.getElementById('game-reset-face').setAttribute('type', 'normal');
    if (game) game.stop();
    game = new Game(height, width, mine_count, move_interval, render);
    buildBoard();
}

function render() {
    const board = game.boardInfo;
    let opened_count = 0;
    board.forEach((e, z) => {
        if (e <= 0) cells[z].removeAttribute('number');
        switch (e) {
            case -1:
                break;
            case -2:
                if (game.win) {
                    cells[z].setAttribute('flag', true);
                } else {
                    cells[z].setAttribute('mine', true);
                }
                break;
            case -3:
                cells[z].setAttribute('mine', true);
                cells[z].setAttribute('opened', true);
                break;
            case 0:
                cells[z].setAttribute('opened', true);
                opened_count++;
                break;
            default:
                cells[z].setAttribute('number', e);
                cells[z].setAttribute('opened', true);
                opened_count++;
        }
    });
    let remain_count = Math.round(height * width - mine_count - opened_count);
    document.getElementById("game-counter").innerHTML = `${htmlTextSevenSeg(remain_count, 3)}`;
    document.getElementById("game-timer").innerHTML = `${htmlTextSevenSeg(game.time, 3)}`;
    if (game.win) {
        document.getElementById('game-reset-face').setAttribute('type', 'win');
    } else if (game.lose) {
        document.getElementById('game-reset-face').setAttribute('type', 'lose');
    } else {

    }
}

init();
render();