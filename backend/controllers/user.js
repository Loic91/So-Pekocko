//CREATION OU CONNECTION DES UTILISATEURS

const bcrypt = require("bcrypt"); //On insctalle le package "bcrypt" via NPM et on l'importe ici.
const jwt = require("jsonwebtoken");

const User = require("../models/User"); //On récupère notre modèle User car on va enregistrer et lire des Users dans ces middlewares.

//La fonction "signup" pour l'enregistrement de nouveaux utilisateurs.
exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10) //On "Hash" le mot de passe. Il s'agit d'une fonction asynchrone (qui peut donc prendre du temps)
    .then((hash) => { //Ici on récupère le hash du mot de passe
      const user = new User({ //On l'enregistre dans un nouveau User qu'on enregistre dans la base données.
        email: req.body.email, //On enregistre l'adresse email qui est définit par l'utilisateur dans le corps de la requête.
        password: hash, //Concernant le mot de passe, on enregistrera que le hash (le cryptage) du mot de passe.
      });
      user
        .save() //On utilise la méthode "save()" pour enregistrer dans la base données.
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

//La fonction "login" pour connecter les utilisateurs existants.
exports.login = (req, res, next) => { //La fonction "login" permet au utilisateurs de se connecter à l'application.
  User.findOne({ email: req.body.email }) //La méthode "findOne()" permet de trouver le User dans la base de données qui correspond à l'adresse mail qui est rentrée qui est rentrée par le User. "findOne()" est ici une fonction asynchrone.
    .then((user) => {
      if (!user) { //Si on ne trouve pas de User on retourne un statut 401 dans laquelle on crée notre propre erreur avec une phrase.
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      //Si on trouve un User, on arrive alors à cette ligne.
      bcrypt
        .compare(req.body.password, user.password) //On utilise "bcrypt" pour comparer le mot de passe envoyé par l'utilisateur qui assaie de se connecter. On utilise la fonction "compare" pour comparer la mot de passe qui est envoyé avec la requête avec le Hash qui est enregistré avec le User (le document "user"). C'est une fonction asynchrone, retourne donc une Promise :
        .then((valid) => { //Dans le .then on reçoit un boolean pour saviur si la comparaison est valable ou non.
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          //On arrive ici si la comparaison a retournée "true"
          res.status(200).json({ //On renvoie un status 200 pour indiquer que la connexion est bonne.
            //On renvoie un objet JSON qui contient :
            userId: user._id,
            token: jwt.sign({ userId: user._id }, 'udl*VFMnxp5Crly-({', {
              expiresIn: "24h",
            }),
          });
        })
        //Ici le catch ne sert pas à dire si le User n'a pas été trouver, mais plutôt, Mongoose nous renvoi une erreur uniquement si il y a un problème avec la base de données 
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
