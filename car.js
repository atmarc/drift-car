function dist(x1, y1, x2, y2) {
    var a = x1 - x2;
    var b = y1 - y2;
    return Math.sqrt( a*a + b*b );
}

class Car {
    constructor (w, h, routeWalls, brain) {
        this.w = w;
        this.h = h;
        this.dir = {x: 0, y: 1};
        this.drift = 20;
        this.deadAt = 400;
        this.checkpoints = [];
        this.senseWalls = [];
        this.senseDists = [];
        this.senseDots = [];
        this.visionLen = 400;
        if (brain) this.brain = brain;
        this.route = routeWalls;
        this.start();
        this.actualizeWalls();
    }

    start() {
        this.x = 158;
        this.y = 239;
        this.rotation = -1.56;
        this.dir = {x: 1, y: 0};
        this.v = 0;
    }
    
    actualizeRouteWalls() {
        this.senseWalls = new Array(8);
        let x1 = this.x;
        let y1 = this.y;
        let pi4 = Math.PI/4;

        for (let i = 0; i < 8; ++i) {
            let angle = this.rotation + i * pi4;
            let x2 = x1 + this.visionLen * Math.cos(angle);
            let y2 = y1 + this.visionLen * Math.sin(angle);
            this.senseWalls[i] = new Wall(x1, y1, x2, y2);
        }

        // Calculem punts d'intersecció dels sentits
        for (let i = 0; i < 8; ++i) {
            let minDot = undefined;
            let minDist = Infinity;
            for (let j = 0; j < this.route.length; ++j) {
                let collision = this.senseWalls[i].intersection(this.route[j]);
                if (collision) {
                    let distance = dist(collision.x, collision.y, this.x, this.y); 
                    if (distance < minDist) {
                        minDist = distance;
                        minDot = collision;
                    }
                }
            }
            this.senseDots[i] = minDot;
            // Depurem errors i Infinities
            if (minDist == undefined || minDist > this.visionLen) minDist = this.visionLen; 
            this.senseDists[i] = minDist / this.visionLen;
        }
    }

    actualizeWalls() {
        this.actualizeRouteWalls();

        // Actualització parets que formen el cotxe
        let x1 = (this.x - this.w/2);
        let x4 = x1;
        let x2 = (this.x + this.w/2);
        let x3 = x2;
        
        let y1 = (this.y - this.h/2 + this.drift);
        let y2 = y1;
        let y3 = (this.y + this.h/2 + this.drift);
        let y4 = y3;

        let r = dist(x1, y1, this.x, this.y);
        x1 = this.x - r * Math.cos(this.rotation);
        y1 = this.y - r * Math.sin(this.rotation);
        x2 = this.x + r * Math.cos(this.rotation);
        y2 = this.y + r * Math.sin(this.rotation);
        
        let angle = Math.atan(this.h/(this.w/2));
        
        r = dist(x3, y3, this.x, this.y);
        x3 = this.x + r * Math.cos(this.rotation + angle);
        y3 = this.y + r * Math.sin(this.rotation + angle);
        x4 = this.x - r * Math.cos(this.rotation - angle);
        y4 = this.y - r * Math.sin(this.rotation - angle);
        
        this.walls = [
            new Wall(x1, y1, x2, y2), new Wall(x2, y2, x3, y3), 
            new Wall(x3, y3, x4, y4), new Wall(x4, y4, x1, y1)
        ];
    }

    showSense() {
        for (let i = 0; i < this.senseWalls.length; ++i) {
            this.senseWalls[i].show("black", 1);
        }
        let d = new drawTool("myCanvas");
        for (let i = 0; i < this.senseDots.length; ++i) {
            let dot = this.senseDots[i];
            if (dot) d.circle(dot.x, dot.y, 5, {color: "blue"});
        }
        
    }

    show(color) {
        d.translate(this.x, this.y);
        d.rotate(this.rotation);
        
        // Cotxe
        d.rectangle(0, + this.drift, this.w, this.h, {color: color, alpha: 0.7});
        
        // --------------------------- Posible decorations ---------------------------
        // Llums
        // d.rectangle(0, drift - this.h/2, this.w, 5, {color: "yellow"});
        // Rodes
        // d.rectangle(-this.w/2 - 3, drift - this.h/2 + 6, 6, 8, {color: "black"});
        // d.rectangle(-this.w/2 - 3, drift + this.h/2 - 6, 6, 8, {color: "black"});
        // d.rectangle(this.w/2 + 3, drift - this.h/2 + 6, 6, 8, {color: "black"});
        // d.rectangle(this.w/2 + 3, drift + this.h/2 - 6, 6, 8, {color: "black"});
        // --------------------------- Posible decorations ---------------------------

        d.rotate(-this.rotation);
        d.translate(-this.x, -this.y);
    }

    move() {
        this.x += this.dir.x * this.v;
        this.y += this.dir.y * this.v;
        this.checkVel();
        this.actualizeWalls();
    }

    think() {
        var vel = 1;
        var rot = 0.13;
        var th = 0.8;

        let res = this.brain.out(this.senseDists)
        if (res[0] > th) this.forward(vel);
        if (res[1] > th) this.back(vel);
        if (res[2] > th) this.left(rot);
        if (res[3] > th) this.right(rot);
    }

    action(a) {
        var vel = 1;
        var rot = 0.13;
        
        if (a == 0) this.forward(vel);
        else if (a == 1) this.back(vel);
        else if (a == 2) this.left(rot);
        else if (a == 3) this.right(rot);
        else if (a == 4) {
            // Nothing
        }
    }

    checkVel() {
        var a = 0.5;
        if (this.v > 0) {
            if (this.v >= a) this.v = this.v - a;
            if (this.v < a) this.v = 0; 
        }
        else if (this.v < 0) {
            if (this.v <= -a) this.v = this.v + a;
            if (this.v > -a) this.v = 0; 
        }
    }

    collides(w) {
        for (let i = 0; i < 4; ++i) {
            var aux = this.walls[i]; 
            let P = aux.intersection(w);
            if (P != undefined) {
                return true;
            }
        }
        return false;
    }

    forward(vel) {
        this.v -= vel;
    }

    back(vel) {
        this.v += vel;
    }

    left(rot) {
        const halfPI = Math.PI/2;
        this.rotation -= rot;
        this.dir.x = Math.cos(halfPI + this.rotation);
        this.dir.y = Math.sin(halfPI + this.rotation);
    }

    right(rot) {
        const halfPI = Math.PI/2;
        this.rotation += rot;
        this.dir.x = Math.cos(halfPI + this.rotation);
        this.dir.y = Math.sin(halfPI + this.rotation);
    }

    fitness() {
        let c = this.checkpoints;
        if (c[0] == undefined || c[0][0] != 0) return 0;
        let fitness = 0;

        for (let i = 0; i < c.length; ++i) {
            let wall = c[i];
            let t = wall[1];
            fitness += ((wall[0] + 1)*10)/(t);
        }
        return fitness;
    }

    //TODO: veure si s'ha de borrar
    sex(partner) {
        let dnaX = this.dna; 
        let dnaY = partner.dna; 
        let childDNA = dnaX.crossover(dnaY);
        return new Car(this.h, this.w, childDNA);
    }

    print() {
        let gens = this.dna.gens;
        let s = "[";
        for (let i = 0; i < gens.length; ++i) {
            s += gens[i] + ',';
        }
        s += ']';
        console.log(s);
    }

    copy() {
        return new Car(this.w, this.h, this.dna.copy());
    }

    mutate(r) {
        for (let i = 0; i < this.dna.gens.length; ++i) {
            if (Math.random() < r) {
                this.dna.gens[i] = Math.floor(Math.random()*4);
            }
        }
    }
}
