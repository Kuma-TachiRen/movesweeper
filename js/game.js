class Game {
    board;
    win = false;
    lose = false;
    time = 0;
    timer_id;
    move_timer_id;
    constructor(size_x, size_y, mine_count, move_interval, render) {
        this.size_x = size_x;
        this.size_y = size_y;
        this.mine_count = mine_count;
        this.move_interval = move_interval;
        this.render = render;
        this.board = new Board(size_x, size_y, mine_count);
    }

    setTimer() {
        this.timer_id = setInterval(() => {
            this.time++;
        }, 1000);
    }

    setMoveTimer() {
        this.move_timer_id = setInterval(() => {
            this.board.moveMines();
            this.render();
        }, this.move_interval);
    }

    open(x, y) {
        if (this.win || this.lose) return;
        const opened = this.board.opened;
        const result = this.board.open(x, y);
        if (result == -2) return;
        if (!opened) {
            this.setTimer();
            this.setMoveTimer();
        }
        if (result == -1) {
            this.lose = true;
            clearInterval(this.timer_id);
            clearInterval(this.move_timer_id);
        }
        if (result == 1) {
            this.win = true;
            clearInterval(this.timer_id);
            clearInterval(this.move_timer_id);
        }
        this.render();
    }

    get boardInfo() {
        const count = this.board.adjMineCount;
        let size = this.size_x * this.size_y;
        let ended = this.win || this.lose;
        const ret = new Array(size).fill(0).map((e, z) => {
            switch (this.board.data[z]) {
                case -1: return -1;
                case 0: return count[z];
                case 1: return ended ? -2 : -1;
                case 2: return -3;
            }
        });
        return ret;
    }
}