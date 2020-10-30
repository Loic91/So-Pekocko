//ROUTES D'AUTHENTIFICATION

const express = require("express"); //On a besoin d'Express afin de créer un "routeur".
const router = express.Router(); //On crée le routeur ici avec la fonction "Router()" d'Express.
const userCtrl =require('../controllers/user'); //C'est le controlleur pour associer les fonctions aux différentes routes.

//Ici on crée 2 routes
//Ce sont des routes POST car le fronted va également envoyer des informations (Il enverra l'adresse mail et la mot de passe).
router.post('/signup',userCtrl.signup);
router.post('/login',userCtrl.login);

module.exports = router; //On exporte ce routeur.
