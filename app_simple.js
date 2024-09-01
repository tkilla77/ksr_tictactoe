import express from 'express'

const app = express()
const port = 3000

let game = {
    "id": 0,
    "state": {
        "progress" : "playing",
        "next": "X"
    },
    "grid": [ " ", " ", " ", " ", " ", " ", " ", " ", " " ],
};

app.get('/game/', (req, res) => {
    res.json(game);
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
    game.grid[cell] = color;
    if (game.state.next == 'X') {
        game.state.next = 'O';
    } else {
        game.state.next = 'X';
    }
    res.json(game);
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
