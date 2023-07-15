class Board {
    data;
    opened = false;
    constructor(size_x, size_y, mine_count) {
        this.size_x = size_x;
        this.size_y = size_y;
        this.mine_count = Math.min(mine_count, size_x * size_y);
        this.initBoard();
    }

    initBoard() {
        this.data = new Array(this.size_x * this.size_y).fill(-1);
    }

    addBombs(opened_x, opened_y) {
        const opened_z = this.posToNum(opened_x, opened_y);
        const rnd = [];
        let cell_cnt = this.size_x * this.size_y - 1;
        for (let i = 0; i < this.mine_count; i++, cell_cnt--) rnd.push(this.randomInt(cell_cnt));
        rnd.sort();
        for (let i = 0; i < this.mine_count; i++) {
            rnd[i] += i;
            if (rnd[i] >= opened_z) rnd[i]++;
            this.data[rnd[i]] = 1;
        }
    }

    open(x, y) {
        if (!this.opened) {
            this.addBombs(x, y);
            this.opened = true;
        }
        let z = this.posToNum(x, y);
        if (this.data[z] == 0) return -2; // already opened
        if (this.data[z] == 1) {
            this.data[z] = 2;
            return -1; // lose
        }
        let adj_mine_count = this.adjMineCount;
        this.data[z] = 0;
        if (adj_mine_count[z] == 0) {
            const stack = [z];
            while (stack.length > 0) {
                let z = stack.pop();
                let adj = this.adjacentCells(z);
                adj.forEach((w) => {
                    if (this.data[w] == -1) {
                        this.data[w] = 0;
                        if (adj_mine_count[w] == 0) stack.push(w);
                    }
                });
            }
        }
        let safe_count = 0;
        this.data.forEach(e => { if (e == -1) safe_count++; })
        return safe_count == 0 ? 1 : 0;
    }

    moveMines() {
        const size = this.size_x * this.size_y;
        const mines = [];
        for (let z = 0; z < size; z++) if (this.data[z] == 1) mines.push(z);
        for (let i = mines.length; i > 1; i--) {
            let k = this.randomInt(i);
            [mines[i], mines[k]] = [mines[k], mines[i]];
        }
        mines.forEach((z) => {
            const adj = this.adjacentCells4Dir(z);
            adj.push(z);
            let cnt = 0;
            adj.forEach((w) => { if (this.data[w] == -1) cnt++; });
            if (cnt == 0) return;
            let k = this.randomInt(cnt);
            adj.forEach((w) => {
                if (this.data[w] == -1) {
                    if (k-- == 0) {
                        this.data[z] = -1;
                        this.data[w] = 1;
                    }
                }
            })
        });
    }

    get adjMineCount() {
        const ret = new Array(size_x).fill(null).map(() => { return new Array(this.size_y).fill(0) });
        const size = this.size_x * this.size_y;
        for (let z = 0; z < size; z++) {
            const adj = this.adjacentCells(z);
            let cnt = 0;
            adj.forEach((w) => {
                if (this.data[w] >= 1) cnt++;
            });
            ret[z] = cnt;
        }
        return ret;
    }

    adjacentCells(z) {
        let x = this.numToPosX(z);
        let y = this.numToPosY(z);
        const ret = [];
        if (x > 0) {
            if (y > 0) ret.push(z - this.size_y - 1);
            ret.push(z - this.size_y);
            if (y + 1 < this.size_y) ret.push(z - this.size_y + 1);
        }
        if (y > 0) ret.push(z - 1);
        if (y + 1 < this.size_y) ret.push(z + 1);
        if (x + 1 < this.size_x) {
            if (y > 0) ret.push(z + this.size_y - 1);
            ret.push(z + this.size_y);
            if (y + 1 < this.size_y) ret.push(z + this.size_y + 1);
        }
        return ret;
    }

    adjacentCells4Dir(z) {
        let x = this.numToPosX(z);
        let y = this.numToPosY(z);
        const ret = [];
        if (x > 0) ret.push(z - this.size_y);
        if (x + 1 < this.size_x) ret.push(z + this.size_y);
        if (y > 0) ret.push(z - 1);
        if (y + 1 < this.size_y) ret.push(z + 1);
        return ret;
    }

    posToNum(x, y) { return x * this.size_y + y; }
    numToPosX(z) { return Math.floor(z / this.size_y); }
    numToPosY(z) { return z % this.size_y; }
    randomInt(n) { return Math.min(n - 1, Math.floor(n * Math.random())); }
}