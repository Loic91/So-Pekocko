const express = require('express'); //On importe Express dans une constante en utilisant la commande "require"
const bodyParser = require('body-parser'); //Le package "body-parser" installé précemment à l'aide de "npm" permet d'extraire l'objet JSON de la demande, et donc, de gérer la demande POST provenant de l'application front-end.
const mongoose = require('mongoose');
const path = require('path'); //L'importation de "path" nous donne accès au chemin de notre système de fichier 

const sauceRoutes = require('./route/sauce');
const userRoutes = require('./route/user'); //On importe le routeur pour les connexions et inscriptions utilisateurs.

const app = express(); //Ici on appelle la méthode Express qui permet de créer une application Express
// const Sauce = require('./models/Sauce');

//Connection de l'API à notre cluster MongoDB
mongoose.connect('mongodb+srv://loic_91:Kiyammonfilsdamour2015@cluster0.ijazw.mongodb.net/<dbname>?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//Utilisation de la méthode "app.use()". On lui ajoute en argument une fonction qui lui permet de recevoir la requête et la réponse.
//la fonction "next" permet de renvoyer à la prochaine fonction l'exécution du serveur.
//La méthode "response.setHeader(nom, valeur)" est une interface de programmation d'application intégrée du module 'http' qui définit une valeur d'en-tête unique pour les en-têtes implicites. Elle ne renvoie aucune valeur, ell définit plutôt un en-tête.
//https://www.geeksforgeeks.org/node-js-response-setheader-method/
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); //Permet  d'accéder à notre API depuis n'importe quelle origine ( '*' );
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); //Permet d'ajouter les headers mentionnés aux requêtes envoyées vers notre API (Origin , X-Requested-With , etc.);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); //Permet d'envoyer des requêtes avec les méthodes mentionnées ( GET ,POST , etc.).
  next(); //Pour passer au prochain "middleware", il faut appeler "next" pour renvoyer la "réponse" et terminer la "requête".
});

app.use(bodyParser.json()); //Ici on définit la fonction "json" comme middleware global pour notre application, juste après avoir défini les headers de la réponse.

app.use('/images', express.static(path.join(__dirname, 'images'))); //Ici on répond aux requêtes envoyées à "/images" et puisqu'on veut qu'il serve le dossier "statique" images, on utilise "express.static".
//Cela ne suffit pas pour avoir le chemin exact, alors on fait une nouvelle importation de "node" : "path" (ligne 4)

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes); //C'est la racine pour tout ce qui est des routes liées à l'authentification.

module.exports = app; //Ici on exporte notre appication Express (ou plutôt la constante "app") pour qu'on puisse y accéder depuis les autres fichiers du projet, notamment le serveur Node.