/**
 * Game state enum.
 * @readonly
 * @enum {{name: string}}
 */
export const GameState = Object.freeze({
    WAITING:   { name: "waiting" },
    PLAYING:  { name: "playing" },
    ENDED: { name: "ended" },
});

/** A game of TicTacToe. */
export class TicTacToe {
    #id;
    #next = 'X';
    #cells = Array(9).fill(' ');
    #state = GameState.WAITING;
    #userIdX;
    #userId0;

    constructor(id) {
        this.#id = id;
    }

    getState() {
        return this.#state;
    }

    isWaiting() {
        return this.getState() == GameState.WAITING;
    }

    isPlaying() {
        return this.getState() == GameState.PLAYING;
    }

    join(userId) {
        if (!this.isWaiting()) {
            throw new Error("Game is not waiting for new players!");
        }
        if (this.#userIdX == undefined) {
            this.#userIdX = userId;
        } else if (this.#userId0 == undefined) {
            this.#userId0 = userId;
            this.#state = GameState.PLAYING;
        }
    }

    toJson() {
        return {
            id: this.#id,
            state: this.#state.name,
            grid: this.#cells,
            winner: this.getWinner(),
            next: this.#next,
        };
    }

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
     * Checks if the three cells at the given indices
     * have the same color X or O.
     * 
     * @param {int[3]} indices the indices of a winning combination
     * @returns the winning color, undefined if there is no winner
     */
    isWinner(indices) {
        const colors = [
            this.#cells[indices[0]],
            this.#cells[indices[1]],
            this.#cells[indices[2]],
        ];
        if (colors[0] == colors[1] && colors[0] == colors[2] && colors[0] != ' ') {
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
    getWinner() {
        const winners = [[0,1,2], [3,4,5], [6,7,8],  // horizontal
                         [0,3,6], [1,4,7], [2,5,8],  // vertical
                         [0,4,8], [2,4,6]];          // diagonal

        for (const winner of winners) {
            const winningColor = this.isWinner(winner);
            console.log(`Winner for ${winner} is ${winningColor}`)
            if (winningColor) {
                return winningColor;
            }
        }
        return undefined;
    }

    /**
     * Click handler for the nine cells.
     *
     * @param {userid} the userid
     * @param {cell} the cell in 0-8
     */
    set(userid, cell) {
        if (!this.isPlaying()) {
            throw new Error(`Game is not playing!`);
        }
        if (this.#cells[cell] != ' ') {
            throw new Error(`Cell ${cell} is not empty!`);
        }
        // Validate userid
        if (this.#next == 'X' && userid != this.#userIdX
            || this.#next == 'O' && userid != this.#userId0) {
            throw new Error(`Not your turn!`);
        }
        
        const color = this.#getNext();
        this.#cells[cell] = color;

        // State change if there is a winner or no more empty cells.
        const winner = this.getWinner();
        if (winner != undefined) {
            this.#state = GameState.ENDED;
        }
        if (this.#cells.indexOf(' ') == -1) {
            this.#state = GameState.ENDED;
        }
    }
}
