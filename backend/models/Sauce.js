const mongoose = require('mongoose');


//MODELE DES SAUCES
//Ici nous utilisons la méthode Schema mise à disposition par Mongoose.
//Cette méthode nous permet de créer un schéma de données qui contient les champs souhaités pour chaque Sauce, indique leur type ainsi que leur caractère (obligatoire ou non).
// Pas besoin de mettre un champ pour l'Id puisqu'il est automatiquement généré par Mongoose.
const sauceSchema = mongoose.Schema({
    userId: {type: String, required: true},
    name: {type: String, required: true},
    manufacturer: {type: String, required: true},
    description: {type: String, required: true},
    mainPepper: {type: String, required: true},
    imageUrl: {type: String, required: true},
    heat: {type: Number, required: true},
    likes: {type: Number, required: false, default:0},
    dislikes: {type: Number, required: false, default:0},
    usersLiked: {type: [String], required: false},
    usersDisliked: {type: [String], required: false},
});

//Ensuite, nous exportons ce schéma en tant que modèle Mongoose appelé « Sauce », le rendant par là même disponible pour notre application Express.
module.exports = mongoose.model('Sauce', sauceSchema);

//Ce modèle permet non seulement d'appliquer notre structure de données, mais aussi de simplifier les opérations de lecture et d'écriture dans la base de données.