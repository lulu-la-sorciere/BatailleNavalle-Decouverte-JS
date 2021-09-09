const app = {
    theme_list : {'oclock' : 'O\'clock', 'black-and-white' : 'Black and white', 'terminal' : 'terminal', 'f0f' : 'f0f'},
    init: function () {

        // récupérer le formulaire
        const formElement = document.querySelector('#game .form');
        formElement.addEventListener('submit', app.handleFormSubmit);

        document.querySelector('#stats').addEventListener('click', app.handleStatButtonClick);
        document.querySelector('#toogle-actions').addEventListener('click', app.handleHistoryButtonClick);

        document.querySelector('#beforegame .form').addEventListener('submit', app.handleSelectNameFormSubmit);

        // rajoute les écouteurs sur chaque case! 
        const cells = document.querySelectorAll('div.cell');
        // console.log(cells);
        for (cell of cells) {
            // console.log(cell);
            cell.addEventListener('click', app.handleCellClick);
        }

        // changement du theme
        // on va récupérer la valeur du theme dans le cookie (s'il existe)
        const themeInCookie = app.getThemeInCookie();
        // on va appliquer le bon thème sur le body
        app.applyNewTheme(themeInCookie);
        
        // au lancement de l'application on va remplir la liste de choix
        let themeElement = document.querySelector('#theme-selection');
        
        for (const themeValue in app.theme_list) {
            // récupérer le texte de l'option
            const themeText = app.theme_list[themeValue];
            // créer l'élément option
            const optionEl = document.createElement('option');
            optionEl.value = themeValue;
            optionEl.innerHTML = themeText;
            // facultatif : on va modifier la valeur sélectionnée dans la liste déroulante
            if (themeInCookie === themeValue) 
            {
                optionEl.toggleAttribute('selected');
            }
            themeElement.appendChild(optionEl);
        }

        // <option value="oclock" selected>O'clock</option>
        // <option value="f0f">F0F</option>
        // <option value="terminal">Terminal</option>
        // <option value="black-and-white">Black and White</option>

        // on va écouter les changement de valeurs
        themeElement.addEventListener('change', app.handleThemeChange);
    },
    applyNewTheme: function (selectedTheme) {

        // supprimer les classes de thèmes
        for (const themeName in app.theme_list) {
            document.querySelector('body').classList.remove(themeName);
        }

        // appliquer la bonne class sur l'élément body
        if ( selectedTheme ) {
            document.querySelector('body').classList.add(selectedTheme);
        }

        // ou alors on peut modifier la valeur complète de la propriété class de la balise body
        // document.querySelector('body').className = selectedTheme;
        // document.querySelector('body').setAttribute('class', selectedTheme);
    },
    getThemeInCookie: function() {
        let themeInCookie = '';
        // récupéré ici : https://developer.mozilla.org/en-US/docs/Web/API/Document/cookie#example_2_get_a_sample_cookie_named_test2
        const cookieRow = document.cookie
        .split('; ') // pour séparer les différentes valeur présente du cookie
        .find(row => row.startsWith('battleship-theme=')); // on récupère uniquement la valeur qui nous intéresse (ici battleship-theme=Valeur_selectionnee)
        
        if ( cookieRow ) {
            themeInCookie = cookieRow.split('=')[1];// on récupère uniquement la valeur
        }
        
        return themeInCookie;             
    },
    handleCellClick : function(evt) {

        // récupérer l'heure de début de partie pour calculer le score
        if (game.startTime === 0 ) {
            game.startTime = Date.now();
        }

        console.log(game.startTime);

        // récupère la div sur laquelle on a cliqué (en vrai il s'agit de la cellule sur laquelle l'événement est accroché)
        const currentCell = evt.currentTarget;
        console.log(currentCell.id);

        // récupérer le nom de la cellule
        const cellName = currentCell.dataset.cellname;

        if (cellName) {
            // on test uniquement la récupération / utilisation de données via le dataset
            // il y aurait de la logique à ajouter derrière
            game.sendMissile(cellName);
        } else {

            // récupérer les index en fonction d'une cellule
            const cellIndexes = grid.getCellIndexesFromId(currentCell.id)
        
            // ici on pourra incrémenter notre compteur de tour.
            game.turnCounter++;

            const imgElement = document.createElement('img');
            if (game.sendMissileAt(cellIndexes['rowIndex'], cellIndexes['colIndex'])) {
                // ajouter un message de réussite
                // l'afficher
                stats.addActionToList('réussi ' + currentCell.id);

                game.nbHit++;
                imgElement.src = './img/flames.gif';
                imgElement.alt = 'Flames';
            } else {
                // ajouter un message d'erreur
                const message = 'tata';
                stats.addActionToList('raté ' + currentCell.id);

                game.nbPlouf++;
                imgElement.src = './img/water.gif';
                imgElement.alt = 'Missed => water';
            }
            // si la div est vide
            if (currentCell.innerHTML.trim() === '') {
                currentCell.appendChild(imgElement);
            }
        }
        if (game.checkGameOver()) {
            const endTime = Date.now();
            // console.log(game.startTime);
            // console.log(endTime);
            const malusTime = Math.floor((endTime - game.startTime) / 1000) * 1000;
            // console.log(malusTime);
            score.score -= malusTime;
            window.alert('partie terminé \r\n Votre score : ' + score.score );


            // on enregistre le score dans l'historique
            userName = document.querySelector('#username').value;
            score.addBestScore('nom du joueur', score.score)

            // on pourrait enlever les écouteurs de click sur les cellules !
            // pour relancer une nouvelle partie : app.init() et hop les écouteurs sont la de nouveau !
        }

    },
    handleFormSubmit: function (evt) {
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
        if (grid.checkValueIsCorrect(inputElValue)) {

            // ici on pourra incrémenter notre compteur de tour.
            game.turnCounter++;

            if (game.sendMissile(inputElValue)) {
                // ajouter un message de réussite
                // l'afficher
                stats.addActionToList('réussi ' + inputElValue);

                game.nbHit++;
            } else {
                // ajouter un message d'erreur
                const message = 'tata';
                stats.addActionToList('raté ' + inputElValue);

                game.nbPlouf++;
            }

            // on vide l'input du formulaire
            formWithListener.querySelector('#cellToHit').value = '';
        } else {
            // sinon afficher un message d'erreur
            console.error('La saisie n est pas valide');
        }

        game.updateTurnDisplay();
    },
    handleHistoryButtonClick: function (evt) {
        console.log('affichage de l\'historique');

        // afficher / cacher la div#actions
        const actionDiv = document.querySelector('#actions');

        if (actionDiv.style.display == 'block') {
            actionDiv.style.display = 'none';
        } else {
            actionDiv.style.display = 'block';
        }

    },
    handleSelectNameFormSubmit: function (evt) {
        evt.preventDefault();

        game.init();
        // récupérer le nom et l'ajouter dans le span du jeu
        document.querySelector('#game .username').innerText = document.querySelector('#username').value;

        // cacher la div #beforegame
        document.querySelector('#beforegame').classList.add('hidden');

        // afficher la div #game
        document.querySelector('#game').classList.remove('hidden');
    },
    handleStatButtonClick: function () {
        console.log('affichage des stats');
        // calculer le pourcentage de tir réussi
        const percentHit = 100 * game.nbHit / (game.nbHit + game.nbPlouf);
        // calculer le pourcentage de tir ratés
        const percentMiss = 100 * game.nbPlouf / (game.nbHit + game.nbPlouf);
        // afficher ces pourcentage

        // générons la chaine que l'on va afficher
        // \r\n permet de faire un retour à la ligne dans le texte généré
        let message = 'Réussite : ' + Math.round(percentHit) + '% \r\n';
        message += 'Echec : ' + Math.round(percentMiss) + '% \r\n';
        message += 'Nombre de tirs : ' + (game.nbHit + game.nbPlouf);

        window.alert(message);
    },
    handleThemeChange: function(evt) {
        // récupérer le nom du theme choisit
        const selectedTheme = evt.currentTarget.value;
        console.log(selectedTheme);

        app.applyNewTheme(selectedTheme);

        // enregistrer la valeur sélectionnée dans un cookie
        // on en profite pour donner une durée de vie (en secondes) au cookie
        document.cookie = 'battleship-theme=' + selectedTheme + ';max-age=' + (60 * 60 * 24 * 365);
    }
}

// lorsque la page est chargée, on initialise notre application
document.addEventListener('DOMContentLoaded', app.init);
