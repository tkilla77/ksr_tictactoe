class TicTacToe {
    #next = 'X';
    #status;
    #log;

    /**
     * Returns the current color and toggles the color.
     *  
     * @returns the current color
     */
    #getNext() {
        const n = this.#next;
        if (n == 'X') {
            this.#next = 'O';
        } else {
            this.#next = 'X';
        }
        return n;
    }

    /**
     * Returns the button's color, undefined if not yet clicked.
     * 
     * @param {element} button a button element in tictactoe
     * @returns the button's color, undefined if not clicked
     */
    getColor(button) {
        return button.getAttribute("data-state");
    }

    /**
     * Checks if the three buttons at the given indices
     * have the same color X or O.
     * 
     * @param {element[9]} buttons the 9 button elements
     * @param {int[3]} indices the indices of a winning combination
     * @returns the winning color, undefined if there is no winner
     */
    isWinner(buttons, indices) {
        const colors = [
            this.getColor(buttons[indices[0]]),
            this.getColor(buttons[indices[1]]),
            this.getColor(buttons[indices[2]]),
        ];
        if (colors[0] == colors[1]
            && colors[0] == colors[2]) {
            return colors[0];
        }
        return undefined;
    }

    /**
     * Returns the winning color, undefined if there is no winner.
     * 
     * @param {element} grid the DOM element containing the buttons
     * @returns the winning color, undefined if there is no winner
     */
    getWinner(grid) {
        const buttons = grid.getElementsByTagName("button");
        const winners = [[0,1,2], [3,4,5], [6,7,8],  // horizontal
                         [0,3,6], [1,4,7], [2,5,8],  // vertical
                         [0,4,8], [2,4,6]];          // diagonal

        for (const winner of winners) {
            const winningColor = this.isWinner(buttons, winner);
            if (winningColor) {
                return winningColor;
            }
        }
        return undefined;
    }

    #addLog(s) {
        let logstatement = this.#log.ownerDocument.createElement('logstatement');
        logstatement.innerHTML = s;
        this.#log.insertBefore(logstatement, this.#log.firstChild);
    }

    /**
     * Click handler for the nine buttons. Game state is stored
     * in the data-state attribute.
     *
     * @param {button} button the clicked button
     */
    onClick(button) {
        if (this.getWinner(button.parentNode)) {
            this.#addLog(`Game has ended!`);
            return;
        }
        const color = this.#getNext();
        button.setAttribute('data-state', color);
        button.innerText = color;
        button.setAttribute('disabled', "1");

        const winner = this.getWinner(button.parentNode);
        if (winner) {
            this.#status.innerText = `The winner is ${winner}`;
        }
        this.#addLog(`Next player: ${this.#next}`);
    }

    connectToHtml(parent) {
        for (let button of parent.querySelectorAll("button")) {
            button.addEventListener("click", () => this.onClick(button));
        }
        this.#status = parent.querySelector("#status");
        this.#log = parent.querySelector("#log");
    }
}

let game = new TicTacToe();
game.connectToHtml(document);