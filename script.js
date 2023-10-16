

async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html");
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}

function markActiveSection(activeSection) {
    deactivateAllActiveSections();
    let section = document.getElementById(activeSection);
    section.classList.add('active-section');
}

function deactivateAllActiveSections() {
    document.getElementById('summary').classList.remove('active-section');
    document.getElementById('tasks').classList.remove('active-section');
    document.getElementById('board').classList.remove('active-section');
    document.getElementById('contactsSection').classList.remove('active-section');
    document.getElementById('policy').classList.remove('active-section');
    document.getElementById('lNotice').classList.remove('active-section')

}

function loadLocalStorageLoggedInUser(loadedContentKey) {
    if (localStorage.getItem(loadedContentKey)) {
        let loadedContentAsString = localStorage.getItem(loadedContentKey);
        logInUser = JSON.parse(loadedContentAsString);
    }
}

function setHeaderInitials(logInUser) {
    let userInitialsCont = document.getElementById('loggedUserInitials');
    if (logInUser) {
        let initials = logInUser.firstName.charAt(0) + logInUser.lastName.charAt(0);
        userInitialsCont.innerHTML = /*html*/`
        <div class="icon-styling">${initials}</div>
    `
    }else{
        userInitialsCont.innerHTML = /*html*/`
        <div class="icon-styling">G</div>
        `
    }

}

function toggleOptions() {
    let options = document.getElementById('optionsPopup');
    options.classList.toggle('invis');
}

function logOut() {
    let loginUser = '';
    let logInUserAsJSON = JSON.stringify(loginUser);
    localStorage.setItem('loggedInUser', logInUserAsJSON);
    window.location.href = 'login_index.html?msg=Logout_successfull'
}