from car import Car
import math
from random import random

class Population():
    def __init__(self, n, s, walls, checkpoints):
        self.steps = s
        self.n = n
        self.walls = walls
        self.checkpoints = checkpoints
        self.cars = []
        self.neat = new Neat(8, 4, n) # TODO: mirar això si ho faré així o com
        self.matpool = []
        
        for i in range(n):
            self.cars.append(Car(20, 40, walls, self.neat.genoms[i]))
        
        self.alive = [True] * n

    def check_colision(self, car):
        for w in self.walls):
            if car.collides(w):
                return True
        
        return False

    def progress(self, car, step):
        for i, c in enumerate(self.checkpoints):
            front_wall = car.walls[0]
            if front_wall.intersection(c) and len(car.checkpoints) == i:
                car.checkpoints.append([i, step])
    
    def run(self, step):
        end = True
        for i, car in enumerate(self.cars):
            if self.alive[i]:
                end = False
                car.think()
                car.move()
                car.check_vel()
                self.progress(car, step)

            if self.check_colision(car):
                self.alive[i] = False
                car.dead_at = step
        
        if end: return math.inf
        step += 1
        return step

    def selection(self):
        fitness_array = []
        max_fitness = -1
        max_fit_car = 0
        for i in range(self.n):
            aux = self.cars[i].fitness()
            fitness_array[i] = aux
            if aux > max_fitness:
                max_fitness = aux
                max_fit_car = i
        
        self.max_fit_car = max_fit_car
        self.matpool = []

        # Normalize weights and create matpool
        for i in range(len(fitness_array)):
            times = fitness_array[i] * 1000/max_fitness
            for i in range(times):
                self.matpool.append(i)

    def reproduction(self):
        best_brain = self.cars[self.max_fit_car].brain

        for i in range(self.n):
            i1 = math.floor(random() * len(self.matpool))
            i2 = math.floor(random() * len(self.matpool))

            father = self.cars[self.matpool[i1]]
            mother = self.cars[self.matpool[i2]]
            child_brain = father.crossover(mother)

            self.cars[i].brain = child_brain
            self.cars[i].brain.mutate()

            self.cars[i].restart()
        
        self.alive = [True] * n
        