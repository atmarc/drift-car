from neat import Neat
from genom import *

neurons = [Neuron(0, "input"), Neuron(1, "input"), Neuron(2, "input"), Neuron(3, "input"),
           Neuron(4, "output"), Neuron(5, "output") ]

my_connections = [Connection(0, 0, 4, 1), Connection(1, 0, 5, 1), Connection(2, 1, 6, 1), Connection(3, 6, 5, 1)]

neat = Neat(4, 2, 1)
g = Genom(neat, neurons, 4, 2) 

print(g.connections)

for i in range(30):
    g.random_connection()

for c in g.connections:
    print(c)

print("Value: ", g.out([0.04,0.3,0.01,0.7]))