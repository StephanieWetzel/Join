


async function init(activeSection) {
    loadLocalStorageLoggedInUser('loggedInUser');
    await includeHTML();
    markActiveSection(activeSection);
    setHeaderInitials(logInUser);
}


document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchInput');
    const searchImg = document.getElementById('searchImg');
    let inputFilled = false;

    function toggleInputContent() {
        if (inputFilled) {
            searchInput.value = '';
            inputFilled = false;
        } else {
            searchInput.value = 'Website';
            inputFilled = true;
        }
    }

    searchImg.addEventListener('click', toggleInputContent);
});


function openModal() {
    const modal = document.getElementById("myModal");
    const modalContent = document.querySelector(".modal-content");

    // Hier wird der Inhalt des Templates in das Modal geladen
    fetch("assets/templates/addTask.template.html")
        .then((response) => response.text())
        .then((data) => {
            modalContent.innerHTML = data;
        });
    modal.style.display = "block";
}



function closeModal() {
    const modal = document.getElementById("myModal");
    modal.style.display = "none";
}