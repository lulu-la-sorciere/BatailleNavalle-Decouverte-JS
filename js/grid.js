const grid = {
    cells: [],
    headers : { rows: [], columns : []}, 
    init: function () {
        grid.cells = [
            ['','','b','b','','','', ''], // Ligne 1 - Index 0
            ['','','','','','','', ''], // Ligne 2 - Index 1
            ['','','','','','','', ''], // Ligne 3 - Index 2
            ['','','','','','','b', ''], // Ligne 4 - Index 3
            ['','','','','','','b', ''], // Ligne 5 - Index 4
            ['','','','','','','b', ''], // Ligne 6 - Index 5
            ['','b','b','b','b','','', ''], // Ligne 7 - Index 6
            ['','','','','','','', ''] // Ligne 8 - Index 7
          ];
        grid.headers.rows = [1, 2, 3, 4, 5, 6, 7, 8];
        grid.headers.columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        
    },

    /* vérifie si la valeur fournie correspond à une case existante */
    checkValueIsCorrect: function (cellName) { // B3

        // vérifier si le B ( le premier caractère fourni ) est dans le tableau grid.headers.columns
        // récupérer le premier caractère
        const firstCharFromUser = cellName[0];
        // vérifier son existence dans le tableau grid.headers.columns
        // en parcourant le tableau par exemple
        //  let firstCharIsOk = false;
        // for (let currentChar of grid.headers.columns) {
        //     // si le currentChar vaut le premier caractère alors on l'a trouvé
        //     if (currentChar === firstCharFromUser) {
        //         firstCharIsOk = true;
        //     }
        // }
        // ou en utilisant une fonction disponible dans js
        console.log(grid.headers);
        const firstCharIsOk = grid.headers.columns.includes(firstCharFromUser);
        console.log(firstCharIsOk);
        // si on le trouve garder un booleen à true


        // vérifier si le 3 ( le second caractère fourni ) est dans le tableau grid.headers.rows

        // on convertit le second caractère en type numérique car dans le tableau ils sont au format numérique
        const secondChar = Number(cellName[1]);
        const secondCharIsOk = grid.headers.rows.includes(secondChar);
        console.log(secondCharIsOk);


        // if (firstCharIsOk === true && secondCharIsOk === true) {
        if (firstCharIsOk && secondCharIsOk) {
            return true;
        } else {
            return false;
        }
        // c'est équivalent à 
        // return firstCharIsOk && secondCharIsOk;
    },
    /**
     * Fonction gérant l'affichage de la grille
     */
    displayGrid: function () {

        // Join permet de prendre les éléments d'un tableau et de les mettres les uns à la suite des autres séparé par ce qu'on veut
        // ex: array.join(' - ')
        // Donc on affiche A B C D E F G H
        console.log('  ' + grid.headers.columns.join(' '));

        for (let rowIndex = 0; rowIndex < grid.cells.length; rowIndex++) {
            // On initialise une variable line  contenant le numéro de la ligne via les intitulés de ligne stockés dans `grid.headers.rows`
            let row = grid.headers.rows[rowIndex];

            // On ajoute la ligne a affiché, grâce à displayLine
            row += ' ' + grid.displayLine(rowIndex);

            // On l'affiche
            console.log(row);
        }
    },

    // # Etape 2
    // On crée une fonction displayLine qui prend comme paramètre un tableau "ligne"
    displayLine: function (rowIndex) {

        // On initialise notre variable qui va permettre d'afficher chacune des cellules de la ligne
        let lineToDisplay = '';
        let line = grid.cells[rowIndex];

        // On utilise for pour générer des nombres de 0 à 7, pour pouvoir accéder à chaque élément du tableau line
        // line.length corrspond à count($line) en php
        // définition; limite/condition pour; ce qu'il se passe à chaque tour de boucle
        for (let columnIndex = 0; columnIndex < line.length; columnIndex++) {
            let currentChar = line[columnIndex];

            if (currentChar === '') {
                lineToDisplay += '~';
            }
            else {

                lineToDisplay += currentChar;

                // --- AJOUT à comprendre pour E02
                // J'ajoute mon caractère dans le html 
                // Je génère le nom de mon id à ciblé
                let cellId = 'cell' + rowIndex + columnIndex;
                // Je récupère l'élément lié à cet id
                let cell = document.getElementById(cellId);
                // Je met le caractères courrant dans le texte de cet élément html
                // cell.textContent = currentChar;

                // Si mon caractère courant est égal à t alors c'est que cette case est un bateau touché, donc j'ajoute la classe hit
                if (currentChar === 't') {
                    cell.classList.add('hit');
                    // Sinon, si c'est un paragraphe, j'ajoute la classe spaclsh
                } else if (currentChar === 'p') {
                    cell.classList.add('splash');
                }
                // ---- FIN AJOUT

            }

            lineToDisplay += ' ';


        }

        return lineToDisplay;
    },
    getCellIndexesFromId : function (cellId) { // cell02
        return {
            rowIndex: cellId[4], 
            colIndex : cellId[5]
        };
    },
    /**
     * getGridIndexes permet de récupérer le rowIndex et le columnIndex à partir d'une coordonnée du type "A1"
     */
    getGridIndexes: function (cell) {


        // cell = quelque chose comme "A1"

        // On récupère le premier caractère de la variable cell
        let letter = cell.substring(0, 1);

        // Ici on obtient le deuxième caractère qui est de type 'string' contenant un chiffre
        // Donc on doit le convertir en nombre
        // 1ère possibilité : 
        let rowIndex = parseInt(cell.substring(1, 2), 10);
        // 2em possibilité: 
        //let rowIndex = Number(cell.substring(1, 2));

        // On retire 1 à notre rowIndex pour qu'il corresponde à l'index réel de notre tableau.
        rowIndex = rowIndex - 1;

        // Va permettre de stocker l'index de la colonne visée
        let columnIndex;

        // Je boucle sur les index du tableau grid.headers.columns
        for (let currentIndex in grid.headers.columns) {

            // Je compare ma lettre avec chacune des lettres du tableau
            // Si ma lettre est la même qu'une du tableau, alors je stock son index dans columnIndex
            if (grid.headers.columns[currentIndex] === letter) {
                columnIndex = currentIndex;
            }
            //console.log(currentIndex);
        }

        return [rowIndex, columnIndex];
    }
}