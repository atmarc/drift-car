class NN {
    constructor(nInp, nOut, nNeuron, connections) { // connections = [[1,2 ,w], [3, 4, w]]
        this.neurons = [];
        this.n = nInp + nOut;
        this.nInp = nInp;
        this.nOut = nOut;
        this.netValues = new Array(nNeuron);

        for (let i = 0; i < nInp; ++i) {
            this.neurons.push(new Neuron([],[], "input"));
        }
        
        for (let i = 0; i < nOut; ++i) {
            this.neurons.push(new Neuron([],[], "output"));
        }

        if (nNeuron) {
            this.n = nNeuron;
            for (let i = nInp + nOut; i < nNeuron; ++i) {
                this.neurons.push(new Neuron([],[], "hidden"));
            }
        }

        if (connections) {
            this.connections = connections;
            for (let x = 0; x < connections.length; ++x) {
                let conn = connections[x];
                let n1 = this.neurons[conn[0]];
                let n2 = this.neurons[conn[1]];
                n1.outputs.push(conn[1]);
                n1.wOutputs.push(conn[2]);
                n2.inputs.push(conn[0]);
                n2.wInputs.push(conn[2]);
            }
        }
    }
    
    connectionExists(n1, n2) {
        for (let i = 0; i < this.neurons[n1].outputs; ++i) {
            if (this.neurons[n1].outputs == n2) return true;
        }

        for (let i = 0; i < this.neurons[n2].inputs; ++i) {
            if (this.neurons[n2].inputs == n1) return true;
        }

        return false;
    }

    // TODO: comprobar cicles aquí
    addConnection(n1, n2) {
        if (n1 >= this.n || n1 < 0 || n2 >= this.n || n2 < 0) {
            console.log("Wrong neuron ids");
            return;
        }
        
        if (this.connectionExists(n1, n2)) {
            console.log("This connection already exists");
            return;
        }

        this.neurons[n1].outputs.push(n2);
        this.neurons[n2].inputs.push(n1);
        this.connections.push([n1, n2]);
    }
    
    out(inpValues) {

        var sigmoid = (x) => {
            return 1 / (1 + Math.exp(-x));
        }
        
        var getValue = (neuron) => {
            if (neuron.type == "input") return neuron.value;
            let sum = 0;
            for (let i = 0; i < neuron.inputs.length; ++i) {
                let iSuma = neuron.inputs[i];
                if (this.netValues[iSuma]) {
                    sum += this.netValues[iSuma];  
                }
                else {
                    let v = getValue(this.neurons[iSuma]);
                    this.netValues[iSuma] = v;
                    sum += v * neuron.wInputs[i];
                }
            }

            return sigmoid(sum + neuron.bias);
        } 

        if (!inpValues || inpValues.length != this.nInp) {
            console.log("Wrong number of input values");
            return;
        }

        for (let i = 0; i < this.nInp; ++i) {
            this.neurons[i].value = inpValues[i];
        } 

        let retValues = [];
        for (let i = this.nInp; i < this.nInp + this.nOut; ++i) {
            retValues.push(getValue(this.neurons[i]));
        }
        return retValues;
    }
}

class Neuron {
    constructor (inputs, outputs, type) {
        this.inputs = inputs;
        this.outputs = outputs;
        this.bias = 1;
        this.type = type;
        this.value = -1;
        
        this.wInputs = [];
        this.wOutputs = [];
    }
}

// input: 0, 1
// output: 2
// hidden: 3
var nn = new NN(2, 1, 3, [[0, 2, 0.5], [1, 2, 0.5]]);
console.log(nn.out([0.5, 0.5]));