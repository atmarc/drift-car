class Wall():
    def __init__(self, x1, y1, x2, y2):
        self.x1 = x1
        self.y1 = y1
        self.x2 = x2
        self.y2 = y2
    
    def contained(self, x, y):
        if self.x1 == self.x2 and x != self.x1:
            return False
        if self.y1 == self.y2 and y != self.y1:
            return False
    
        if self.x1 > self.x2:
            if x > self.x1: return False
            if x < self.x2: return False
        
        else:
            if x > self.x2: return False
            if x < self.x1: return False

        if self.y1 > self.y2:
            if y > self.y1: return False
            if y < self.y2: return False

        else:
            if y > self.y2: return False
            if y < self.y1: return False

        return True

    def intersection(self, w):
        x3 = w.x1
        y3 = w.y1
        x4 = w.x2
        y4 = w.y2
        x1 = self.x1
        x2 = self.x2
        y1 = self.y1
        y2 = self.y2

        den = (x1 - x2)*(y3 - y4) - (y1 - y2)*(x3 - x4)
        
        if den == 0: 
            return None

        t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den
        u = ((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / den
        
        dot_x = x1 + t * (x2 - x1)
        dot_y = y1 + t * (y2 - y1)

        if self.contained(dot_x, dot_y) and w.contained(dot_x, dot_y): 
            return (dot_x, dot_y)
        else: 
            return None
