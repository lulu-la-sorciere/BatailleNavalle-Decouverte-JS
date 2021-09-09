// créons un premier module 
// un module c'est tableau associatif
// dans les modules on rajoute toujours "par convention" une fonction init
const app = {
    turnCounter : 0,
    appName : 'Bataille navale 3000',
    init : function (){
        app.turnCounter = 1;
        // on ajoute les écouteurs d'événements
    },
    handleFormSubmit : function (evt) {
        // on annule le comportement par défaut du navigateur (ici il n'y aura pas de rechargement de la page)
        evt.preventDefault();
        console.log('formulaire soumis');
    
        // la propriété currentTarget d'un événement fournit l'élément sur lequel on a accroché l'écouteur
        // formWithListener correspond au même objet du DOM que formElement définit plus haut
        const formWithListener = evt.currentTarget;
    
        const inputElValue = formWithListener.querySelector('#cellToHit').value;
    
        // je m'assure d'avoir récupéré la valeur que je voulais
        console.log(inputElValue);
        
        // si la valeur est correcte (pour le jeu) alors envoyé le missile
        if (checkValueIsCorrect(inputElValue)) {
    
            // ici on pourra incrémenter notre compteur de tour.
            turnCounter++;
    
            if (sendMissile(inputElValue)) {
                // ajouter un message de réussite
                // l'afficher
                addActionToList('réussi ' + inputElValue);
    
                nbHit++;
            } else {
                // ajouter un message d'erreur
                const message = 'tata';
                addActionToList('raté ' + inputElValue);
    
                nbPlouf++;
            }
    
            // on vide l'input du formulaire
            formWithListener.querySelector('#cellToHit').value = '';
        } else {
            // sinon afficher un message d'erreur
            console.error('La saisie n est pas valide');
        }
    
        updateTurnDisplay();
    }
};

// On test, avec un console.log() que notre fichier js est bien inclus
console.log('Je suis bien inclus');

// # Etape 1
// On crée une variable grid grâce au mot clé "let"
// et on lui affecte une valeur de type tableau qui contient des chaines de caractères vide pour représenter une case sans bateau ou "b" pour représenter une case avec un bateau
let grid = [
  // A  B   C   D   E  F  G    H
    ['','','b','b','','','', ''], // Ligne 1 - Index 0
    ['','','','','','','', ''], // Ligne 2 - Index 1
    ['','','','','','','', ''], // Ligne 3 - Index 2
    ['','','','','','','b', ''], // Ligne 4 - Index 3
    ['','','','','','','b', ''], // Ligne 5 - Index 4
    ['','','','','','','b', ''], // Ligne 6 - Index 5
    ['','b','b','b','b','','', ''], // Ligne 7 - Index 6
    ['','','','','','','', ''] // Ligne 8 - Index 7
];

/**
 * Les hearders vont nous servir pour afficher les intitulés de chaque ligne et chaque colonne. Ça nous permet aussi d'avoir une référence commune, pour de future fonctions.
 */
const gridHeaders = {
    rows: [1,2,3,4,5,6,7,8],
    columns: ['A','B','C','D','E','F','G','H']
};


// # Etape 2
// On crée une fonction displayLine qui prend comme paramètre un tableau "ligne"
function displayLine(rowIndex) {


    // On initialise notre variable qui va permettre d'afficher chacune des cellules de la ligne
    let lineToDisplay = '';
    let line = grid[rowIndex];

    // On utilise for pour générer des nombres de 0 à 7, pour pouvoir accéder à chaque élément du tableau line
    // line.length corrspond à count($line) en php
    // définition; limite/condition pour; ce qu'il se passe à chaque tour de boucle
    for(let columnIndex = 0; columnIndex < line.length; columnIndex++) {
        let currentChar = line[columnIndex];

        if(currentChar === '') {
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
            cell.textContent = currentChar;

            // Si mon caractère courant est égal à t alors c'est que cette case est un bateau touché, donc j'ajoute la classe hit
            if(currentChar === 't') {
                cell.classList.add('hit');
            // Sinon, si c'est un paragraphe, j'ajoute la classe spaclsh
            }else if(currentChar === 'p') {
                cell.classList.add('splash');
            }
            // ---- FIN AJOUT
        }

        lineToDisplay += ' ';

    }

    return lineToDisplay;
}

/**
 * Fonction gérant l'affichage de la grille
 */
function displayGrid() {

    // Join permet de prendre les éléments d'un tableau et de les mettres les uns à la suite des autres séparé par ce qu'on veut
    // ex: array.join(' - ')
    // Donc on affiche A B C D E F G H
    console.log('  ' + gridHeaders.columns.join(' '));

    for(let rowIndex=0; rowIndex < grid.length; rowIndex++) {
        // On initialise une variable line  contenant le numéro de la ligne via les intitulés de ligne stockés dans `gridHeaders.rows`
        let row = gridHeaders.rows[rowIndex];

        // On ajoute la ligne a affiché, grâce à displayLine
        row +=  ' ' + displayLine(rowIndex);

        // On l'affiche
        console.log(row);
    }
}


/**
 * getGridIndexes permet de récupérer le rowIndex et le columnIndex à partir d'une coordonnée du type "A1"
 */
function getGridIndexes(cell) {


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

    // Je boucle sur les index du tableau gridHeaders.columns
    for(let currentIndex in gridHeaders.columns) {

        // Je compare ma lettre avec chacune des lettres du tableau
        // Si ma lettre est la même qu'une du tableau, alors je stock son index dans columnIndex
        if(gridHeaders.columns[currentIndex] === letter) {
            columnIndex = currentIndex;
        }
        //console.log(currentIndex);
    }

    return [rowIndex, columnIndex];
}


/**
 * La fonction pour envoyer un missille sur un celulle
 * Cette fonction retournera true si on tiré sur une cellule contenant "b"
 * Sinon elle retournera false
 * On en profite pour afficher un message dans la console, dans les deux cas
 */
function sendMissileAt(rowIndex, columnIndex) {

    let currentChar = grid[rowIndex][columnIndex];
    
    // la variable grid est accessible dans cette fonction, étant définie plus haut dans le contexte global
    // Si on trouve un 'b', c'est qu'on a touché un bateau, donc on change le 'b' par un 't' pour indiqué qu'on a touché
    if(currentChar === 'b') {
        console.log('Touché !');
        grid[rowIndex][columnIndex] = 't';
        
        // Afficher la grille après chaque tir de missiles
        displayGrid();

        displayHits();
    
        return true;
    
    // Sinon si il y a déjà un "t" c'est qu'on a déjà touché
    } else if(currentChar === 't') {
        console.log('Déjà touché mon capitaine !');
        return false;
    } else if(currentChar === 'p') {
        console.log('Et ça refait plouf !')
        return false;
    // Sinon c'est qu'on est tombé dans l'eau
    }else {
        console.log('Plouf ! ');
        grid[rowIndex][columnIndex] = 'p';

        // Afficher la grille après chaque tir de missiles
        displayGrid();
        return false;
    }

}

/**
 * Cette fonction nous permet d'envoyer un missile via les coordonnées de type "A0" sur une case
 */
function sendMissile(cellName) {
    // On utilise la fonction getGridIndexes qui traduit notre string (ex: A5) en index (Ex: A5 => row = 4 et column = 0)
    const result = getGridIndexes(cellName);
    const rowIndex = result[0];
    const columnIndex = result[1];
    
    // Puis on appelle la fonction sendMissileAt
    // on prend soin de retourner la valeur de retour de sendMissileAt
    // (VRAI si touché, FALSE sinon)
    return sendMissileAt(rowIndex, columnIndex);
}


/**
 * Cette fonction permet de savoir si c'est la fin du jeu ou pas.
 * Comment ? Si il n'y a plus de "b" dans notre tableau grid, c'est que c'est fini.
 */
function checkGameOver() {
    // J'initialise une variable boatCell qui va me permettre de stocker le nombre de cellules restantes, contenant un 'b'
    let boatCell = 0;

    // Je boucle sur les valeurs de mon tableau grid, qui sont donc les lignes.
    for(let currentRow of grid) {
        // Je boucle sur les colonnes de mes lignes, pour récupérer chaque caractères.
        for(let currentChar of currentRow) {
            // Si le caractère d'une colonne est égale à "b" alors j'incrémente mon compteur boatCell
            if(currentChar === 'b') {
                boatCell++;
            }
        }
    }

    // Si je n'ai plus de cellule avec un 'b' alors c'est la fin : "Game Over"
    if(boatCell === 0) {
        console.log('Game Over');
        return true;
    // Sinon, je retourn false
    }else {
        return false;
    }
}

/**
 * Cette fonction nous permet de récupérer la position sur laquelle l'utilisateur veut tirer (A1 par exemple)
 */
function promptMissileCell() {
    // On stock le résultat de prompt() dans une variable
    // ce résultat est simplement la cordonnée renseignée par l'utilisateur dans le champ du prompt
    const order = prompt("Ou est-ce qu'on tire ? (A1, B4, C7 ...)");

    // On envoit un missile sur cette coordonnée.
    sendMissile(order);
}

function displayHits() {
    const hitElements = document.querySelectorAll('.hit');
    
    // On va afficher dans la console les éléments touchés, sous ce format là : 
    // cell01, cell03, cell15, cell45
    // On prépare un tableau pour stocker les id de toutes les cases touchées
    let hits = [];

    // On boucle sur chaque cellule qui ont les classe 'hit'
    for(cellElement of hitElements) {
        
        // On insère leurs id dans le tableau hit
        hits.push(cellElement.id);
    }

    console.log('Les cellules touchées sont : ' + hits.join(', '));
}


displayGrid();


//tant que le jeu n'est pas terminé
// while (checkGameOver() === false) {
//     // on affiche la grille
//     displayGrid();
//     // puis on demande au joueur de donner une case
//     promptMissileCell();
// }

//sendMissileAt(3);
//sendMissileAt(0);

// correction atelier

let nbHit = 0;
let nbPlouf = 0;
let turnCounter = 1;
// récupérer le formulaire
const formElement = document.querySelector('#game .form');
formElement.addEventListener('submit', app.handleFormSubmit);

document.querySelector('#stats').addEventListener('click', handleStatButtonClick);
document.querySelector('#toogle-actions').addEventListener('click', handleHistoryButtonClick);


document.querySelector('#beforegame .form').addEventListener('submit', handleSelectNameFormSubmit);


/* ajoute le préfixe avec le numéro du tour au message et l'affiche en haut de la div#actions */
function addActionToList(message) {
    // préfixer le message avec le numéro du tour

    message = '<div>Tour #' + (turnCounter - 1) + ' : ' + message + '</div>';
    // ajouter le message complet à la div
    const actionDiv = document.querySelector('#actions');
    // pour ajouter le texte au début on remplace tout le contenu par le nouveau message + l'historique de messages existant
    actionDiv.innerHTML = message + actionDiv.innerHTML;
    // actionDiv.prepend(message); // @mathieu
}

/* vérifie si la valeur fournie correspond à une case existante */
function checkValueIsCorrect(cellName) { // B3

    // vérifier si le B ( le premier caractère fourni ) est dans le tableau gridHeaders.columns
    // récupérer le premier caractère
    const firstCharFromUser = cellName[0];
    // vérifier son existence dans le tableau gridHeaders.columns
    // en parcourant le tableau par exemple
    //  let firstCharIsOk = false;
        // for (let currentChar of gridHeaders.columns) {
        //     // si le currentChar vaut le premier caractère alors on l'a trouvé
        //     if (currentChar === firstCharFromUser) {
        //         firstCharIsOk = true;
        //     }
        // }
    // ou en utilisant une fonction disponible dans js
    const firstCharIsOk = gridHeaders.columns.includes(firstCharFromUser);
    console.log(firstCharIsOk);
    // si on le trouve garder un booleen à true


    // vérifier si le 3 ( le second caractère fourni ) est dans le tableau gridHeaders.rows

    // on convertit le second caractère en type numérique car dans le tableau ils sont au format numérique
    const secondChar = Number(cellName[1]);
    const secondCharIsOk = gridHeaders.rows.includes(secondChar);
    console.log(secondCharIsOk);


    // if (firstCharIsOk === true && secondCharIsOk === true) {
    if (firstCharIsOk && secondCharIsOk) {
        return true;
    } else {
        return false;
    }
    // c'est équivalent à 
    // return firstCharIsOk && secondCharIsOk;
}

function handleHistoryButtonClick(evt) {
    console.log('affichage de l\'historique');

    // afficher / cacher la div#actions
    const actionDiv = document.querySelector('#actions');

    if (actionDiv.style.display == 'block') {
        actionDiv.style.display = 'none';
    } else {
        actionDiv.style.display = 'block';
    }

}

function handleSelectNameFormSubmit(evt) {
    evt.preventDefault();

    // récupérer le nom et l'ajouter dans le span du jeu
    document.querySelector('#game .username').innerText = document.querySelector('#username').value;

    // cacher la div #beforegame
    document.querySelector('#beforegame').classList.add('hidden');
    
    // afficher la div #game
    document.querySelector('#game').classList.remove('hidden');
}


function handleStatButtonClick() {
    console.log('affichage des stats');
    // calculer le pourcentage de tir réussi
    const percentHit = 100 * nbHit / (nbHit + nbPlouf);
    // calculer le pourcentage de tir ratés
    const percentMiss = 100 * nbPlouf / (nbHit + nbPlouf);
    // afficher ces pourcentage

    // générons la chaine que l'on va afficher
    // \r\n permet de faire un retour à la ligne dans le texte généré
    let message = 'Réussite : ' + Math.round(percentHit) + '% \r\n';
    message += 'Echec : ' + Math.round(percentMiss) + '% \r\n';
    message += 'Nombre de tirs : ' + (nbHit + nbPlouf);

    window.alert(message);
}

function updateTurnDisplay() {
    // récupère le span#turn et modifie sa valeur
    document.querySelector('#turn').innerText = turnCounter;
}
