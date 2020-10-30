//PACKAGE FILE SYSTEM POUR MODIFIER LE SYSTEME DE DONNEE POUR LA FONCTION DELETE
const fs = require('fs'); //On importe "fs" du package Node, pour accéder au système de fichier qui permettra la supression d'éléments (ligne 64).

//IMPORT DU MODELE DE LA SAUCE
const Sauce = require("../models/Sauce"); //Ici nous importons notre modèle Mongoose du fichier "sauce.js"

//CREATION D'UNE SAUCE
//"exports" est un objet, on peut y attacher des propriétés ou des méthodes. Ici nous avons attaché la propriété "getOneSauce" à "exports".
//https://www.tutorialsteacher.com/nodejs/nodejs-module-exports
//Ici, nous exposons la logique de notre route POST en tant que fonction appelée "createSauce()" .
exports.create = (req, res, next) => {
  const sauceObjet = JSON.parse(req.body.sauce); //Ici on transforme notre chaine de caractère en objet
  const sauce = new Sauce({
    ...sauceObjet,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  }); //On crée l'URL de l'image car le "fronted" ne le connait puisque c'est le middleware "multer" qui générer ce fichier.
  //"req.protocol" : http ou https - "req.get('host')" : récupère le host de notre serveur, dans notre cas c'est localhost:3000 mais cela peut être la racine de notre serveur - "req.file.filename" : le nom du fichier.
  sauce
    .save()
    .then((sauce) => {
      res.status(201).json({ sauce });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

//MODIFICATION D'UNE SAUCE
exports.update = (req, res, next) => {
  const sauceObject = req.file ?
  //Ici on fait un test pour savoir dans quel cas de figure on se trouve. Si il y a une nouvelle image il y aura un "req.file ?".
  //Si l'image existe il y aura ce type d'objet :
    {
      ...JSON.parse(req.body.sauce), //Si on trouve un fichier, on récupère la chaine de caractère et on la "parse" en objet et on modifie l'image URL.
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body }; //On prend le corps de la requête.
    //Nous exploitons la méthode "updateOne()" dans notre modèle Sauce. Cela permet de mettre à jour le sauce qui correspond à l'objet que nous passons comme premier argument. Nous utilisons aussi le paramètre "id" passé dans la demande et le remplaçons par le Sauce passé comme second argument.
  if (req.file) {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
            .then(() => { res.status(200).json({ message: 'Sauce mise à jour!' }); })
            .catch((error) => { res.status(400).json({ error }); });
        })
      })
      .catch((error) => { res.status(500).json({ error }); });

  } else {
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Sauce mise à jour!' }))
      .catch((error) => res.status(400).json({ error }));
  }
};

//RECUPERATION DE TOUTES LES SAUCES
exports.list = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

//RECUPERE UNE SAUCE UNIQUE PAR L'ID
//On utilise la méthode "findOne()" dans notre modèle Sauce pour trouver la Sauce unique ayant le même _id que le paramètre de la requête.
exports.OneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    //Si aucun Sauce n'est trouvé ou si une erreur se produit, nous envoyons une erreur 404 au front-end, avec l'erreur générée.
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

//SUPPRIME UNE SAUCE
//La méthode "deleteOne()" fonctionne comme "findOne()" et "updateOne()" dans le sens où nous lui passons un objet correspondant au document à supprimer. Nous envoyons ensuite une réponse de réussite ou d'échec au front-end.
exports.delete = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) //On va chercher le fichier pour avoir l'URL de l'image (ID du cours est : _id) comme ça on aura accès au nom du fichier à supprimer. On veut trouver celui qui a l'ID des paramètres de la requêtes.
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1]; //Dans ce callback on récupère un "sauce" et avec ce "sauce" on veut récupérer le nom du fichier.
      //Pour extraire ce fichier on crée la constante "filename" et puisque on sait que l'"imageUrl" aura une partie "/images/" donc peut "split" cette chaine de caractère  ce qui va retourner un tableau de 2 éléments : ce qui vient "/images/" et ce qui vient après. Donc c'est le nom du fichier : "[1]"
      fs.unlink(`images/${filename}`, () => { 
        //nous utilisons ensuite la fonction "unlink" du package "fs" pour supprimer ce fichier, en lui passant le fichier à supprimer et le callback à exécuter une fois ce fichier supprimé.
        //Et dans le callback, nous implémentons la logique d'origine :
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

//LIKE SAUCE
exports.likeSauce = (req, res, next) => {
  switch (req.body.like) {
    //cancel = 0
    //check if the user had liked or disliked the sauce
    //uptade the sauce, send message/error
    case 0:
      Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
          if (sauce.usersLiked.find(user => user === req.body.userId)) {
            Sauce.updateOne({ _id: req.params.id }, {
              $inc: { likes: -1 },
              $pull: { usersLiked: req.body.userId },
              _id: req.params.id
            })
              .then(() => { res.status(201).json({ message: 'Ton avis a été pris en compte!' }); })
              .catch((error) => { res.status(400).json({ error: error }); });

          } if (sauce.usersDisliked.find(user => user === req.body.userId)) {
            Sauce.updateOne({ _id: req.params.id }, {
              $inc: { dislikes: -1 },
              $pull: { usersDisliked: req.body.userId },
              _id: req.params.id
            })
              .then(() => { res.status(201).json({ message: 'Ton avis a été pris en compte!' }); })
              .catch((error) => { res.status(400).json({ error: error }); });
          }
        })
        .catch((error) => { res.status(404).json({ error: error }); });
      break;
    //likes = 1
    //uptade the sauce, send message/error
    case 1:
      Sauce.updateOne({ _id: req.params.id }, {
        $inc: { likes: 1 },
        $push: { usersLiked: req.body.userId },
        _id: req.params.id
      })
        .then(() => { res.status(201).json({ message: 'Ton like a été pris en compte!' }); })
        .catch((error) => { res.status(400).json({ error: error }); });
      break;
    //likes = -1
    //uptade the sauce, send message/error
    case -1:
      Sauce.updateOne({ _id: req.params.id }, {
        $inc: { dislikes: 1 },
        $push: { usersDisliked: req.body.userId },
        _id: req.params.id
      })
        .then(() => { res.status(201).json({ message: 'Ton dislike a été pris en compte!' }); })
        .catch((error) => { res.status(400).json({ error: error }); });
      break;
    default:
      console.error('not today : mauvaise requête');
  }
};