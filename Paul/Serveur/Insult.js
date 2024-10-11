const mongoose = require("mongoose");

// Définition du schéma pour les insultes
const insultSchema = new mongoose.Schema({
  mot: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("Insult", insultSchema);
