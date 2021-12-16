/** A HTML view of a TicTacToe game. */
class TttView {
    /** Creates a new view using the the given grid. */
    constructor(grid) {
        this.grid = grid;
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

    async fetchCurrentGame() {
        this.handleJsonUrl(`/view/${this.game_id}/${this.player}`);
    }

    async handleJsonUrl(url) {
        try {
            let response = await fetch(url);
            await this.handleJsonResponse(response);
            if (this.state == "WAITING" || (this.state == "PLAYING" && this.next != this.player)) {
                await this.wait(1000);
                this.fetchCurrentGame();
            }
        } catch (exception) {
            console.log(exception);
        }
    }

    async handleJsonResponse(response) {
        if (!response.ok) {
            console.log("Error: " + await response.text());
            return;
        }
        const json = await response.json();
        this.player = json.player;
        this.next = json.next;
        this.game_id = json.id;
        this.state = json.state;
        this.view.updateHtml(json);
    }

    // wait ms milliseconds
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

let view = new TttView(document.getElementsByClassName("grid")[0])
let controller = new TttController(view);
