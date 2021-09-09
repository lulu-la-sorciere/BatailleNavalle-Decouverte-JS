const game = {
    nbHit : 0,
    nbPlouf : 0,
    turnCounter : 1,
    isOver: false,
    init: function () {

        game.nbHit = 0;
        game.nbPlouf = 0;
        game.turnCounter = 1;
        game.isOver = false;

        score.init();
        grid.init();
    },
    /**
     * Cette fonction permet de savoir si c'est la fin du jeu ou pas.
     * Comment ? Si il n'y a plus de "b" dans notre tableau grid, c'est que c'est fini.
     */
    checkGameOver: function () {
        // J'initialise une variable boatCell qui va me permettre de stocker le nombre de cellules restantes, contenant un 'b'
        let boatCell = 0;

        // Je boucle sur les valeurs de mon tableau grid, qui sont donc les lignes.
        for (let currentRow of grid.cells) {
            // Je boucle sur les colonnes de mes lignes, pour récupérer chaque caractères.
            for (let currentChar of currentRow) {
                // Si le caractère d'une colonne est égale à "b" alors j'incrémente mon compteur boatCell
                if (currentChar === 'b') {
                    boatCell++;
                }
            }
        }

        // Si je n'ai plus de cellule avec un 'b' alors c'est la fin : "Game Over"
        if (boatCell === 0) {
            console.log('Game Over');
            game.isOver = true;
            // Sinon, je retourn false
        } else {
            game.isOver = false;
        }
        return game.isOver;
    },

    /**
     * Cette fonction nous permet de récupérer la position sur laquelle l'utilisateur veut tirer (A1 par exemple)
     */
    promptMissileCell: function () {
        // On stock le résultat de prompt() dans une variable
        // ce résultat est simplement la cordonnée renseignée par l'utilisateur dans le champ du prompt
        const order = prompt("Ou est-ce qu'on tire ? (A1, B4, C7 ...)");

        // On envoit un missile sur cette coordonnée.
        game.sendMissile(order);
    },

    /**
     * La fonction pour envoyer un missille sur un celulle
     * Cette fonction retournera true si on tiré sur une cellule contenant "b"
     * Sinon elle retournera false
     * On en profite pour afficher un message dans la console, dans les deux cas
     */
    sendMissileAt: function (rowIndex, columnIndex) {

        // si la partie est terminée on n'envoit pas de missile
        if (game.isOver) {
            return false;
        }
        let currentChar = grid.cells[rowIndex][columnIndex];

        // la variable grid est accessible dans cette fonction, étant définie plus haut dans le contexte global
        // Si on trouve un 'b', c'est qu'on a touché un bateau, donc on change le 'b' par un 't' pour indiqué qu'on a touché
        if (currentChar === 'b') {
            console.log('Touché !');
            grid.cells[rowIndex][columnIndex] = 't';

            // Afficher la grille après chaque tir de missiles
            grid.displayGrid();

            stats.displayHits();

            score.score += 30000;
            return true;

            // Sinon si il y a déjà un "t" c'est qu'on a déjà touché
        } else if (currentChar === 't') {
            console.log('Déjà touché mon capitaine !');
        } else if (currentChar === 'p') {
            console.log('Et ça refait plouf !')
            // Sinon c'est qu'on est tombé dans l'eau
        } else {
            console.log('Plouf ! ');
            grid.cells[rowIndex][columnIndex] = 'p';

            // Afficher la grille après chaque tir de missiles
            grid.displayGrid();
        }

        score.score -= 9000;
        return false;

    },

    /**
     * Cette fonction nous permet d'envoyer un missile via les coordonnées de type "A0" sur une case
     */
    sendMissile: function (cellName) {
        // On utilise la fonction getGridIndexes qui traduit notre string (ex: A5) en index (Ex: A5 => row = 4 et column = 0)
        const result = grid.getGridIndexes(cellName);
        const rowIndex = result[0];
        const columnIndex = result[1];

        // Puis on appelle la fonction sendMissileAt
        // on prend soin de retourner la valeur de retour de sendMissileAt
        // (VRAI si touché, FALSE sinon)
        return game.sendMissileAt(rowIndex, columnIndex);
    },

    updateTurnDisplay: function () {
        // récupère le span#turn et modifie sa valeur
        document.querySelector('#turn').innerText = game.turnCounter;
    }

}