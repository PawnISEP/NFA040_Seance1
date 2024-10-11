// Post.js
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    contenu: { type: String, required: true },
    pseudo: { type: String, default: "Anonyme" },
    creeLe: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Post", postSchema);
