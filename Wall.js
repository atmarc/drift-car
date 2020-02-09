    class Wall {
    constructor (x1, y1, x2, y2) {
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
    }

    contained(dot) {
        if (this.x1 == this.x2 && dot.x != this.x1)
            return false;
        if (this.y1 == this.y2 && dot.y != this.y1) 
            return false;
    
        if (this.x1 > this.x2) {
            if (dot.x > this.x1) return false;
            if (dot.x < this.x2) return false;
        }
        else {
            if (dot.x > this.x2) return false;
            if (dot.x < this.x1) return false;
        }
        if (this.y1 > this.y2) {
            if (dot.y > this.y1) return false;
            if (dot.y < this.y2) return false;
        }
        else {
            if (dot.y > this.y2) return false;
            if (dot.y < this.y1) return false;
        }
        return true;
    }

    intersection(w) {
        let x3 = w.x1;
        let y3 = w.y1;
        let x4 = w.x2;
        let y4 = w.y2;
        let x1 = this.x1;
        let x2 = this.x2;
        let y1 = this.y1;
        let y2 = this.y2;


        let den = (x1 - x2)*(y3 - y4) - (y1 - y2)*(x3 - x4);
        if (den == 0) return undefined;

        let t = ((x1 - x3)*(y3 - y4) - (y1 - y3)*(x3 - x4)) / den;
        let u = ((x1 - x2)*(y1 - y3) - (y1 - y2)*(x1 - x3)) / den;
        
        let dot = {
            x: x1 + t*(x2 - x1),
            y: y1 + t*(y2 - y1)
        }
        if (this.contained(dot) && w.contained(dot)) return dot;
        else return undefined;
    }

    show(color) {
        let c = "black";
        if (color) c = color;
        var d = new drawTool("myCanvas");
        d.line(this.x1, this.y1, this.x2, this.y2, {width:5, color: c});
    }
}