const mongoose = require("mongoose");

// Définition du schéma pour les utilisateurs
const userSchema = new mongoose.Schema({
    nomUtilisateur: { type: String, required: true, unique: true },
    motDePasse: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);
