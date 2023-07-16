const color_list = [
    '',
    'blue',
    'green',
    'red',
    'navy',
    'maroon',
    'teal',
    'black',
    'gray'
]

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

const elm_board = document.querySelector('#game-board > tbody');

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
        case 3:
            height = Number.parseInt(document.getElementById('custom-height').value);
            width = Number.parseInt(document.getElementById('custom-width').value);
            mine_count = Number.parseInt(document.getElementById('custom-mines').value);
            break;
    }
    switch (interval) {
        case 0:
            move_interval = 2000;
            break;
        case 1:
            move_interval = 1000;
            break;
        case 2:
            move_interval = 500;
            break;
        case 3:
            move_interval = Number.parseFloat(document.getElementById('custom-interval').value) * 1000;
            break;
    }
}

function buildBoard() {
    elm_board.innerHTML = `<tr class="game-row">${'<td class="game-cell"></td>'.repeat(width)}</tr>`.repeat(height);
    cells = Array.from(document.getElementsByClassName('game-cell'));
    cells.forEach(function (cell, z) {
        cell.setAttribute('data-x', Math.floor(z / width));
        cell.setAttribute('data-y', z % width);
    });
}

function init() {
    document.getElementById('game-reset').innerText = '🙂';
    game = new Game(height, width, mine_count, move_interval, render);
    buildBoard();
}

function render() {
    const board = game.boardInfo;
    let opened_count = 0;
    board.forEach((e, z) => {
        switch (e) {
            case -1:
                cells[z].innerText = '';
                break;
            case -2:
                if (game.win) {
                    cells[z].innerText = '🚩';
                } else {
                    cells[z].innerText = '💣';
                }
                break;
            case -3:
                cells[z].innerText = '💣';
                cells[z].setAttribute('mine', true);
                break;
            case 0:
                cells[z].innerText = '';
                cells[z].style.color = '';
                cells[z].setAttribute('opened', true);
                opened_count++;
                break;
            default:
                cells[z].innerText = e;
                cells[z].style.color = color_list[e];
                cells[z].setAttribute('opened', true);
                opened_count++;
        }
    });
    let remain_count = Math.round(height * width - mine_count - opened_count);
    document.getElementById("game-counter").innerText = `📦${remain_count.toString().padStart(3, '0')}`;
    document.getElementById("game-timer").innerText = `⏱️${game.time.toString().padStart(3, '0')}`;
    if (game.win) {
        document.getElementById("game-reset").innerText = '😎';
    } else if (game.lose) {
        document.getElementById("game-reset").innerText = '😫';
    } else {

    }
}

init();
render();