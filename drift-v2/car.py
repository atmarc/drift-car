import math
from wall import Wall 

def dist(x1, y1, x2, y2):
    a = x1 - x2
    b = y1 - y2
    return math.sqrt(a * a + b * b)

class Car ():
    def __init__ (self, w, h, route_walls, brain):
        self.w = w
        self.h = h
        self.drift = 20
        self.sense_walls = []
        self.sense_dists = []
        self.sense_dots = []
        self.vision_len = 400
        self.brain = brain
        self.route = route_walls
        self.restart()
        self.actualize_walls()

    def restart(self):
        self.checkpoints = []
        self.x = 158
        self.y = 239
        self.rotation = -1.56
        self.dir = (1, 0) # x, y
        self.v = 0
        self.deadAt = 400

    def actualize_route_walls(self):

        self.sense_walls = [0] * 8
        x1 = self.x
        y1 = self.y
        pi4 = math.pi/4

        for i in range(8):
            angle = self.rotation + i *pi4
            x2 = x1 + self.vision_len * math.cos(angle)
            y2 = y1 + self.vision_len * math.sin(angle)
            self.sense_walls[i] = Wall(x1, y1, x2, y2)

        for i in range(8):
            min_dot = None
            min_dist = math.inf
            
            for j in range(len(self.route)):
                collision = self.sense_walls[i].intersection(self.route[j])
                if collision:
                    distance = dist(collision[0], collision[1], self.x, self.y)
                    if distance < min_dist:
                        min_dist = distance
                        min_dot = collision
            
            self.sense_dots[i] = min_dot
            
            if min_dist == None or min_dist > self.vision_len:
                min_dist = self.vision_len
            
            self.sense_dists[i] = min_dist / self.vision_len
    
    def actualize_walls(self):
        self.actualizeRouteWalls()

        # Actualització parets que formen el cotxe
        x1 = (self.x - self.w/2)
        x4 = x1
        x2 = (self.x + self.w/2)
        x3 = x2
        
        y1 = (self.y - self.h/2 + self.drift)
        y2 = y1
        y3 = (self.y + self.h/2 + self.drift)
        y4 = y3

        r = dist(x1, y1, self.x, self.y)
        x1 = self.x - r * math.cos(self.rotation)
        y1 = self.y - r * math.sin(self.rotation)
        x2 = self.x + r * math.cos(self.rotation)
        y2 = self.y + r * math.sin(self.rotation)
        
        angle = math.atan(self.h/(self.w/2))
        
        r = dist(x3, y3, self.x, self.y)
        x3 = self.x + r * math.cos(self.rotation + angle)
        y3 = self.y + r * math.sin(self.rotation + angle)
        x4 = self.x - r * math.cos(self.rotation - angle)
        y4 = self.y - r * math.sin(self.rotation - angle)
        
        self.walls = [
            Wall(x1, y1, x2, y2), Wall(x2, y2, x3, y3), 
            Wall(x3, y3, x4, y4), Wall(x4, y4, x1, y1)
        ]

    def move(self):
        self.x += self.dir[0] * self.v
        self.y += self.dir[1] * self.v
        self.check_vel()
        self.actualize_walls()

    def think(self):
        vel = 1
        rot = 0.13
        th = 0.8

        res = self.brain.out
        #TODO: pensar com fer bé això