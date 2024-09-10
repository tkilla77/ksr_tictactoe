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

let game = {
    "id": 0,
    "state": {
        "progress" : "waiting",
        "next": "X"
    },
    "grid": [ " ", " ", " ", " ", " ", " ", " ", " ", " " ],
};

/**
 * Fetches the given URL and updates the internal state from the parsed JSON.
 * 
 * Keeps polling for updates if the updated state could change remotely.
 * 
 * @param {string} url the URL to fetch that will return tictactoe JSON.
 */
async function handleJsonUrl(url) {
    try {
        let response = await fetch(url);
        await handleJsonResponse(response);
        // Keep polling the server while the game state could change remotely.
        if (game.state.progress == "waiting"
             || (game.state.progress == "playing" && !game.yourturn)) {
            await wait(1000);
            handleJsonUrl('/game');
        }
    } catch (exception) {
        console.log(exception);
        addToLog(exception.toString());
    }
}

/**
 * Updates the game state from the JSON response received from a remote HTTP endpoint.
 *
 * @param {Response} response the HTTP response from a remote JSON endpoint.
 */
async function handleJsonResponse(response) {
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
    } else if (game.winner == game.player) {
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

// Returns a promise that waits ms milliseconds.
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function init() {
    handleJsonUrl('/game');

    let i = 0;
    for (const button of document.querySelectorAll(".grid button")) {
        const cell = i;
        button.addEventListener('click', () => {
            handleJsonUrl(`/play/${cell}/${game.color}`);
        });
        i++;
    }
}

init()
