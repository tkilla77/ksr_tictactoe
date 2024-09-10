let game = {
    "id": 0,
    "state": {
        "progress" : "waiting",
        "next": "X"
    },
    "grid": [ " ", " ", " ", " ", " ", " ", " ", " ", " " ],
};

// Make a play
async function play(cell) {
    response = await fetch(`/play/${cell}/${game.color}`);
    await updateGame(response)
    poll();
}

// Polls the server state until it's our turn.
async function poll() {
    // Keep polling the server while the game state could change remotely.
    while (game.state.progress == "waiting"
            || (game.state.progress == "playing" && !game.yourturn)) {
        await sleep(1000);
        response = await fetch('/game');
        await updateGame(response)
    }
}

// Returns a promise that waits ms milliseconds.
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Updates the game state from the JSON response received from a remote HTTP endpoint.
 *
 * @param {Response} response the HTTP response from a remote JSON endpoint.
 */
async function updateGame(response) {
    if (!response.ok) {
        let error =  await response.text();
        console.log("Error: " + error);
        addToLog(error);
        return;
    }
    game = await response.json();
    if (game.state.progress == "playing") {
        const ourOrTheir = game.yourturn ? "our" : "their";
        updateStatus(`${game.state.progress}: ${ourOrTheir} turn`);
    } else if (game.winner == game.color) {
        updateStatus("You won");
    } else if (game.winner) {
        updateStatus("You lost");
    } else if (game.state.progress == "ended") {
        updateStatus("Tie");
    } else {
        updateStatus(game.state.progress);
    }
    updateHtml(game);
}

// Updates the HTML to match the game state given as JSON.
function updateHtml(json) {
    let i = 0;  

    for (const button of document.querySelectorAll(".grid button")) {
        const cellText = json.grid[i];
        // Set the data-state attribute which drives CSS formatting.
        button.setAttribute('data-state', cellText);
        // Set the text contents of the cell.
        button.textContent = cellText;
        // Set the disabled state to match whether the cell is full.
        if (cellText != ' ') {
            button.setAttribute('disabled', "1");
        } else {
            button.removeAttribute('disabled');
        }
        i++;
    }
}

function updateStatus(statusText) {
    document.getElementById("status").textContent = statusText;
}

function addToLog(logText) {
    let log = document.getElementById("log")
    if (log.childNodes.length >= 5) {
        log.lastChild.remove();
    }
    let logstatement = document.createElement("logstatement");
    logstatement.textContent = logText;
    log.prepend(logstatement);
}

// Set up click handlers and start polling.
async function init() {
    let i = 0;
    for (const button of document.querySelectorAll(".grid button")) {
        const cell = i;
        button.addEventListener('click', () => play(cell));
        i++;
    }
    poll();
}

init()
