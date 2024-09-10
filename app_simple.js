import express from 'express'
import cookieParser from 'cookie-parser'

const app = express()
app.use(cookieParser())
const port = 3000


let game = {
    "id": 0,
    "state": {
        "progress" : "playing",
        "next": "X"
    },
    "grid": [ " ", " ", " ", " ", " ", " ", " ", " ", " " ],
    "player_X": "",
    "player_O": "",
};

// Returns the user's userid, creating a random
// userid if there is none.
function getUserId(req, res) {
    let userid = req.cookies.userid
    if (userid == undefined) {
        userid = crypto.randomUUID()
        res.cookie('userid', userid)
    }
    return userid
}

// Create a copy of game to return and
// sets the 'player' entry according to
// the user id.
function sendGame(req, res) {
    let copy = structuredClone(game)
    delete copy['player_X']
    delete copy['player_O']
    let userid = getUserId(req, res)
    if (game['player_X'] == userid) {
        // User is already assigned X
        copy['player'] = 'X'
    } else if (game['player_O'] == userid) {
        // User is already assigned O
        copy['player'] = 'O'
    } else if (game['player_X'] == "") {
        // Join game as X
        game['player_X'] = userid
        copy['player'] = 'X'
    } else if (game['player_O'] == "") {
        // Join game as O
        game['player_O'] = userid
        copy['player'] = 'O'
    }
    res.json(copy)
}

app.get('/game/', (req, res) => {
    sendGame(req, res);
});

app.get('/play/:cell/:color', (req, res) => {
    // TODO: security
    let cell = req.params['cell'];
    let color = req.params['color'];
    if (color != game.state.next) {
        res.status(403).send("Not your turn, my friend!");
        return;
    }
    if (game.grid[cell] != " ") {
        res.status(403).send("Cell is not free, buddy!");
        return;
    }
    if (game['player_' + color] != getUserId(req, res)) {
        res.status(403).send("Trying to play for someone else?!");
        return;
    }
    game.grid[cell] = color;
    if (game.state.next == 'X') {
        game.state.next = 'O';
    } else {
        game.state.next = 'X';
    }
    sendGame(req, res);
});


// Serve all files from static/ as is.
// For example, a request for '/tictactoe.html' will be served from
// 'static/tictactoe.html'
app.use(express.static('static'))

// Redirect the root url to 'tictactoe.html'.
app.get('/', (req, res) => {
    res.redirect('tictactoe.html')
})

// Listen on the given port
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
