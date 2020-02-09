class Connection {
    constructor (n1, n2, w, enable=true) {
        Connection.numInstances = (Connection.numInstances || 0) + 1;
        this.n = Connection.numInstances - 1;
        this.inp = n1;
        this.out = n2;
        n1.weights.push(w);
        n2.inputs.push(n1);
        this.w = w;
        this.enable = enable;
    }
}

class Neat {
    constructor(nInputs, nOutputs) {
        this.inputs = Array.from({length: nInputs}, () => new Neuron("input"));
        this.outputs = Array.from({length: nOutputs}, () => new Neuron("output"));
        this.hidden = [];
        // Començo amb una conexió random
        let n1 = this.inputs[Math.floor(Math.random()*nInputs)];
        let n2 = this.outputs[Math.floor(Math.random()*nOutputs)];
        this.connections = [new Connection(n1, n2, Math.random())];
    }

    out(values) {
        for (let i in this.inputs) {
            this.inputs[i].inputs = values[i]; 
        }
        let returnValues = new Array(this.outputs.length);
        for (let i in this.outputs) {
            returnValues[i] = this.outputs[i].out(); 
        }
        return returnValues;
    }

    getNeuron(n) {
        for (let neuron of this.inputs) {
            if (neuron.n = n) return neuron;
        }
        for (let neuron of this.outputs) {
            if (neuron.n = n) return neuron;
        }
        for (let neuron of this.hidden) {
            if (neuron.n = n) return neuron;
        }
    }

    addConnection(n1, n2, w) {
        let neuron1 = this.getNeuron(n1);
        let neuron2 = this.getNeuron(n2);
        let weight = Math.random();
        if (w) weight = w;
        this.connections.push(new Connection(neuron1, neuron1, weight));
    }

    addNeuron(connection) {
        connection.enable = false;
        let newNeuron = new Neuron("hidden", [connection.inp], [1]);
        this.hidden.push(newNeuron);
        connection.out.rmInp(connection.inp.n);
        connection.out.inputs.push(newNeuron);
    }
}

var xor = new Neat(2, 1);
xor.addNeuron(xor.connections[0]);

console.log(xor.out([1, 0]));