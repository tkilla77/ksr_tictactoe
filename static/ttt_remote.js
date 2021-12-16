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
            button.setAttribute('data-state', cellText);
            button.textContent = cellText;
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
        try {
            let response = await fetch(`/join`);
            let json = await response.json();
            this.player = json.player;
            this.next = json.next;
            this.game_id = json.id;
            this.view.updateHtml(json);
        } catch (exception) {
            console.log(exception);
        }

        let i = 0;
        for (const button of this.view.grid.getElementsByTagName("button")) {
            const cell = i;
            button.addEventListener('click', () => {
                this.onClick(cell);
            });
            i++;
        }
    }

    async onClick(cell) {
        try {
            let response = await fetch(`/set/${this.game_id}/${this.player}/${cell}`);
            let json = await response.json();
            this.next = json.next;
            this.view.updateHtml(json)
        } catch (exception) {
            console.log(exception);
        }
    }

}

let view = new TttView(document.getElementsByClassName("grid")[0])
let controller = new TttController(view);
