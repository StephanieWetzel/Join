


async function init(board) {
    loadLocalStorageLoggedInUser('loggedInUser');
    await includeHTML();
    await fetchContacts();
    loadContacts();
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
    modal.style.display = "block";
}


function closeModal() {
    const modal = document.getElementById("myModal");
    modal.style.display = "none";
}