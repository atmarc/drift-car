from data import route, dots
from wall import Wall

# Initialize walls
# -----------------------------------------------------------------------------------------------------
route_walls = []
canvas_width = 1316
canvas_height = 587

for i in range(0, len(route), 4):
    w = Wall(route[i] - canvas_width/2, route[i + 1] - canvas_height/2, route[i + 2] - canvas_width/2, 
        route[i + 3] - canvas_height/2)
    route_walls.append(w)
# -----------------------------------------------------------------------------------------------------


# Initialize checkpoints
# -----------------------------------------------------------------------------------------------------
checkpoints = []
for i in range(0, len(dots), 4):
    checkpoints.append(Wall(dots[i], dots[i + 1], dots[i + 2], dots[i + 3]))
# -----------------------------------------------------------------------------------------------------

generation = 0
step = 0
steps_for_gen = 800
pop_size = 50
population = Population(pop_size, steps_for_gen, route_walls, checkpoints)

while True:
    step = population.run(step)

    if step >= steps_for_gen:
        step = 0
        generation += 1
        population.selection()
        population.reproduction()

# Possible futura GUI amb tkinter