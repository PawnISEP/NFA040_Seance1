const fs = require("fs");
const mongoose = require("mongoose");
const Insult = require("../Serveur/Insult"); // Chemin

// Lire les insultes à partir d'une base de données
const insultsData = fs
  .readFileSync(__dirname + "/../Txt/insultes.txt", "utf-8") // Chemin
  .split("\n")
  .map((mot) => mot.trim())
  .filter((mot) => mot.length > 0)
  .map((mot) => ({ mot }));

const uri =
  "mongodb+srv://Paul:Pkmmlt08TNyxccbo@projetwebserveur.2lp0qwi.mongodb.net/?retryWrites=true&w=majority&appName=ProjetWebServeur";
mongoose
  .connect(uri)
  .then(async () => {
    console.log("Connecté à MongoDB");
    try {
      await Insult.insertMany(insultsData, { ordered: false });
      console.log("Insultes importées avec succès");
    } catch (err) {
      console.error(
        "Certaines insultes ont été ignorées en raison de doublons",
      );
    }
    process.exit(0);
  })
  .catch((err) => {
    console.error("Erreur de connexion à MongoDB", err);
    process.exit(1);
  });

//node node public/Paul/JS/importInsults.js
