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
};

// Returns the user's userid, creating a random
// userid if there is none, storing it as a cookie.
function getUserId(req, res) {
    let userid = req.cookies.userid
    if (userid == undefined) {
        userid = crypto.randomUUID()
        res.cookie('userid', userid)
    }
    return userid
}

// Create a copy of game to return and
// sets the 'color' and 'yourturn' entries
// according to the user id.
function sendGame(req, res) {
    // Join a game that is waiting for players.
    let userid = getUserId(req, res)
    if (game.player_X == undefined) {
        // Join game as X
        console.log(`User ${userid} joining game as X`)
        game.player_X = userid
    } else if (game.player_O == undefined && game.player_X != userid) {
        // Join game as O
        console.log(`User ${userid} joining game as O`)
        game.player_O = userid
    }
    
    // Create a copy and set the 'color' property
    let copy = structuredClone(game)
    if (game.player_X == userid) {
        // User is already assigned X
        copy.color = 'X'
    } else if (game.player_O == userid) {
        // User is already assigned O
        copy.color = 'O'
    } else {
        // game already has two other players
    }
    // Set the 'yourturn' property if applicable
    if (copy.state.next == copy.color) {
        copy.yourturn = true
    }
    res.json(copy)
}

app.get('/game/', (req, res) => {
    console.log('/game')
    sendGame(req, res);
});

app.get('/play/:cell/:color', (req, res) => {
    console.log('/play')
    // TODO: security
    // TODO: winner detection, end status
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
