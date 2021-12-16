/** A HTML view of a TicTacToe game. */
class TttView {
    /** Creates a new view using the the given grid. */
    constructor(grid, status, log) {
        this.grid = grid;
        this.status = status;
        this.log = log;
    }

    /**
     * Updates the HTML to match the game state given as JSON.
     */
    updateHtml(json) {
        let i = 0;

        for (const button of this.grid.getElementsByTagName("button")) {
            const cellText = json.field[i];
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

    updateStatus(statusText) {
        this.status.textContent = statusText;
    }

    addToLog(logText) {
        if (this.log.childNodes.length >= 5) {
            this.log.lastChild.remove();
        }
        let logstatement = document.createElement("logstatement");
        logstatement.textContent = logText;
        this.log.prepend(logstatement);
    }
}

/** A controller for a TicTacToe game, managing the connection to the server. */
class TttController {
    constructor(view) {
        this.view = view;
        this.init();
    }

    /**
     * Fetches the game state, updates the UI, and installs click handlers.
     */
    async init() {
        this.handleJsonUrl('/join');

        let i = 0;
        for (const button of this.view.grid.getElementsByTagName("button")) {
            const cell = i;
            button.addEventListener('click', () => {
                this.handleJsonUrl(`/set/${this.game_id}/${this.player}/${cell}`);
            });
            i++;
        }
    }

    /**
     * Fetches the given URL and updates the internal state from the parsed JSON.
     * 
     * Keeps polling for updates if the updated state could change remotely.
     * 
     * @param {string} url the URL to fetch that will return tictactoe JSON.
     */
    async handleJsonUrl(url) {
        try {
            let response = await fetch(url);
            await this.handleJsonResponse(response);
            // Keep polling the server while the game state could change remotely.
            if (this.state == "WAITING" || (this.state == "PLAYING" && this.next != this.player)) {
                await this.wait(1000);
                this.handleJsonUrl(`/view/${this.game_id}/${this.player}`);
            }
        } catch (exception) {
            console.log(exception);
            this.view.addToLog(exception.toString());
        }
    }

    /**
     * Updates the game state from the JSON response received from a remote HTTP endpoint.
     *
     * @param {Response} response the HTTP response from a remote JSON endpoint.
     */
    async handleJsonResponse(response) {
        if (!response.ok) {
            let error =  await response.text();
            console.log("Error: " + error);
            this.view.addToLog(error);
            return;
        }
        const json = await response.json();
        this.player = json.player;
        this.next = json.next;
        this.game_id = json.id;
        this.state = json.state;
        if (this.state == "PLAYING") {
            const ourOrTheir = this.next == this.player ? "our" : "their";
            this.view.updateStatus(`${json.state}: ${ourOrTheir} turn`);
        } else {
            this.view.updateStatus(`${json.state}`);
        }
        this.view.updateHtml(json);
    }

    // wait ms milliseconds
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

let view = new TttView(document.getElementsByClassName("grid")[0],
                       document.getElementById("status"),
                       document.getElementById("log"))
let controller = new TttController(view);
