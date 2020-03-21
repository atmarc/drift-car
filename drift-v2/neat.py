from genom import Genom, Neuron, Connection
from species import Species
import random
import math

class Neat():
    def __init__(self, n_inp, n_out, clients, population):
        self.clients = clients
        self.population = population
        self.n_inputs = n_inp
        self.n_outputs = n_out
        self.bias = 1
        self.neurons = []
        self.connections = []
        self.n_neurons = 0
        self.n_connections = 0
        self.genoms = []
        self.species = []

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

    def reproduction(self, fitness_array):

        def check_species(g):
            for s in self.species:
                if s.check_if_member(g):
                    return True
            return False

        for i, g in enumerate(self.genoms):
            g.fitness = fitness_array[i]
            if not check_species(g):
                self.species.append(Species(g))

        n_extint = 0
        new_species = []
        for s in self.species:
            s.sort()
            extinct = s.kill()
            if extinct: 
                n_extint += 1
            else: 
                new_species.append(s.reproduce())

        self.species = new_species

        n_extra = self.clients - len(self.genoms)
        for i in range(n_extra):
            random.choice(self.genoms).reproduce_extra()

