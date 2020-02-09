class Population {
    constructor(n, s, walls, checkpoints) {
        this.steps = s;
        this.n = n;
        this.walls = walls;
        this.checkpoints = checkpoints;
        this.cars = new Array(n);
        this.neat = new Neat(8, 4);
        this.matpool = [];
        for (let i = 0; i < this.n; ++i) {
            this.cars[i] = new Car(20, 40, this.walls);
        }
        this.alive = new Array(n);
        this.alive.fill(true);
    }

    checkColision(car) {
        for (let i = 0; i < this.walls.length; ++i) {
            if (car.collides(this.walls[i])) {
                return true;
            } 
        }
        return false;
    }

    progress(car, step) {
        for (let i = 0; i < this.checkpoints.length; ++i) {
            let frontWall = car.walls[0];
            if (frontWall.intersection(this.checkpoints[i])) {
                if (car.checkpoints.length == i) {
                    car.checkpoints.push([i, step]);
                }
            } 
        }
    }

    run(s) {
        let end = true;
        // For every car
        for (let i = 0; i < this.n; ++i) {
            if (this.alive[i]) {
                end = false;
                this.cars[i].action(this.cars[i].dna.gens[s]);
                this.cars[i].move();
                this.cars[i].show("green");
                this.cars[i].checkVel();
                this.progress(this.cars[i], s);
            }
            else this.cars[i].show("red");

            if (this.checkColision(this.cars[i])) {
                this.alive[i] = false;
                this.cars[i].deadAt = s;
            }
        }
        if (end) return Infinity;
        return ++s;
    }

    selection() {
        let fitnessArray = new Array(this.cars.length);
        let maxFitness = 0;
        let maxFitCar = 0;

        for (let i = 0; i < this.cars.length; ++i) {
            let aux = this.cars[i].fitness();
            fitnessArray[i] = aux;
            if (aux > maxFitness) {
                maxFitness = aux;
                maxFitCar = i;
            }
        }
        
        this.matpool = [];
        // Normalize weights and create matpool
        for (let i = 0; i < fitnessArray.length; ++i) {
            let vegades = fitnessArray[i]*1000/maxFitness;
            for (let x = 0; x < vegades; ++x) {
                this.matpool.push(i);
            }
        } 
        console.log('-----------------------------------------');
        this.cars[maxFitCar].print();
        this.maxFitCar = maxFitCar;
        console.log("Max fit: " + maxFitness);
    }

    reproduction() {
        let newPopulation = new Array(this.n);
        for (let i = 0; i < this.n; ++i) {
            // let father = this.cars[Math.floor(Math.random()*this.n)];
            // let mother = this.cars[Math.floor(Math.random()*this.n)];
            
            // let child = mother.sex(father);
            // newPopulation[i] = child;
            
            let newCar = this.cars[this.maxFitCar].copy();
            newCar.mutate(0.01);
            newPopulation[i] = newCar;

        }

        this.cars = newPopulation;
        this.alive.fill(true);
    }
}