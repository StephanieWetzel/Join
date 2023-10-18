let urgentBtn;
let urgentSymbol;
let mediumBtn;
let mediumSymbol;
let lowBtn;
let lowSymbol;
let subtasks = [];
// let contacts = [];

async function init(activeSection) {
    loadLocalStorageLoggedInUser('loggedInUser');
    await includeHTML();
    // await fetchContacts();
    markActiveSection(activeSection);
    setHeaderInitials(logInUser);
}


// ASSIGNED TO
// function assignTaskToContact() {
//     let contactSelection = document.getElementById('contactSelection');
//     for (let i = 0; i < contacts.length; i++) {
//         let contact = contacts[i];
//         contactSelection.innerHTML += `
//         <option>${contact}</option>
//         `;
//     }
// }


// PRIO BUTTONS
function handlePriorities(priority) {
    getPrioElements();

    handleUrgent(priority, urgentBtn, mediumBtn, lowBtn, urgentSymbol);
    handleMedium(priority, mediumBtn, urgentBtn, lowBtn, mediumSymbol);
    handleLow(priority, lowBtn, mediumBtn, urgentBtn, lowSymbol);
}


function getPrioElements() {
    urgentBtn = document.getElementById('urgent');
    urgentSymbol = document.getElementById('urgentSymbol');

    mediumBtn = document.getElementById('medium');
    mediumSymbol = document.getElementById('mediumSymbol');

    lowBtn = document.getElementById('low');
    lowSymbol = document.getElementById('lowSymbol');
}


// urgent
function handleUrgent(priority) {
    if (priority === 'urgent') {
        if (urgentButtonAlreadyClicked()) {
            removeUrgentClassAndEnableOtherButtons();
        } else {
            addUrgentClassAndDisableOtherButtons();
        }
    }
}


function urgentButtonAlreadyClicked() {
    return urgentBtn.classList.contains('urgent');
}


function removeUrgentClassAndEnableOtherButtons() {
    urgentBtn.classList.remove('urgent');
    urgentSymbol.src = '/assets/images/urgent_symbol.svg';
    mediumBtn.disabled = false;
    lowBtn.disabled = false;
}


function addUrgentClassAndDisableOtherButtons() {
    urgentBtn.classList.add('urgent');
    urgentSymbol.src = '/assets/images/urgent_symbol_white.png';
    mediumBtn.disabled = true;
    lowBtn.disabled = true;
}


// medium
function handleMedium(priority) {
    if (priority === 'medium') {
        if (mediumButtonAlreadyClicked()) {
            removeMediumClassAndEnableOtherButtons();
        } else {
            addMediumClassAndDisableOtherButtons();
        }
    }
}


function mediumButtonAlreadyClicked() {
    return mediumBtn.classList.contains('medium');
}


function removeMediumClassAndEnableOtherButtons() {
    mediumBtn.classList.remove('medium');
    mediumSymbol.src = '/assets/images/medium_symbol.svg';
    urgentBtn.disabled = false;
    lowBtn.disabled = false;
}


function addMediumClassAndDisableOtherButtons() {
    mediumBtn.classList.add('medium');
    mediumSymbol.src = '/assets/images/medium_symbol_white.png';
    urgentBtn.disabled = true;
    lowBtn.disabled = true;
}


// low
function handleLow(priority) {
    if (priority === 'low') {
        if (lowButtonAlreadyClicked()) {
            removeLowClassAndEnableOtherButtons();
        } else {
            addLowClassAndDisableOtherButtons();
        }
    }
}


function lowButtonAlreadyClicked() {
    return lowBtn.classList.contains('low');
}


function removeLowClassAndEnableOtherButtons() {
    lowBtn.classList.remove('low');
    lowSymbol.src = '/assets/images/low_symbol.svg';
    urgentBtn.disabled = false;
    mediumBtn.disabled = false;
}


function addLowClassAndDisableOtherButtons() {
    lowBtn.classList.add('low');
    lowSymbol.src = '/assets/images/low_symbol_white.png';
    urgentBtn.disabled = true;
    mediumBtn.disabled = true;
}


// SUBTASKS
let subtaskInput;

function addSubtask() {
    let subtaskContainer = document.getElementById('subtaskContainer');
    subtaskInput = document.getElementById('subtaskInput');

    if (subtaskInput.value.length != '') {
        subtasks.push(subtaskInput.value);
        subtaskContainer.innerHTML = '';

        renderSubtask();
    }
}


function renderSubtask() {
    for (let i = 0; i < subtasks.length; i++) {
        const subtask = subtasks[i];
        subtaskContainer.innerHTML += subtaskEditContainerTemplate(subtask, i);
        subtaskInput.value = '';
    }
}


function subtaskEditContainerTemplate(subtask, i) {
    return /*html*/`
    <ul id="ulContainer" class="ulContainer" onmouseover="mouseOverSubtaskEditContainer(this)" onmouseout="mouseOutSubtaskEditContainer(this)">
        <li id="subtaskListElement" class="subtaskListElements">${subtask}</li>
        <div id="subtaskEditContainer" class="subtaskEditContainer dNone">
            <img id="editImg" onclick="editSubtask()" src="/assets/images/edit.svg" alt="Stift">
            <div class="subtaskSeparator"></div>
            <img onclick="deleteSubtask(${i})" src="/assets/images/delete.svg" alt="Mülleimer">
        </div>
    </ul>
    `;
}


function mouseOverSubtaskEditContainer(element) {
    const subtaskEditContainer = element.querySelector('.subtaskEditContainer');
    subtaskEditContainer.classList.remove('dNone');
}


function mouseOutSubtaskEditContainer(element) {
    const subtaskEditContainer = element.querySelector('.subtaskEditContainer');
    subtaskEditContainer.classList.add('dNone');
}


function deleteSubtask(i) {
    if (i > -1) {
        closeEditing();
        subtasks.splice(i, 1);
        subtaskContainer.innerHTML = '';
        renderSubtask();
    }
}


function editSubtask() {
    let subtaskListElement = document.getElementById('subtaskListElement');
    subtaskListElement.contentEditable = true;
    subtaskListElement.focus();

    let confirmEditSymbol = document.getElementById('editImg');
    confirmEditSymbol.src = "/assets/images/check_black.png";
    confirmEditSymbol.onclick = function () {
        closeEditing();
    };

    document.getElementById('addSubtaskSymbol').classList.add('dNone');
    document.getElementById('ulContainer').style.backgroundColor = '#EAEBEC';

    document.getElementById('subtaskEditContainer').removeEventListener('mouseover', mouseOverSubtaskEditContainer);
    document.getElementById('subtaskEditContainer').removeEventListener('mouseout', mouseOutSubtaskEditContainer);
    document.getElementById('subtaskEditContainer').classList.remove('dNone');

    subtaskInput.disabled = true;
}


function closeEditing() {
    subtaskInput.disabled = false;
    subtaskListElement.contentEditable = false;
    document.getElementById('editImg').src = "/assets/images/edit.svg";
    document.getElementById('addSubtaskSymbol').classList.remove('dNone');
    document.getElementById('ulContainer').style.backgroundColor = '';
    document.getElementById('editImg').onclick = editSubtask;
}