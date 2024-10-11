document.addEventListener("DOMContentLoaded", (event) => {
    const socket = io();

    socket.on("newPost", function (post) {
        ajouterPublicationAPage(post);
    });

    function ajouterPublicationAPage(post) {
        const conteneurPublications = document.getElementById(
            "conteneurPublications",
        );
        const conteneurPublication = document.createElement("div");
        conteneurPublication.className = "publication-conteneur";

        const conteneurPhoto = document.createElement("div");
        conteneurPhoto.className = "photo-conteneur";

        const photoDiv = document.createElement("div");
        photoDiv.className = "photo";

        const photoImg = document.createElement("img");
        // Eric, ici je déplace l'image d'accueil à la publication
        const userImage = localStorage.getItem("userImage");
        if (userImage) {
            photoImg.src = userImage;
        } else {
            photoImg.src = "/Paul/Pièce jointe/profile.png";
        }

        const photoLink = document.createElement("a");
        photoLink.href = "/Eric/HTML/profile.html";
        photoLink.appendChild(photoImg);

        photoDiv.appendChild(photoLink);
        conteneurPhoto.appendChild(photoDiv);

        const nouvellePublication = document.createElement("div");
        nouvellePublication.className = "publication";

        const publicationDiv = document.createElement("div");
        publicationDiv.className = "publications";

        const pseudoSpan = document.createElement("span");
        pseudoSpan.className = "pseudo-style";
        pseudoSpan.textContent = post.pseudo || "Anonyme";

        const contenuSpan = document.createElement("span");
        contenuSpan.textContent = ` ${post.contenu}`;
        contenuSpan.style.wordWrap = "break-word";

        publicationDiv.appendChild(pseudoSpan);
        publicationDiv.appendChild(contenuSpan);

        const boutonSignaler = document.createElement("button");
        boutonSignaler.className = "bouton-signalement";
        const signalementImg = document.createElement("img");
        signalementImg.src = "/Paul/Pièce jointe/croix.png";
        boutonSignaler.appendChild(signalementImg);
        boutonSignaler.addEventListener("click", function () {
            document.getElementById("formulaireSignalement").style.display =
                "block";
            publicationActuelle = conteneurPublication;
        });

        const boutonAfficher = document.createElement("button");
        boutonAfficher.className = "bouton-afficher";
        boutonAfficher.textContent = "Afficher la publication";
        boutonAfficher.addEventListener("click", function () {
            publicationDiv.classList.remove("blur");
            boutonAfficher.style.display = "none";
        });

        conteneurPublication.appendChild(conteneurPhoto);
        conteneurPublication.appendChild(nouvellePublication);
        nouvellePublication.appendChild(publicationDiv);
        conteneurPublication.appendChild(boutonSignaler);
        conteneurPublication.appendChild(boutonAfficher);

        conteneurPublications.insertBefore(
            conteneurPublication,
            conteneurPublications.firstChild,
        );

        setTimeout(function () {
            nouvellePublication.classList.add("active");
        }, 0);
    }

    document
        .getElementById("boutonPublication")
        .addEventListener("click", publierPublication);
    document
        .getElementById("contenuPublication")
        .addEventListener("keydown", function (event) {
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                publierPublication();
            }
        });

    document
        .getElementById("boutonHautPage")
        .addEventListener("click", function (event) {
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        });

    document
        .getElementById("boutonContact")
        .addEventListener("click", function (event) {
            event.preventDefault();
            document.getElementById("formulaireContact").style.display =
                "block";
        });

    document
        .getElementById("fermerFormulaireContact")
        .addEventListener("click", function () {
            document.getElementById("formulaireContact").style.display = "none";
        });

    document
        .getElementById("fermerFormulaireSignalement")
        .addEventListener("click", function () {
            document.getElementById("formulaireSignalement").style.display =
                "none";
        });

    document
        .getElementById("raisonSignalement")
        .addEventListener("change", function () {
            if (this.value === "autre") {
                document.getElementById("autreRaisonConteneur").style.display =
                    "block";
                document.getElementById("effacerAutreRaison").style.display =
                    "inline-block";
            } else {
                document.getElementById("autreRaisonConteneur").style.display =
                    "none";
                document.getElementById("effacerAutreRaison").style.display =
                    "none";
            }
        });

    document
        .getElementById("envoyerFormulaireContact")
        .addEventListener("click", function () {
            if (validerFormulaireContact()) {
                afficherNotification("Votre message a été transmis");
                document.getElementById("formulaireContact").style.display =
                    "none";
                document.getElementById("formulaireContact").reset();
            } else {
                alert(
                    "Veuillez remplir tous les champs avant d'envoyer le formulaire de contact.",
                );
            }
        });

    document
        .getElementById("envoyerFormulaireSignalement")
        .addEventListener("click", function () {
            if (validerFormulaireSignalement()) {
                afficherNotification("Le signalement a été transmis");
                document.getElementById("formulaireSignalement").style.display =
                    "none";
                document.getElementById("formulaireSignalement").reset();
                document.getElementById("autreRaisonConteneur").style.display =
                    "none";
                document.getElementById("effacerAutreRaison").style.display =
                    "none";
                marquerPublicationCommeSignalee(publicationActuelle);
            } else {
                alert("Veuillez sélectionner une raison pour le signalement.");
            }
        });

    document
        .getElementById("effacerAutreRaison")
        .addEventListener("click", function () {
            document.getElementById("autreRaison").value = "";
        });

    let publicationActuelle;

    function publierPublication() {
        const contenuPublication =
            document.getElementById("contenuPublication").value;
        const pseudo = localStorage.getItem("userPseudo") || "Anonyme";
        if (contenuPublication.trim() !== "") {
            fetch("/posts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contenu: contenuPublication,
                    pseudo: pseudo,
                }),
            })
                .then((response) => {
                    if (response.ok) {
                        document.getElementById("contenuPublication").value =
                            "";
                        jouerSonPublication(); // Jouer le son lors de la publication
                    } else {
                        alert("Erreur lors de la création du post");
                    }
                })
                .catch((error) => {
                    console.error("Erreur lors de la création du post:", error);
                    alert("Erreur lors de la création du post");
                });
        } else {
            alert("Le contenu du post ne peut pas être vide.");
        }
    }

    function marquerPublicationCommeSignalee(conteneurPublication) {
        const publicationDiv =
            conteneurPublication.querySelector(".publications");
        const boutonAfficher =
            conteneurPublication.querySelector(".bouton-afficher");
        publicationDiv.classList.add("blur");
        boutonAfficher.style.display = "flex"; // Ensure the button is displayed as flex to center its content
    }

    function afficherNotification(message) {
        const notification = document.getElementById("notification");
        notification.textContent = message;
        notification.style.display = "block";
        setTimeout(function () {
            notification.style.display = "none";
        }, 3000);
    }

    function validerFormulaireContact() {
        const nom = document.getElementById("nom").value.trim();
        const email = document.getElementById("email").value.trim();
        const sujet = document.getElementById("sujet").value.trim();
        const probleme = document.getElementById("probleme").value.trim();
        return nom !== "" && email !== "" && sujet !== "" && probleme !== "";
    }

    function validerFormulaireSignalement() {
        const raison = document.getElementById("raisonSignalement").value;
        if (raison === "autre") {
            const autreRaison = document
                .getElementById("autreRaison")
                .value.trim();
            return autreRaison !== "";
        }
        return raison !== "";
    }

    // Fonction pour jouer le son lors de la publication
    function jouerSonPublication() {
        const audio = document.getElementById("publicationSound");
        audio.play();
    }
});

function previewFile() {
    const preview = document.getElementById("profile");
    const file = document.getElementById("import").files[0];
    const reader = new FileReader();

    reader.addEventListener(
        "load",
        function () {
            preview.src = reader.result;
            localStorage.setItem("userImage", reader.result);
        },
        false,
    );

    if (file) {
        reader.readAsDataURL(file);
    }
}

function displayProfileInfo() {
    const userImage = localStorage.getItem("userImage");
    const imageElement = document.getElementById("profile");
    if (userImage) {
        imageElement.src = userImage;
    }
}

window.onload = displayProfileInfo;
