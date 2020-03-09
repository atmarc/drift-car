from genom import Genom, Neuron, Connection

class Neat():
    def __init__(self, n_inp, n_out, clients):
        self.clients = clients
        self.n_inputs = n_inp
        self.n_outputs = n_out
        self.bias = 1
        self.neurons = []
        self.connections = []
        self.n_neurons = 0
        self.n_connections = 0
        self.genoms = []

        for i in range(n_inp):
            self.neurons.append(Neuron(self.n_neurons, "input"))
            self.n_neurons += 1
        
        for i in range(n_out):
            self.neurons.append(Neuron(self.n_neurons, "output"))
            self.n_neurons += 1
        
        for i in range(clients):
            new_neurons = [n.copy() for n in self.neurons]
            self.genoms.append(Genom(self, new_neurons, self.n_inputs, self.n_outputs))

    def connection_exists(self, n1, n2):
        for c in self.connections:
            if c.inp == n1 and c.out == n2:
                return c.copy()
        return False

    def neuron_exists(self, n_innov):
        for n in self.neurons:
            if n.innov == n_innov:
                return n.copy()
        return False

    def add_neuron(self, innov):
        n = self.neuron_exists(innov)
        if n: return n
        index = self.n_neurons
        self.n_neurons += 1
        self.neurons.append(Neuron(index, "hidden"))
        return Neuron(index, "hidden")
    
    def add_connection(self, n1, n2, w):
        c = self.connection_exists(n1, n2)
        if c:
            c.w = w
            return c

        index = self.n_connections
        self.n_connections += 1
        self.connections.append(Connection(index, n1, n2, w))
        return Connection(index, n1, n2, w)
