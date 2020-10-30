//Pour réimplémenter la logique des routes POST, nous devons toutes les importer depuis le contrôleur stuff.
//Nous voyons clairement quelles routes sont disponibles et à quels points de terminaison, et les noms descriptifs donnés aux fonctions de notre contrôleur permettent de mieux comprendre la fonction de chaque route.
const express = require("express");
const router = express.Router();
const sauce = require('../controllers/sauce');

//Import du middleware auth pour sécuriser les routes
const auth = require('../middleware/auth');
//Import du middleware multer pour la gestion des images
const multer = require('../middleware/multer_config');

//Ici on importe le middleware qui gère les fichiers entrant et on l'ajoute à la route POST ci-dessous (Toujours APRES le middleware d'authentification "auth").
//On l'ajoute à PUT pour permettre la modification d'article.

//router.post('/', auth, sauce.ANALYSE);
router.put('/:id', auth, multer, sauce.update)
router.delete('/:id', auth, sauce.delete);

router.post('/', auth, multer, sauce.create);
router.get('/', auth, sauce.list);
router.get('/:id', auth, sauce.OneSauce);
router.post('/:id/like', auth, sauce.likeSauce);

module.exports = router;
