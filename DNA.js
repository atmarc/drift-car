class DNA {

    constructor(len, gens) {
        this.len = len;
        if (gens != undefined) this.gens = gens;
        else {
            this.gens = new Array(len);
            for (let i = 0; i < len; ++i) {
                this.gens[i] = Math.floor(Math.random()*4);
            }
        }
    }

    mutation(gen) {
        if (Math.random() < 0.01) {
            return Math.floor(Math.random()*4);
        }
        else return gen;
    }

    crossover(dnaY) {
        let index = Math.floor(Math.random()*this.len);
        let newGens = new Array(this.len);
        for (let i = 0; i < this.len; ++i) {
            if (i < index) {
                newGens[i] = this.gens[i]
            }
            else {
                newGens[i] = dnaY.gens[i]
            }
            newGens[i] = this.mutation(newGens[i]);
        }
        
        return new DNA(this.len, newGens);
    }

    copy() {
        let newGens = new Array(this.len);
        for (let i = 0; i < this.len; ++i) {
            newGens[i] = this.gens[i];
        }
        return new DNA(this.len, newGens);
    }

}