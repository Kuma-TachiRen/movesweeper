let game;
let size_x = 9;
let size_y = 9;
let mine_count = 10;
let cells = [];

let elm_board = document.getElementById('game-board');

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

elm_board.addEventListener('click', e => {
    if (game.win || game.lose) return;
    var elm_clicked = e.target.tagName.toLowerCase() === 'img' ? e.target.parentElement : e.target;
    if (elm_clicked.classList.contains('game-cell')) {
        var x = parseInt(elm_clicked.dataset.x);
        var y = parseInt(elm_clicked.dataset.y);
        game.open(x, y);
    }
});

function buildBoard() {
    const header = `<tr><td colspan=${size_y}><div class="game-menu flex-container"><div id="game-timer"></div><div id="game-reset">🙂</div><div id="game-mines">${mine_count.toString().padStart(3, '0')}</div></div></td></tr>`;
    elm_board.innerHTML = header + `<tr class="game-row">${'<td class="game-cell"></td>'.repeat(size_y)}</tr>`.repeat(size_x);
    cells = Array.from(document.getElementsByClassName('game-cell'));
    cells.forEach(function (cell, z) {
        cell.setAttribute('data-x', Math.floor(z / size_y));
        cell.setAttribute('data-y', z % size_y);
    });
    document.getElementById('game-reset').addEventListener('click', e => {
        init();
        render();
    });
}

function init() {
    game = new Game(size_x, size_y, mine_count, 1000, render);
    buildBoard();
}

function render() {
    const board = game.boardInfo;
    board.forEach((e, z) => {
        switch (e) {
            case -1:
                break;
            case -2:
                cells[z].innerText = '💣';
                cells[z].setAttribute('mine', true);
                break;
            case -3:
                cells[z].innerText = '💣';
                cells[z].setAttribute('mine', true);
                cells[z].setAttribute('opened', true);
                break;
            case 0:
                cells[z].innerText = '';
                cells[z].style.color = '';
                cells[z].setAttribute('opened', true);
                break;
            default:
                cells[z].innerText = e;
                cells[z].style.color = color_list[e];
                cells[z].setAttribute('opened', true);
        }
    });
    document.getElementById("game-timer").innerText = game.time.toString().padStart(3, '0');
    if (game.win) {
        document.getElementById("game-reset").innerText = '😎';
    } else if (game.lose) {
        document.getElementById("game-reset").innerText = '😫';
    } else {

    }
}

init();
render();