from flask import Flask, jsonify, url_for, redirect, session, abort
from tictactoe import *
 
app = Flask(__name__)
app.logger.setLevel("DEBUG")
# Set the secret key to some random bytes. Keep this really secret!
app.secret_key = b'_5#y2L"F23Q8z\n\xec]/'

games = []
def addGameToSession(game, player, session):
    """Records the game in the user's session cookie.
    For each game id, we store the set of players the user has in this game.
    """
    assert game.isWaiting(), "Cannot join a game that is not waiting"
    game_id = str(game.id)
    if 'games' in session:
        game_ids = session['games']
        if type(game_ids) != dict:
            session['games'] = {game_id: [player]}
        elif game_id not in game_ids or type(game_ids[game_id]) != list:
            game_ids[game_id] = [player]
        elif player not in game_ids[game_id]:
            game_ids[game_id].append(player)
        session.modified = True
    else:
        session['games'] = {game_id: [player]}

def checkGameInSession(game_id, player, session):
    """Ensures the game id is already recorded in the user's session cookie."""
    game_id_str = str(game_id)
    session_games = session.get('games', {})
    if not game_id_str in session_games:
        raise Exception("Not your game, go away!")
    players = session_games[game_id_str]
    if not (player) in players:
        raise Exception("You're not this player, go away!")
    if not game_id in games:
        raise Exception("Unknown game!")
    

@app.route("/")
def root():
    return redirect(url_for('static', filename='tictactoe.html'))
    
@app.route("/join")
def join():
    """Joins a game that is waiting for players, or creates a new one."""
    
    for game in games:
        if game.isWaiting():
            addGameToSession(game, PLAYER_2, session)
            app.logger.debug(f"Joining game {game.id}")
            game.join(PLAYER_2)
            return jsonify(game.getState(PLAYER_2))
    # No game waiting
    game_id = len(games)
    game = TicTacToe(game_id)
    app.logger.debug(f"Creating new game {game.id}")
    games.append(game)
    addGameToSession(game, PLAYER_1, session)
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
        checkGameInSession(game_id, player, session)
        game = games[game_id]
        game.setField(player, cell)
        return jsonify(game.getState(player))
    except Exception as e:
        # Something went wrong - signal 403 (Forbidden)
        return str(e), 403

