
# Player codes
EMPTY = ' '
PLAYER_1 = 'X'
PLAYER_2 = 'O'

# Game states
STATE_WAITING = 'WAITING'
STATE_PLAYING = 'PLAYING'
STATE_TIE = 'TIE'
STATE_WINNER_1 = 'WINNER_1'
STATE_WINNER_2 = 'WINNER_2'


class TicTacToe:
    """A game of tictactoe"""

    def __init__(self, game_id):
        self.id = game_id
        self.field = [EMPTY] * 9
        self.next = PLAYER_1
        self.state = STATE_WAITING
        self.winner = EMPTY

    def getState(self, player):
        """Returns a dictionary capturing the entire state of this game,
        suitable to be converted to JSON.
         """
        if player not in [PLAYER_1, PLAYER_2]:
            raise Exception("Illegal player name")
        return {
            'id': self.id,
            'player': player,
            'field': self.field,
            'next': self.next,
            'state': self.state,
            'winner': self.winner,
        }
    
    def isWaiting(self):
        return self.state == STATE_WAITING
    
    def isPlaying(self):
        return self.state == STATE_PLAYING

    def join(self, player):
        if not self.isWaiting():
            raise Exception("Game is not waiting for players")
        self.state = STATE_PLAYING

    def setField(self, player, cell):
        """Attempts to set the given cell for the given player, raising an
        exception if the arguments are invalid or the move is illegal.
        """
        if self.next != player:
            raise Exception("Not your turn")
        if not self.isPlaying():
            raise Exception("Game is not playing")
        if cell < 0 or 8 < cell:
            raise Exception("Illegal cell")
        if self.field[cell] != EMPTY:
            raise Exception("Cell is already taken")

        self.field[cell] = self.next
        if self.next == PLAYER_1:
            self.next = PLAYER_2
        else:
            self.next = PLAYER_1
        self.winner = self.updateWinner()

    def updateWinner(self):
        winners = [[0, 1, 2], [3,4,5], [6,7,8],
                [0,3,6], [1,4,7], [2,5,8],
                [0,4,8], [2,4,6]]

        for winner in winners:
            winner = self.getWinner(winner)
            if winner == PLAYER_1:
                self.state = STATE_WINNER_1
                self.next = EMPTY
                return PLAYER_1
            if winner == PLAYER_2:
                self.state = STATE_WINNER_2
                self.next = EMPTY
                return PLAYER_2

        hasEmptyCells = False
        for cell in self.field:
            if cell == EMPTY:
                hasEmptyCells = True
                break
        if not hasEmptyCells:
            self.state = STATE_TIE
            self.next = EMPTY
        return EMPTY


    def getWinner(self, indices):
        cells = [
            self.field[indices[0]],
            self.field[indices[1]],
            self.field[indices[2]],
        ]
        if cells[0] == cells[1] and cells[0] == cells[2]:
            return cells[0]
        return EMPTY
