import math
from random import random

class Neuron():
    def __init__(self, innov, t):
        self.innov = innov
        self.type = t
        self.value = -1
    
    def __bool__ (self): return True

    def copy(self):
        return Neuron(self.innov, self.type)

    def __repr__(self):
        return f'(neuron: {self.innov}, {self.type})'

    def __eq__(self, obj):
        if self.innov != obj.innov: return False
        if self.type != obj.type: return False
        return True

class Connection():
    def __init__(self, innov, inp, out, w, enabled=True):
        self.innov = innov
        self.inp = inp
        self.out = out
        self.w = w
        self.enabled = enabled

    def __bool__ (self): return True

    def copy(self):
        return Connection(self.innov, self.inp, self.out, self.w, enabled=self.enabled)

    def __repr__(self):
        return f'(connection: {self.innov}, ({self.inp} --> {self.out}), w:{self.w}, {self.enabled})'

    def __eq__(self, obj):
        if self.innov != obj.innov: return False
        if self.inp != obj.inp: return False
        if self.out != obj.out: return False
        return True

class Genom():
    def __init__(self, neat, neurons, n_inputs, n_outputs):
        self.bias = 1
        self.neurons = neurons
        self.connections = []
        self.neat = neat
        self.n_inputs = n_inputs
        self.n_outputs = n_outputs
        self.out_values = {}
        # self.random_connections(10)

    def random_connections(self, n):
        for i in range(n):
            self.random_connection()

    def get_neuron(self, n_innov):
        for n in self.neurons:
            if n.innov == n_innov:
                return n
        return False
    
    def get_connection(self, c_innov):
        for c in self.connections:
            if c.innov == c_innov:
                return c
        return False

    def out(self, values):

        sigmoid = lambda x: 1 / (1 + math.exp(-x))

        def rec_out(n_innov):
            current_neuron = self.get_neuron(n_innov)
            if current_neuron.type == "input":
                self.out_values[n_innov] = current_neuron.value
                return current_neuron.value
            
            sum = 0
            for c in self.connections:
                if c.out == n_innov and c.enabled:
                    # DP per fer-ho eficient
                    if c.inp in self.out_values.keys():
                        sum += self.out_values[c.inp] * c.w
                    
                    else:
                        sum += rec_out(c.inp) * c.w

            output_value = sigmoid(sum + self.bias)
            self.out_values[n_innov] = output_value
            return output_value

        self.out_values = {}
        if len(values) != self.n_inputs:
            print('The input is not of the proper size')
            return
        
        for i in range(len(values)):
            self.neurons[i].value = values[i]
        
        ret_values = []
        for n in self.neurons:
            if n.type == "output":
                ret_values.append(rec_out(n.innov))
        
        return ret_values

    def valid_connection(self, n1, n2):
        if self.neurons[n1].type == "output":
            return False
        elif self.neurons[n2].type == "input":
            return False
        elif n1 == n2:
            return False
        elif self.connection_exists(n2, n1):
            return False
        elif self.is_cyclic(n1, n2):
            return False
        else:
            return True

    def connection_exists(self, n1, n2):
        for c in self.connections:
            if c.inp == n1 and c.out == n2:
                return c

        return False

    def add_connection(self, n1, n2, w):
        c = self.neat.add_connection(n1, n2, w)
        self.connections.append(c)
        return c

    def add_neuron(self):
        n = self.neat.add_neuron(self.neurons)
        self.neurons.append(n)
        return n

    def add_neuron(c_innov):
        new_neuron = self.neat.add_neuron(len(self.neurons))
        self.neurons.append(new_neuron)
        c = self.get_connection(c_innov)
        if not c: print("The connection with id " + str(c_innov) + " does not exist.")
        
        if self.valid_connection(c.inp, new_neuron.innov) and
            self.valid_connection(new_neuron.innov, c.out):
            # split i tal

        else: self.neurons.pop()

    def is_cyclic(self, n1, n2):
        
        def rec_is_cyclic(v, visited, stack):
            if not visited[v]:
                visited[v] = True
                stack[v] = True
                
                for c in self.connections:
                    if c.out == v:
                        if not visited[c.inp] and rec_is_cyclic(c.inp, visited, stack):
                            return True
                        elif stack[c.inp]: return True
            
            stack[v] = False
            return False 

        visited = [False] * len(self.neurons)
        stack = [False] * len(self.neurons)

        self.connections.append(Connection(-1, n1, n2, 1))
        for i in range(len(self.neurons)):
            if rec_is_cyclic(i, visited, stack):
                self.connections.pop()
                return True

        self.connections.pop()
        return False        
        
    def random_connection(self):
        n_neurons = len(self.neurons)
        tries = 30
        i = 0
        while i < tries:
            i += 1
            n1 = math.floor(random() * n_neurons)
            n2 = math.floor(random() * n_neurons)
            
            exists = self.connection_exists(n1, n2)
            
            if exists: 
                exists.enabled = not exists.enabled
                return False

            elif not self.valid_connection(n1, n2):
                continue
            
            else:
                self.add_connection(n1, n2, random())
                return True
        return None

    def change_weights_random(self):
        weight = random()*1.5
        for c in self.connections:
            c.w = min(c.w * weight, 1)

    def random_neuron(self):
        index = random()*len(self.connections)
        c_old = self.connections[index]
        c_old.enabled = False

        new_n = self.add_neuron()
        self.add_connection(c_old.inp, new_n.innov, random())
        self.add_connection(new_n.innov, c_old.out, random())

    def mutate(self, m):
        if random() < m:
            self.random_connection()
        if random() < m:
            self.random_neuron()
        if random() < m:
            self.change_weights_random()

    def crossover(self, other):
        # best = other_fit < this_fit

        new_neurons = [n.copy() for n in self.neurons]
        new_neurons += [n.copy() for n in other.neurons if n not in new_neurons]

        new_connections = [c.copy() for c in self.connections]
        new_connections += [c.copy() for c in other.connections if c not in new_connections]

        new_brain = Genom(self.neat, new_neurons, self.n_inputs, self.n_outputs)
        new_brain.connections = new_connections

        return new_brain

        
