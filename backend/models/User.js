//ICI ON STOCKE LES DOCUMENTS UTILISATEURS DANS NOTRE BASE DE DONNEES.
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator"); 

//MODELE DES USERS
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true }, 
  password: { type: String, required: true }, 
});

//Plugin pour garantir un email unique
userSchema.plugin(uniqueValidator); 


module.exports = mongoose.model("User", userSchema); 