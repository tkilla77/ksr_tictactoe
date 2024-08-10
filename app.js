import express from 'express'
import cookieParser from 'cookie-parser'
import {TicTacToe, GameState} from './tictactoe.js'

const app = express()
app.use(cookieParser("just4now"))
const port = 3000

// Serve all files from static/ as is.
// For example, a request for '/tictactoe.html' will be served from
// 'static/tictactoe.html'
app.use(express.static('static'))

// Redirect the root url to 'tictactoe.html'.
app.get('/', (req, res) => {
    res.redirect('tictactoe.html')
})

let nextGameId = 0
let games = {}

function findGame(req, res) {
    let gameid = Number.parseInt(req.params['gameid'])
    let game = games[gameid]
    if (game != undefined) {
        return game
    } else {
        res.status(404).json({ error: `No game with id ${gameid}!`})
    }
}

app.get('/game/:gameid', (req, res) => {
    let game = findGame(req, res)
    if (game != undefined) {
        res.json(game.toJson(getUserId(req, res)))
    }
})

function getUserId(req, res) {
    // FIXME: use signed cookies.
    let userid = req.cookies.userid
    if (userid == undefined) {
        userid = crypto.randomUUID()
        res.cookie('userid', userid)
    }
    return userid
}

app.get('/join', (req, res) => {
    const userid = getUserId(req, res)
    for (let game of Object.values(games)) {
        if (game.isWaiting()) {
            game.join(userid)
            res.json(game.toJson(userid))
            return
        }
    }
    // No waiting game found - create a new one
    let game = new TicTacToe(nextGameId)
    games[nextGameId] = game
    nextGameId += 1
    
    game.join(userid)
    res.json(game.toJson(userid))
})

app.get('/set/:gameid/:cell', (req, res) => {
    const userid = getUserId(req, res)
    let game = findGame(req, res)
    if (game != undefined) {
        game.set(userid, req.params['cell'])
        res.json(game.toJson(userid))
    }
})

// Listen on the given port
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
