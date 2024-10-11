document.addEventListener("DOMContentLoaded", (event) => {
    const scrollTopButton = document.getElementById("scrollTopButton");
    const contactButton = document.getElementById("contactButton");
    const contactForm = document.getElementById("contactForm");
    const closeContactFormButton = document.getElementById("closeContactForm");
    const notification = document.getElementById("notification");


    scrollTopButton.addEventListener("click", function (event) {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
    });


    contactButton.addEventListener("click", function (event) {
        event.preventDefault();
        contactForm.style.display = "block";
    });


    closeContactFormButton.addEventListener("click", function (event) {
        event.preventDefault();
        contactForm.style.display = "none";
    });


    document
        .getElementById("submitContactForm")
        .addEventListener("click", function () {
            if (validerFormulaireContact()) {
                afficherNotification("Votre message a été transmis");
                contactForm.style.display = "none";
                document.getElementById("contactFormElement").reset();
            } else {
                alert(
                    "Veuillez remplir tous les champs avant d'envoyer le formulaire de contact.",
                );
            }
        });

    function afficherNotification(message) {
        notification.textContent = message;
        notification.classList.add("show");
        setTimeout(function () {
            notification.classList.remove("show");
            notification.classList.add("hide");
            setTimeout(function () {
                notification.classList.remove("hide");
                notification.style.display = "none";
            }, 500); // correspond au délai de la transition
        }, 3000); // affichage de 3 secondes
    }

    function validerFormulaireContact() {
        const nom = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const sujet = document.getElementById("subject").value.trim();
        const probleme = document.getElementById("problem").value.trim();
        return nom !== "" && email !== "" && sujet !== "" && probleme !== "";
    }
});
