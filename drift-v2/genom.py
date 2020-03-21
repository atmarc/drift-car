import math
from random import random
from functools import lru_cache

class Neuron():
    def __init__(self, innov, t):
        self.innov = innov
        self.type = t
        self.value = -1
    
    def __bool__ (self): return True

    def copy(self):
        return Neuron(self.innov, self.type)

    def __repr__(self):
        return f'({self.innov}, {self.type})'

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
        return f'(i:{self.innov},{self.inp},{self.out},{self.enabled})'

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
        self.random_connections()
        self.fitness = -1

    def random_connections(self):
        # Full conex
        # ---------------------------------------------------------------------------------------
        # for i in range(self.n_inputs):
        #     for j in range(self.n_outputs):
        #         if i != self.n_inputs + j: self.add_connection(i, self.n_inputs + j, random())
        # ---------------------------------------------------------------------------------------
        for i in range(10): self.random_connection()

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
        
        if self.is_cyclic(20, 21):
            print(self.neurons)
            print(self.connections)
            raise Exception("this is acyclic")

        sigmoid = lambda x: 1 / (1 + math.exp(-x))

        @lru_cache(None)
        def rec_out(n_innov):
            current_neuron = self.get_neuron(n_innov)
            if current_neuron.type == "input":
                self.out_values[n_innov] = current_neuron.value
                return current_neuron.value
            
            sum = 0
            for c in self.connections:
                if c.out == n_innov and c.enabled:
                    # DP per fer-ho eficient
                    # if c.inp in self.out_values.keys():
                    #     sum += self.out_values[c.inp] * c.w
                    
                    # else:
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
        n = self.neat.add_neuron(len(self.neurons))
        self.neurons.append(n)
        return n

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

        visited = [False]*len(self.neurons)
        stack = [False]*len(self.neurons)

        self.connections.append(Connection(-1, n1, n2, 1))
        for n in self.neurons:
            if rec_is_cyclic(n.innov, visited, stack):
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
        weight = random()/50
        if random() < 0.5: weight = -weight 
        
        for c in self.connections:
            c.w = max(0, min(c.w + weight, 1))

    def random_neuron(self):
        index = math.floor(random()*len(self.connections))
        c_old = self.connections[index]
        c_old.enabled = False

        new_n = self.add_neuron()
        self.add_connection(c_old.inp, new_n.innov, c_old.w)
        self.add_connection(new_n.innov, c_old.out, 1)

    def mutate(self):
        m = 0.2
        if random() < m:
            self.random_connection()
        if random() < m:
            self.random_neuron()
        if random() < m:
            self.change_weights_random()

    def crossover(self, other):
        # best = other_fit < this_fit

        i1 = 0
        i2 = 0
        c1 = self.connections
        c2 = other.connections
        
        new_connections = []
        while i1 < len(c1) and i2 < len(c2):
            if c1[i1].innov == c2[i2].innov:
                if random() < 0.5:
                    new_connections.append(c1[i1].copy())
                else: 
                    new_connections.append(c2[i2].copy())
                i1 += 1
                i2 += 1

            elif c1[i1].innov < c2[i2].innov:
                new_connections.append(c1[i1].copy())
                i1 += 1
            
            elif c1[i1].innov > c2[i2].innov:
                i2 += 1

        while i1 < len(c1):
            new_connections.append(c1[i1].copy())
            i1 += 1

        new_neurons = [n.copy() for n in self.neurons]
        new_brain = Genom(self.neat, new_neurons, self.n_inputs, self.n_outputs)
        new_brain.connections = new_connections
        new_brain.mutate()
        return new_brain

    def distance(self, other):
        k1 = k2 = k3 = 1

        i1 = 0
        i2 = 0
        self.connections.sort(key=lambda p: p.innov)
        c1 = self.connections
        other.connections.sort(key=lambda p: p.innov)
        c2 = other.connections

        n_matching = 0
        wheight_diff = 0        
        disjoint = 0
        while i1 < len(c1) and i2 < len(c2):
            if c1[i1].innov == c2[i2].innov:
                n_matching += 1
                wheight_diff += abs(c1[i1].w - c2[i2].w)
                i1 += 1
                i2 += 1

            elif c1[i1].innov < c2[i2].innov:
                disjoint += 1
                i1 += 1
            
            elif c1[i1].innov > c2[i2].innov:
                disjoint += 1
                i2 += 1

        excess = 0
        
        while i1 < len(c1):
            excess += 1
            i1 += 1

        while i2 < len(c2):
            excess += 1
            i2 += 1

        N = max(len(c1), len(c2))
        if N < 20: N = 1
        dist = (k1*excess/N) + (k2*disjoint/N) + k3*(wheight_diff/max(1, n_matching))

        return dist