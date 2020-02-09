var sigmoid = (x) => {
    return 1 / (1 + Math.exp(-x));
}

class Genom {
    constructor(neat, neurons, nInputs, nOutputs) {
        this.bias = 1
        this.neurons = neurons;
        this.connections = [];
        this.neat = neat;
        this.nInputs = nInputs;
        this.nOutputs = nOutputs;

        this.connections.push(neat.randomConnection());
    }

    recOut(neuron) {
        if (this.neurons[neuron].type == "input") {
            return this.neurons[neuron].value;
        }
        let sum = 0;
        for (let i in this.connections) {
            let c = this.connections[i];
            if (c.out == neuron && c.enabled) {
                sum += this.recOut(c.in) * c.w;
            }
        }
        // if (this.neurons[neuron].type == "output") return sum;
        return sigmoid(sum + this.bias);
    }
    
    out(values) {
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
                returnValues.push(this.recOut(i)); 
            }
        }
        return returnValues;
    }

    addConnection(n1, n2, w) {
        let c = this.neat.addConnection(n1, n2, w);
        this.connections.push(c);
    }

    addRandomConnection() {
        let c = this.neat.randomConnection();
        this.connections.push(c);
    }

    addNeuron(connectionInnov) {
        // Creem la nova neurona
        let newNeuron = this.neat.addNeuron(this.neurons);
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
        this.connections[c.innov].enabled = false;
        this.addConnection(c.in, newNeuron.innov, 1);
        this.addConnection(newNeuron.innov, c.out, c.w);
    }

}