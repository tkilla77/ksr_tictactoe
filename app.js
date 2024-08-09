import express from 'express'
const app = express()
const port = 3000

// Serve all files from static/ as is.
// For example, a request for '/tictactoe.html' will be served from
// 'static/tictactoe.html'
app.use(express.static('static'))

// Redirect the root url to tictactoe.
app.get('/', (req, res) => {
    res.redirect('tictactoe.html')
})

// Listen on the given port
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
