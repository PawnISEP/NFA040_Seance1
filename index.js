const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const User = require("./public/Paul/Serveur/User");
const Post = require("./public/Paul/Serveur/Post");
const Insult = require("./public/Paul/Serveur/Insult");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const serveur = http.createServer(app);
const io = new Server(serveur);

app.use(bodyParser.json());
app.use(express.static("public"));

// Remplacez par la chaîne de connexion directe obtenue de MongoDB Atlas
const uri =
  "mongodb+srv://Paul:Pkmmlt08TNyxccbo@projetwebserveur.2lp0qwi.mongodb.net/?retryWrites=true&w=majority&appName=ProjetWebServeur";
mongoose
  .connect(uri)
  .then(() => {
    console.log("Connecté à MongoDB");
  })
  .catch((err) => {
    console.error("Erreur de connexion à MongoDB", err);
  });

// Route pour l'inscription
app.post("/register", async (req, res) => {
  const { nomUtilisateur, motDePasse } = req.body;
  console.log("Inscription de l'utilisateur:", nomUtilisateur);
  const utilisateur = new User({ nomUtilisateur, motDePasse });
  try {
    await utilisateur.save();
    res.status(201).send("Utilisateur enregistré");
  } catch (error) {
    res.status(400).send("Erreur lors de l'inscription: " + error.message);
  }
});

// Route pour la connexion
app.post("/login", async (req, res) => {
  const { nomUtilisateur, motDePasse } = req.body;
  console.log("Connexion de l'utilisateur:", nomUtilisateur);
  const utilisateur = await User.findOne({ nomUtilisateur, motDePasse });
  if (utilisateur) {
    res.status(200).send("Connexion réussie");
  } else {
    res.status(401).send("Identifiants invalides");
  }
});

// Route pour créer un post
app.post("/posts", async (req, res) => {
  const { contenu, pseudo } = req.body;

  // Vérifier si le contenu contient des insultes
  const motsContenus = contenu.split(" ");

  try {
    const insultes = await Insult.find({ mot: { $in: motsContenus } });
    if (insultes.length > 0) {
      console.log(
        "Mots interdits trouvés:",
        insultes.map((insulte) => insulte.mot),
      );
      return res.status(400).send("Le contenu contient des mots interdits.");
    }

    const post = new Post({ contenu, pseudo: pseudo || "Anonyme" });
    await post.save();
    io.emit("newPost", post); // Émettre l'événement newPost à tous les clients connectés
    res.status(201).send("Post créé");
  } catch (error) {
    console.error("Erreur lors de la création du post:", error);
    res
      .status(400)
      .send("Erreur lors de la création du post: " + error.message);
  }
});

// Route pour récupérer tous les posts
app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find().sort({ creeLe: -1 }); // Trier par date de création décroissante
    res.status(200).json(posts);
  } catch (error) {
    console.error("Erreur lors de la récupération des posts:", error);
    res
      .status(400)
      .send("Erreur lors de la récupération des posts: " + error.message);
  }
});

// Gestion des connexions Socket.IO
io.on("connection", (socket) => {
  console.log("un utilisateur est connecté");
  socket.on("disconnect", () => {
    console.log("utilisateur déconnecté");
  });
});

// Démarrage du serveur
serveur.listen(3000, () => {
  console.log("Le serveur fonctionne sur le port 3000");
});
