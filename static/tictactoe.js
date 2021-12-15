var next = 'X'
/**
 * Returns the current color and toggles the color.
 *  
 * @returns the current color
 */
function getNext() {
    const n = next;
    if (n == 'X') {
        next = 'O';
    } else {
        next = 'X';
    }
    return n;
}

/**
 * Returns the button's color, undefined if not yet clicked.
 * 
 * @param {element} button a button element in tictactoe
 * @returns the button's color, undefined if not clicked
 */
function getColor(button) {
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
function isWinner(buttons, indices) {
    const colors = [
        getColor(buttons[indices[0]]),
        getColor(buttons[indices[1]]),
        getColor(buttons[indices[2]]),
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
function getWinner(grid) {
    const buttons = grid.getElementsByTagName("button");
    const winners = [[0, 1, 2], [3,4,5], [6,7,8],
               [0,3,6], [1,4,7], [2,5,8],
               [0,4,8], [2,4,6]];

    for (const winner of winners) {
        const winningColor = isWinner(buttons, winner);
        if (winningColor) {
            return winningColor;
        }
    }
    return undefined;
}

function onClick(button) {
    const color = getNext();
    button.setAttribute('data-state', color);
    button.innerHTML=color;
    button.setAttribute('disabled', "1");

    const winner = getWinner(button.parentNode);
    if (winner) {
        alert("Won: " + winner);
    }
}
