//ICI ON STOCKE LES DOCUMENTS UTILISATEURS DANS NOTRE BASE DE DONNEES.

const mongoose = require("mongoose"); //On importe Mongoose
const uniqueValidator = require("mongoose-unique-validator"); //Pour éviter des erreurs illisibles venant de MongoDB, on utilise le package qu'on installe via NPM. Et rajoute ce validateur comme plugin à notre schéma.



//MODELE DES USERS
//On crée notre schéma à l'aide de la fonction schema() dans laquelle on stocke les informations souhaitées
const userSchema = mongoose.Schema({
  //L'email doit être unique
  email: { type: String, required: true, unique: true }, //On utilise la configuration "unique" pour qu'il soit impossible de s'inscrire plusieurs fois avec la même adresse mail.
  password: { type: String, required: true }, //Le mot de passe crypté sera un "Hash", mais ce Hash sera tout de même un string.
});

//Plugin pour garantir un email unique
userSchema.plugin(uniqueValidator); //Ici on applique le validateur au schéma avant d'en faire un modèle.


module.exports = mongoose.model("User", userSchema); //On exporte ce schéma sous forme de modèle en utilisant la fonction "model()" de Mongoose. Le modèle s'appelle "User" et on lui passe "userSchema" comme schéma de données.
