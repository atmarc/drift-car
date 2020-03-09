class Neat {
    constructor(nInputs, nOutputs, clients) {
        this.clients = clients
        this.nInputs = nInputs
        this.nOutputs = nOutputs
        this.bias = 1
        this.neurons = []
        this.connections = []
        this.nNeurons = 0
        this.nConnections = 0

        for (let i = 0; i < nInputs; ++i) {
            this.neurons.push({innov: this.nNeurons, type: "input"})
            this.nNeurons++;
        }
        for (let i = 0; i < nOutputs; ++i) {
            this.neurons.push({innov: this.nNeurons, type: "output"})
            this.nNeurons++;
        }
        
        this.genoms = new Array(this.clients);
        for (let i = 0; i < this.clients; ++i) {
            this.genoms[i] = this.newGenom();
        }

    }

    connectionExists(n1, n2) {
        for (let i = 0; i < this.connections.length; ++i) {
            let c = this.connections[i];
            if (c.in == n1 && c.out == n2) {
                return {innov: c.innov, in: n1, out: n2, w: c.w, enabled: true}
            }
        }
        return false;
    } 

    neuronExists(innov) {
        for (let i = 0; i < this.neurons.length; ++i) {
            let c = this.neurons[i];
            if (c.innov == innov) {
                return {innov: c.innov, type: c.type}
            }
        }
        return false;
    }

    isCyclicRec(genom, v, visited, stack) {
        if(!visited[v]) {
            visited[v] = true;
            stack[v] = true;
            for (let i = 0; i < genom.connections.length; ++i) {
                // Recorrem tots els adjacents a v
                let c = genom.connections[i];
                if (c.out == v) {
                    if (!visited[c.in] && this.isCyclicRec(genom, c.in, visited, stack)) {
                        return true;
                    }
                    else if (stack[c.in])
                        return true;
                }
            }
        }
        stack[v] = false;
        return false;
    }

    isCyclic(genom, n1, n2) {
        var visited = new Array(genom.neurons.length);
        var stack = new Array(genom.neurons.length);
        visited.fill(false);
        stack.fill(false);
        genom.connections.push({
            innov: this.nConnections + 1, in: n1, out: n2, w: 0, enabled: true
        });


        for (let i = 0; i < genom.neurons.length; i++) {
            if (this.isCyclicRec(genom, i, visited, stack)) {
                genom.connections.pop();
                return true;
            }
        }

        genom.connections.pop();
        return false; 
    }
    
    // Comprova
    randomConnection(genom) {
        let numNeurons = genom.neurons.length;
        let n1 = Math.floor(Math.random()*numNeurons);
        let n2 = Math.floor(Math.random()*numNeurons);
        let malament = true;
        while(malament) {
            if (genom.neurons[n1].type == "output") {
                n1 = Math.floor(Math.random()*numNeurons);
            }
            else if (genom.neurons[n2].type == "input") {
                n2 = Math.floor(Math.random()*numNeurons);
            }
            else if (n1 == n2) {
                n2 = Math.floor(Math.random()*numNeurons);
            }
            else if (genom.connectionExists(n2, n1) || genom.connectionExists(n1, n2)) {
                n2 = Math.floor(Math.random()*numNeurons);
                n1 = Math.floor(Math.random()*numNeurons);
            }
            else if (this.isCyclic(genom, n1, n2)) {
                n1 = Math.floor(Math.random()*numNeurons);
                n2 = Math.floor(Math.random()*numNeurons);
            }
            else malament = false;
        }

        let weight = Math.random();
        // Si ja existeix la conexió, la tornem
        let c = this.connectionExists(n1, n2);
        if (c != false) {
            return c
        }
        // Sino la tornem a crear
        let index = this.nConnections; 
        this.nConnections++;
        this.connections.push({
            innov: index, in: n1, out: n2, w: weight, enabled: true
        });
        return {innov: index, in: n1, out: n2, w: weight, enabled: true}
    }

    addConnection(n1, n2, w) {

        let c = this.connectionExists(n1, n2);
        if (c != false) {
            c.w = w;
            return c;
        }

        let index = this.nConnections; 
        this.nConnections++;

        this.connections.push({
            innov: index, in: n1, out: n2, w: w, enabled: true
        });
        return {innov: index, in: n1, out: n2, w: w, enabled: true}
    }

    addNeuron(innov) {
        let n = this.neuronExists(innov);
        if (n != false) {
            return n;
        }
        
        let index = this.nNeurons; 
        this.nNeurons++;
        this.neurons.push({innov: index, type: "hidden"});
        return {innov: index, type: "hidden"};
    }

    newGenom() {
        let newNeurons = [];
        for (let i = 0; i < this.neurons.length; ++i) {
            let newN = this.neurons[i];
            newNeurons.push({innov: newN.innov, type: newN.type})
        }
        return new Genom(this, newNeurons, this.nInputs, this.nOutputs);
    }
}