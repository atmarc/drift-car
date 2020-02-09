
let sigmoid = (x) => {
    return 1 / (1 + Math.exp(-x));
}

let tanh = (x) => {
    return Math.tanh(x);
}  

class Neuron {
    constructor(type, inputs=[], weights, activation=sigmoid) {
        Neuron.numInstances = (Neuron.numInstances || 0) + 1;
        this.n = Neuron.numInstances - 1;
        this.type = type;
        this.activation = activation;
        this.inputs = inputs;
        // this.outputs = outputs;
        if (weights) this.weights = weights;
        else this.weights = Array.from({length: this.inputs.length}, () => Math.random());
        this.bias = 1;
    }

    out() {
        if (this.type == "input") {
            return this.inputs;
        }
        
        let sum = this.bias;
        for (let i = 0; i < this.inputs; ++i) {
            sum += this.inputs[i].out() * this.weights[i];
        }
        return this.activation(sum);
    }

    rmInp(elem) {
        for (let i in this.inputs) {
            if (this.inputs[i].n == elem) {
                this.inputs.slice(i,i);
                break;
            } 
        }
    }

}