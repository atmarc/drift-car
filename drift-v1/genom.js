var sigmoid = (x) => {
    return 1 / (1 + Math.exp(-x));
}

var tanh = (x) => {
    let e1 = Math.exp(x);
    let e2 = Math.exp(-x);
    return (e1 - e2) / (e1 + e2);
}

class Genom {
    constructor(neat, neurons, nInputs, nOutputs) {
        this.bias = 1
        this.neurons = neurons;
        this.connections = [];
        this.neat = neat;
        this.nInputs = nInputs;
        this.nOutputs = nOutputs;
        this.outValues = {};
        this.nRandomConnections(10);
    }

    nRandomConnections(n) {
        for (let i = 0; i < n; ++i) {
            this.connections.push(this.neat.randomConnection(this));
        }
    }

    getNeuron(innov) {
        for (let i = 0; i < this.neurons.length; ++i) {
            if (this.neurons[i].innov == innov) return this.neurons[i];
        }
    }

    recOut(neuron) {
        if (this.getNeuron(neuron).type == "input") {
            this.outValues[neuron] = this.neurons[neuron].value;
            return this.neurons[neuron].value;
        }
        let sum = 0;
        for (let i in this.connections) {
            let c = this.connections[i];
            if (c.out == neuron && c.enabled) {
                // DP per fer-ho eficient
                if (this.outValues[c.in] != undefined) {
                    sum += this.outValues[c.in] * c.w;
                }
                else {
                    sum += this.recOut(c.in) * c.w;
                } 
            }
        }

        let outputValue = sigmoid(sum + this.bias); 
        this.outValues[neuron] = outputValue;
        return outputValue;
    }
    
    out(values) {
        this.outValues = {} 
        if (!values || this.nInputs != values.length) {
            console.log("There have to be " + this.nInputs + " values, one for each input node.");
            return;
        }

        for (let i = 0; i < values.length; ++i) {
            // Se que les primeres neurones son els inputs
            this.neurons[i].value = values[i]; 
        }

        let returnValues = [];
        for (let i = 0; i < this.neurons.length; ++i) {
            if (this.neurons[i].type == "output") {
                returnValues.push(this.recOut(this.neurons[i].innov)); 
            }
        }
        return returnValues;
    }

    connectionExists(n1, n2) {
        for (let i = 0; i < this.connections.length; ++i) {
            let c = this.connections[i];
            if (c.in == n1 && c.out == n2) return c;
        }
        return false;
    }

    addConnection(n1, n2, w) {
        let c = this.neat.addConnection(n1, n2, w);
        this.connections.push(c);
    }

    addRandomConnection() {
        let c = this.neat.randomConnection(this);
        let exist = this.connectionExists(c.in, c.out);
        if (exist != false) {
            exist.enabled = !exist.enabled;
        } else {
            this.connections.push(c);
        }
    }

    addNeuron(connectionInnov) {
        // Creem la nova neurona
        let newNeuron = this.neat.addNeuron(this.neurons.length);
        this.neurons.push(newNeuron);
 
        let c = undefined;
        for (let i = 0; i < this.connections.length; ++i) {
            if (connectionInnov == this.connections[i].innov) {
                c = this.connections[i];
            }
        }

        if (!c) {
            console.log("The connection with innov: " + connectionInnov + " does not exist.");
            return;
        }
        
        if (!this.neat.isCyclic(this, c.in, newNeuron.innov)) {
            c.enabled = false;
            this.addConnection(c.in, newNeuron.innov, 1);
            if (!this.neat.isCyclic(this, newNeuron.innov, c.out)) {
                this.addConnection(newNeuron.innov, c.out, c.w);
            }
            else {
                this.connections.pop();
                c.enabled = true;
            } 
        }
    }
    
    changeRandomWeight() {
        let i = Math.floor(Math.random()*this.connections.length);
        this.connections[i].w = Math.random();
    }

    addRandomNeuron() {
        let i = Math.floor(Math.random()*this.connections.length);
        this.addNeuron(this.connections[i].innov);
    }

    copy(other) {
        this.neurons = []
        this.connections = []
        for (let i = 0; i < other.neurons.length; ++i) {
            let n = other.neurons[i];
            this.neurons.push({innov: n.innov, type: n.type});
        }
        for (let i = 0; i < other.connections.length; ++i) {
            let c = other.connections[i];
            this.connections.push({
                innov: c.innov, in: c.in, out: c.out, w: c.w, enabled: c.enabled
            });
        }
    }

    mutate() {
        if (Math.random() < 0.20) {
            this.addRandomConnection();
        }
        if (Math.random() < 0.20) {
            this.addRandomNeuron();
        }
        if (Math.random() < 0.20) {
            this.changeRandomWeight();
        }
    }

    getAdjacents(neuron) {
        let llista = []
        for (let i = 0; i < this.connections.length; ++i) {
            let c = this.connections[i];
            if (c.in == neuron) {
                llista.push(c.out);
            }
        }
        return llista;
    }

    crossover(other, best) {
        let newNeurons = new Array(this.neurons.length);
        for (let i = 0; i < this.neurons.length; ++i) {
            newNeurons[i] = this.neat.addNeuron(this.neurons[i].innov);
        }
        for (let i = 0; i < other.neurons.length; ++i) {
            let trobat = false;
            for (let j = 0; j < newNeurons.length; ++j) {
                if (newNeurons[j].innov == other.neurons[i].innov)
                    trobat = true;
            }
            if (!trobat)
                newNeurons.push(this.neat.addNeuron(other.neurons[i].innov));
        }

        let newConnections = new Array(this.connections.length);
        for (let i = 0; i < this.connections.length; ++i) {
            let c = this.connections[i];
            newConnections[i] = this.neat.connectionExists(c.in, c.out);
        }

        for (let i = 0; i < other.connections.length; ++i) {
            let c = other.connections[i];
            let afegir = true;
            for (let j = 0; j < newConnections.length; ++j) {
                if (newConnections[j].innov == c.innov) {
                    afegir = false;
                    if (newConnections[j].enabled != c.enabled) {
                        if (best) newConnections[j].enabled = c.enabled;
                    }
                }
            }
            if (afegir) {
                let aux = this.neat.connectionExists(c.in, c.out);
                aux.enabled = c.enabled;
                newConnections.push(aux);
            }
        }
        return {n: newNeurons, c: newConnections}
    }

    print() {
        actualitzaDibuix();
    }
}