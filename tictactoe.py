
class TicTacToe:
    """A game of tictactoe"""
    def __init__(self):
        self.field = [0,0,0,0,0,0,0,0,0]
        self.next = 1
        self.state = "playing"  # "playing" or "tie" or "winner_1" or "winner_2"


    def getState(self):
        return {
            'field': self.field,
            'next' : self.next,
            'state': self.state
        }
    
    def setField(self,player,cell):
        if (self.next != player):
            raise Exception("Not your turn")
        if (self.state != "playing"):
            raise Exception("Game is not playing")
        if (cell < 0 or 8 < cell):
            raise Exception("Illegal cell")
        if self.field[cell] != 0:
            raise Exception("Cell is already taken")
        self.field[cell] = self.next
        self.updateWinner()
        if self.next == 1:
            self.next = 2
        else:
            self.next = 1
        return True
    
    def updateWinner(self):
        # TODO: implement
        pass