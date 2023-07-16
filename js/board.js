class Board {
    data;
    opened = false;
    constructor(height, width, mine_count) {
        this.height = height;
        this.width = width;
        this.mine_count = Math.min(mine_count, height * width);
        this.initBoard();
    }

    initBoard() {
        this.data = new Array(this.height * this.width).fill(-1);
    }

    addBombs(opened_x, opened_y) {
        const opened_z = this.posToNum(opened_x, opened_y);
        const rnd = [];
        let rnd_max = this.height * this.width - this.mine_count;
        for (let i = 0; i < this.mine_count; i++) rnd.push(this.randomInt(rnd_max));
        rnd.sort((a, b) => a - b);
        for (let i = 0; i < this.mine_count; i++) {
            rnd[i] += i;
            if (rnd[i] >= opened_z) rnd[i]++;
            this.data[rnd[i]] = 1;
            console.log(rnd[i]);
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
        const size = this.height * this.width;
        const mines = [];
        for (let z = 0; z < size; z++) if (this.data[z] == 1) mines.push(z);
        for (let i = mines.length; i > 1; i--) {
            let k = this.randomInt(i);
            [mines[i], mines[k]] = [mines[k], mines[i]];
        }
        mines.forEach((z) => {
            const adj = this.adjacentCells4Dir(z);
            let cnt = 1;
            adj.forEach((w) => { if (this.data[w] == -1) cnt++; })
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
        const ret = new Array(height).fill(null).map(() => { return new Array(this.width).fill(0) });
        const size = this.height * this.width;
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
            if (y > 0) ret.push(z - this.width - 1);
            ret.push(z - this.width);
            if (y + 1 < this.width) ret.push(z - this.width + 1);
        }
        if (y > 0) ret.push(z - 1);
        if (y + 1 < this.width) ret.push(z + 1);
        if (x + 1 < this.height) {
            if (y > 0) ret.push(z + this.width - 1);
            ret.push(z + this.width);
            if (y + 1 < this.width) ret.push(z + this.width + 1);
        }
        return ret;
    }

    adjacentCells4Dir(z) {
        let x = this.numToPosX(z);
        let y = this.numToPosY(z);
        const ret = [];
        if (x > 0) ret.push(z - this.width);
        if (x + 1 < this.height) ret.push(z + this.width);
        if (y > 0) ret.push(z - 1);
        if (y + 1 < this.width) ret.push(z + 1);
        return ret;
    }

    posToNum(x, y) { return x * this.width + y; }
    numToPosX(z) { return Math.floor((z - this.numToPosY(z) + 0.5) / this.width); }
    numToPosY(z) { return Math.floor((z + 0.5) % this.width); }
    randomInt(n) { return Math.min(n - 1, Math.floor(n * Math.random())); }
}