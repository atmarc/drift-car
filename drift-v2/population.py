from car import Car
import math
from random import random
from neat import Neat

class Population():
    def __init__(self, n, s, walls, checkpoints):
        self.steps = s
        self.n = n
        self.walls = walls
        self.checkpoints = checkpoints
        self.cars = []
        self.neat = Neat(8, 4, n, self) # TODO: mirar això si ho faré així o com
        self.fitness_array = [0]*self.n
        self.matpool = []
        
        for i in range(n):
            self.cars.append(Car(20, 40, walls, self.neat.genoms[i]))
        
        self.alive = [True] * n

    def check_colision(self, car):
        for w in self.walls:
            if car.collides(w):
                return True
        
        return False

    def progress(self, car, step):
        for i, c in enumerate(self.checkpoints):
            front_wall = car.walls[0]
            check = False
            for w in car.walls:
                if w.intersection(c) and len(car.checkpoints) == i: check = True
            if check: car.checkpoints.append([i, step])

    
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
        max_fitness = -1
        max_fit_car = 0
        for i in range(self.n):
            aux = self.cars[i].fitness()
            self.fitness_array[i] = aux
            if aux > max_fitness:
                max_fitness = aux
                max_fit_car = i
        
        self.max_fit_car = max_fit_car
        self.matpool = []

        # # Normalize weights and create matpool
        # for i in range(len(self.fitness_array)):
        #     times = int(self.fitness_array[i] * 1000/max_fitness)
        #     for x in range(times):
        #         self.matpool.append(i)

    def reproduction(self):
        self.neat.reproduction(self.fitness_array)

        for i in range(self.n):
            self.cars[i].brain = self.neat.genoms[i]
            self.cars[i].restart()
        self.alive = [True] * self.n
        