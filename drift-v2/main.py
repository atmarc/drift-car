from data import route, dots
from wall import Wall
from population import Population
from tkinter import Tk, Canvas, Frame, BOTH
import gc


# Initialize walls
# -----------------------------------------------------------------------------------------------------
route_walls = []
canvas_width = 1316
canvas_height = 587

for i in range(0, len(route), 4):
    w = Wall(route[i], route[i + 1], route[i + 2], 
        route[i + 3])
    route_walls.append(w)
# -----------------------------------------------------------------------------------------------------


# Initialize checkpoints
# -----------------------------------------------------------------------------------------------------
checkpoints = []
for i in range(0, len(dots), 4):
    checkpoints.append(Wall(dots[i] + canvas_width/2, dots[i + 1] + canvas_height/2,
    dots[i + 2] + canvas_width/2, dots[i + 3] + canvas_height/2))
# -----------------------------------------------------------------------------------------------------

generation = 0
step = 0
steps_for_gen = 3000
pop_size = 30
population = Population(pop_size, steps_for_gen, route_walls, checkpoints)

car_forms = [0]*pop_size

def update():
    global step
    global generation
    global steps_for_gen
    global pop_size
    global population
    if step % 100 == 0: print("Step: ", step)
    step = population.run(step)

    for i, c in enumerate(population.cars):
        points = []
        for w in c.walls: points += [w.x1, w.y1]
        canvas.delete(car_forms[i])
        car_forms[i] = canvas.create_polygon(points, fill="red")

    if step >= steps_for_gen:
        generation += 1
        step = 0
        print("Selecting...")
        population.selection()
        print("Best punctuation: ", population.cars[population.max_fit_car].fitness())
        print("Neurons best:", len(population.cars[population.max_fit_car].brain.neurons))
        print("Connections best:", len(population.cars[population.max_fit_car].brain.connections))
        print("Connections checkpoints:", population.cars[population.max_fit_car].checkpoints)
        print("Reproducing...")
        population.reproduction(0.2)
        print("Garbage collecting")
        gc.collect()
        print(len(population.neat.neurons))
        print(len(population.neat.connections))
        print("--------------------------------------------------------")
        print(f"Starting generation {generation}!")

    time = 0
    if step % 10 == 0: time = 1
    canvas.after(time, update)


window = Tk()
canvas = Canvas(window)
for w in route_walls:
    canvas.create_line(w.x1, w.y1, w.x2, w.y2)

for w in checkpoints:
    canvas.create_line(w.x1, w.y1, w.x2, w.y2, fill="green")

canvas.pack(fill=BOTH, expand=1)
canvas.after(1000, update)
window.mainloop()

# Possible futura GUI amb tkinter