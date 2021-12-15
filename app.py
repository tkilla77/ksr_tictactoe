from flask import Flask, jsonify
from flask import url_for, redirect

from tictactoe import TicTacToe
 
app = Flask(__name__)

the_game = TicTacToe()
 
@app.route("/")
def root():
    return redirect(url_for('static', filename='tictactoe.html'))
    
@app.route("/tictactoe")
def tictactoe():
    """Returns the current state of the game."""
    return jsonify(the_game.getState())

@app.route("/set/<int:player>/<int:cell>")
def set(player, cell):
    """Sets the cell given with the player's mark. Returns a 403 (Forbidden)
       status if the game is over, the cell is taken, or if it's not the player's turn."""
    try:
        the_game.setField(player, cell)
    except Exception as e:
        # Something went wrong - signal 403 (Forbidden)
        return str(e), 403
    return jsonify(the_game.getState())