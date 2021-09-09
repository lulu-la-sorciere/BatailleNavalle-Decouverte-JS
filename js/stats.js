const stats = {
    init: function () {

    },

    displayHits: function () {
        const hitElements = document.querySelectorAll('.hit');

        // On va afficher dans la console les éléments touchés, sous ce format là : 
        // cell01, cell03, cell15, cell45
        // On prépare un tableau pour stocker les id de toutes les cases touchées
        let hits = [];

        // On boucle sur chaque cellule qui ont les classe 'hit'
        for (cellElement of hitElements) {

            // On insère leurs id dans le tableau hit
            hits.push(cellElement.id);
        }

        console.log('Les cellules touchées sont : ' + hits.join(', '));
    },

    /* ajoute le préfixe avec le numéro du tour au message et l'affiche en haut de la div#actions */
    addActionToList: function (message) {
        // préfixer le message avec le numéro du tour

        message = '<div>Tour #' + (game.turnCounter - 1) + ' : ' + message + '</div>';
        // ajouter le message complet à la div
        const actionDiv = document.querySelector('#actions');
        // pour ajouter le texte au début on remplace tout le contenu par le nouveau message + l'historique de messages existant
        actionDiv.innerHTML = message + actionDiv.innerHTML;
        // actionDiv.prepend(message); // @mathieu
    }

}