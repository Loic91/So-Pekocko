const fs = require('fs');

//IMPORT DU MODELE DE LA SAUCE
const Sauce = require("../models/Sauce");

//CREATION D'UNE SAUCE
exports.create = (req, res, next) => {
  const sauceObjet = JSON.parse(req.body.sauce); 
  const sauce = new Sauce({
    ...sauceObjet,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
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
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body }; 
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
exports.OneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

//SUPPRIME UNE SAUCE
exports.delete = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) 
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1]; 
      fs.unlink(`images/${filename}`, () => { 
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
    //vérifie si l'utilisateur a Liké ou disLiké la sauce
    case 0:
      Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
          if (sauce.usersLiked.find(user => user === req.body.userId)) { 
            Sauce.updateOne({ _id: req.params.id }, {
              $inc: { likes: -1 }, 
              $pull: { usersLiked: req.body.userId }, 
              _id: req.params.id
            })
              .then(() => { res.status(201).json({ message: 'Votre avis a bien été pris en compte!' }); })
              .catch((error) => { res.status(400).json({ error: error }); });

          } if (sauce.usersDisliked.find(user => user === req.body.userId)) {
            Sauce.updateOne({ _id: req.params.id }, {
              $inc: { dislikes: -1 },
              $pull: { usersDisliked: req.body.userId },
              _id: req.params.id
            })
              .then(() => { res.status(201).json({ message: 'Votre avis a bien été pris en compte!' }); })
              .catch((error) => { res.status(400).json({ error: error }); });
          }
        })
        .catch((error) => { res.status(404).json({ error: error }); });
      break;
    //likes = 1
    //met à jour la sauce, envoyer un message / erreur
    case 1:
      Sauce.updateOne({ _id: req.params.id }, {
        $inc: { likes: 1 },
        $push: { usersLiked: req.body.userId },
        _id: req.params.id
      })
        .then(() => { res.status(201).json({ message: 'Votre like a été pris en compte!' }); })
        .catch((error) => { res.status(400).json({ error: error }); });
      break;
    //likes = -1
    //met à jour la sauce, envoyer un message / erreur
    case -1:
      Sauce.updateOne({ _id: req.params.id }, {
        $inc: { dislikes: 1 },
        $push: { usersDisliked: req.body.userId },
        _id: req.params.id
      })
        .then(() => { res.status(201).json({ message: 'Votre dislike a été pris en compte!' }); })
        .catch((error) => { res.status(400).json({ error: error }); });
      break;
    default:
      console.error('La requête est mauvaise');
  }
};