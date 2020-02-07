function dist(x1, y1, x2, y2) {
    var a = x1 - x2;
    var b = y1 - y2;
    return Math.sqrt( a*a + b*b );
}

class Car {
    constructor (xPos, yPos, w, h) {
        this.x = xPos;
        this.y = yPos;
        this.w = w;
        this.h = h;
        this.v = 0;
        this.dir = {x: 0, y: 1};
        this.rotation = 0;
        this.drift = 20;
        this.actualizeWalls();
        this.start();
    }

    start() {
        this.x = 158;
        this.y = 239;
        this.rotation = -1.56;
        this.dir = {x: 1, y: 0};
    }

    actualizeWalls() {
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

    show(color) {
        d.translate(this.x, this.y);
        d.rotate(this.rotation);
        
        // Cotxe
        d.rectangle(0, + this.drift, this.w, this.h, {color: color});
        
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
        this.actualizeWalls();
    }

    checkVel() {
        var a = 0.5;
        if (car.v > 0) {
            if (car.v >= a) car.v = car.v - a;
            if (car.v < a) car.v = 0; 
        }
        else if (car.v < 0) {
            if (car.v <= -a) car.v = car.v + a;
            if (car.v > -a) car.v = 0; 
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
        car.rotation += rot;
        car.dir.x = Math.cos(halfPI + car.rotation);
        car.dir.y = Math.sin(halfPI + car.rotation);
    }
}
