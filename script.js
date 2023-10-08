<<<<<<< HEAD
=======
async function init() {
    await includeHTML();
}
>>>>>>> 199770eae1eee60c6575bc9ab3f7b40c733cbea7

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
}