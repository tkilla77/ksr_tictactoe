from flask import Flask, jsonify, url_for, redirect, session, abort
from tictactoe import *
import uuid
 
app = Flask(__name__)
app.logger.setLevel("DEBUG")
# Set the secret key to some random bytes. Keep this really secret!
app.secret_key = b'_5#y2L"F23Q8z\n\xec]/'

games = []

def getPlayerId(session):
    player_id = session.get('ttt_uuid', None)
    if not player_id:
        player_id = uuid.uuid1().hex
        session['ttt_uuid'] = player_id
    return player_id


@app.route("/")
def root():
    return redirect(url_for('static', filename='tictactoe.html'))
    
@app.route("/join")
def join():
    """Joins a game that is waiting for players, or creates a new one."""
    player_id = getPlayerId(session)
    for game in games:
        if game.isWaiting():
            app.logger.debug(f"Joining game {game.id}")
            game.join(player_id)
            return jsonify(game.getState(PLAYER_2))
    # No game waiting
    game_id = len(games)
    game = TicTacToe(game_id)
    games.append(game)
    app.logger.debug(f"Creating new game {game.id}")
    game.join(player_id)
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
        if getPlayerId(session) != game.getPlayerUuid(player):
            raise Exception("Not your game, my friend")
        game.setField(player, cell)
        return jsonify(game.getState(player))
    except Exception as e:
        # Something went wrong - signal 403 (Forbidden)
        return str(e), 403

