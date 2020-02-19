class Population {
    constructor(n, s, walls, checkpoints) {
        this.steps = s;
        this.n = n;
        this.walls = walls;
        this.checkpoints = checkpoints;
        this.cars = new Array(n);
        this.neat = new Neat(8, 4, n);
        this.matpool = [];
        for (let i = 0; i < this.n; ++i) {
            this.cars[i] = new Car(20, 40, this.walls, this.neat.genoms[i]);
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
                this.cars[i].think();
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
        this.maxFitCar = maxFitCar;
        
        this.matpool = [];
        // Normalize weights and create matpool
        for (let i = 0; i < fitnessArray.length; ++i) {
            let vegades = fitnessArray[i]*1000/maxFitness;
            for (let x = 0; x < vegades; ++x) {
                this.matpool.push(i);
            }
        }
        console.log("Max fitness: " + maxFitness)
    }

    reproduction() {
        let bestBrain = this.cars[this.maxFitCar].brain;
        bestBrain.print();
        
        for (let i = 0; i < this.n; ++i) {
            let i1 = Math.floor(Math.random()*this.matpool.length);
            let i2 = Math.floor(Math.random()*this.matpool.length);
            
            let pare = this.cars[this.matpool[i1]];
            let mare = this.cars[this.matpool[i2]];
            this.cars[i].brain = pare.crossover(mare);
            
            this.cars[i].brain.mutate();
            this.cars[i].restart();
        }
        // Tots els cotxes tornen a estar vius 
        this.alive.fill(true);
    }
}