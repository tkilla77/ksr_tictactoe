class TttView {
    constructor(grid) {
        this.grid = grid;
    }
}

class TttController {
    constructor(view) {
        this.view = view;

        // TODO find out which player we are.
        this.player = 1;

        let i = 0;
        for (const button of view.grid.getElementsByTagName("button")) {
            const cell = i;
            button.addEventListener('click', () => {
                this.onClick(cell);
            });   
            i++;
        }
    }
    async onClick(cell) {
        try {
            response = await fetch(`/set/${this.player}/${cell}`);
            json = await response.json();
            let i = 0;
            for (const button of this.view.grid.getElementsByTagName("button")) {
                let color = '?';
                disabled = false;
                if (json.field[i] == 0) {
                    color = ' ';
                } else if (json.field[i] == 1) {
                    color = 'X';
                    disabled = true;
                } else if (json.field[i] == 2) {
                    color = 'O';
                    disabled = true;
                } else {
                    color = '?';
                }

                button.setAttribute('data-state', color);
                button.textContent = color;
                if (disabled) {
                    button.setAttribute('disabled', "1");
                }
                i++;
            }
        } catch (exception) {
            // TODO handle problems
        }
    }

}

let view = new TttView(document.getElementsByClassName("grid")[0])
let controller = new TttController(view);
