from flask import Flask, jsonify
from flask import url_for, redirect

from tictactoe import *
 
app = Flask(__name__)
app.logger.setLevel("DEBUG")

games = []
 
@app.route("/")
def root():
    return redirect(url_for('static', filename='tictactoe.html'))
    
@app.route("/join")
def join():
    """Joins a game that is waiting for players, or creates a new one."""
    for game in games:
        if game.isWaiting():
            app.logger.debug(f"Joining game {game.id}")
            game.join(PLAYER_2)
            return jsonify(game.getState(PLAYER_2))
    # No game waiting
    game_id = len(games)
    game = TicTacToe(game_id)
    app.logger.debug(f"Creating new game {game.id}")
    games.append(game)
    return jsonify(game.getState(PLAYER_1))

@app.route("/view/<int:game_id>/<player>")
def view(game_id, player):
    """Returns the state of the given game if it exists."""
    try:
        game = games[game_id]
        return jsonify(game.getState(player))
    except Exception as e:
        # Something went wrong - signal 403 (Forbidden)
        return str(e), 403

@app.route("/set/<int:game_id>/<player>/<int:cell>")
def set(game_id, player, cell):
    """Sets the cell given with the player's mark. Returns a 403 (Forbidden)
    status if the game is over, the cell is taken, or if it's not the player's
    turn.
    """
    try:
        game = games[game_id]
        game.setField(player, cell)
        return jsonify(game.getState(player))
    except Exception as e:
        # Something went wrong - signal 403 (Forbidden)
        return str(e), 403

