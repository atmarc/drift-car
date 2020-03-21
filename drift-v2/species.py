import random
import math

class Species():

    def __init__ (self, r):
        self.representant = r
        self.genoms = [r]
        self.old_genoms = []
        self.CP = 10
        self.perc = 0.5
        self.n = 1

    def __repr__ (self):
        return f'Specie({len(self.genoms)})'

    def check_if_member(self, member):
        dist = self.representant.distance(member)
        if dist < self.CP:
            self.genoms.append(member)
            return True
        else: 
            return False

    def sort(self):
        self.genoms.sort(reverse=True, key=lambda p: p.fitness)
    
    def kill(self):
        border = math.floor(len(self.genoms) * self.perc)
        self.n = len(self.genoms)

        for i in range(border):
            self.genoms.pop()
    
        return len(self.genoms) <= 1

    def reproduce(self):
        new_genoms = []
        for i in range(self.n):
            pare = random.choice(self.genoms)
            mare = random.choice(self.genoms)
            if pare.fitness > mare.fitness: child = mare.crossover(pare)
            else: child = pare.crossover(mare)
            new_genoms.append(child)
        self.old_genoms = self.genoms
        self.genoms = []
        self.genoms = new_genoms
        return self

    def reproduce_extra(self):
        pare = random.choice(self.old_genoms)
        mare = random.choice(self.old_genoms)
        if pare.fitness > mare.fitness: child = mare.crossover(pare)
        else: child = pare.crossover(mare)
        self.genoms.append(child)



