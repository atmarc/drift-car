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

    randomConnection() {
        let n1 = Math.floor(Math.random()*this.nInputs);
        let n2 = this.nInputs + Math.floor(Math.random()*this.nOutputs);
        let weight = Math.random();
        // Si ja existeix la conexió, canvia-la
        let stop = 100;
        while (this.connectionExists(n1, n2) && stop > 0) {
            n1 = Math.floor(Math.random()*this.nInputs);
            n2 = this.nInputs + Math.floor(Math.random()*this.nOutputs);
            --stop;
        }

        let index = this.nConnections; 
        this.nConnections++;
        this.connections.push({
            innov: index, in: n1, out: n2, w: weight, enabled: true
        });
        return {innov: index, in: n1, out: n2, w: weight, enabled: true}
    }

    addConnection(n1, n2, w) {

        let c = this.connectionExists(n2, n2);
        if (c) {
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
        if (n) {
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