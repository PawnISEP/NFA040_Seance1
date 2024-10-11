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

function savePseudo() {
    const pseudo = document.getElementById("pseudo").value.trim() || "Anonyme";
    localStorage.setItem("userPseudo", pseudo);
    location.href = "/Paul/HTML/publication.html";
}
