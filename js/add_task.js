let urgentBtn;
let prio;
let urgentSymbol;
let mediumBtn;
let mediumSymbol;
let lowBtn;
let lowSymbol;
let contact;
let subtasks = [];
let tasks = [];
let contactBubbles = [];
let userCategoryselect;

async function initAddTask(activeSection) {
    loadLocalStorageLoggedInUser('loggedInUser');
    await includeHTML();
    await fetchContacts();
    await fetchTasks();
    markActiveSection(activeSection);
    setHeaderInitials(logInUser);
    assignContact();
}


// ASSIGNED TO
function assignContact() {
    let contactSelection = document.getElementById('contactSelection');
    contactSelection.innerHTML = '';
    for (let i = 0; i < contacts.length; i++) {
        contact = contacts[i];
        initials = getInitials(contact.firstName, contact.lastName); // contact.js
        contactSelection.innerHTML += contactTemplate(contact, i);
    }
}


function contactTemplate(contact, i) {
    return `
        <div class="contactAddTask checkboxContainer">
            <div class="contactInfoContainer">
                <div class="contact-bubble small contactBubbleAddTask" style="background-color: ${contact.color}">${initials}</div>
                <option>${contact.firstName} ${contact.lastName}</option>
            </div>
            <input onclick="showAssignedContacts()" id="checkbox${i}" class="checkbox" type="checkbox" value="">
        </div>
    `;
}


function toggleContacts() {
    toggleMainContainer();
    toggleArrowSymbols();
    toggleInputValue();
}


function toggleMainContainer() {
    let contactSelectionContainer = document.getElementById('contactSelectionContainer');
    contactSelectionContainer.classList.toggle('dNone');
}


function toggleArrowSymbols() {
    let arrowDownSymbol = document.getElementById('arrowDownSymbol');
    arrowDownSymbol.classList.toggle('dNone');

    let arrowUpSymbol = document.getElementById('arrowUpSymbol');
    arrowUpSymbol.classList.toggle('dNone');
}


function toggleInputValue() {
    let assignContactsInputfield = document.getElementById('assignContactsInputfield');
    if (assignContactsInputfield.value) {
        assignContactsInputfield.value = '';
    }
    else {
        assignContactsInputfield.value = 'Select contacts to assign';
    }
}


function showAssignedContacts() {
    let assignedContacts = document.getElementById('assignedContacts');
    assignedContacts.innerHTML = '';
    contactBubbles = []; // makes sure bubbles aren´t multiplied
    for (let i = 0; i < contacts.length; i++) {
        contact = contacts[i];
        initials = getInitials(contact.firstName, contact.lastName);
        let checkbox = document.getElementById(`checkbox${i}`);
        if (checkbox.checked) {
            contactBubbles.push({
                initials: initials,
                color: contact.color,
                firstName: contact.firstName,
                lastName: contact.lastName
            })
            assignedContacts.innerHTML += assignedContactsTemplate();
        }
    }
}


function assignedContactsTemplate() {
    return `
        <div id="assignedContact" class="contact-bubble small contactBubbleAddTask selectedContactBubble" style="background-color: ${contact.color}">${initials}</div>
    `;
}


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
            prio = priority;
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
            prio = priority;
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
            prio = priority;
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


// CATEGORIES
function toggleCategoryField() {
    let categoryArrowDown = document.getElementById('categoryArrowDown');
    categoryArrowDown.classList.toggle('dNone');

    let categoryArrowUp = document.getElementById('categoryArrowUp');
    categoryArrowUp.classList.toggle('dNone');

    let categorySelection = document.getElementById('categorySelection');
    categorySelection.classList.toggle('dNone');
}


function assignCategory(selectedCategory) {
    let categoryInputField = document.getElementById('categoryInputField');
    categoryInputField.value = selectedCategory.getAttribute('value');
    toggleCategoryField(); // closes categories
    userCategoryselect = categoryInputField.value;
}


// SUBTASKS
let subtaskInput;
let isEditing = false;


function addSubtask() {
    subtaskInput = document.getElementById('subtaskInput');

    if (subtaskInputFieldHasContent()) {
        subtasks.push(subtaskInput.value);
        subtaskInput.value = '';
        renderSubtasks({ subtasks });
    }
}

function subtaskInputFieldHasContent() {
    return subtaskInput.value.length !== 0;
}


function renderSubtasks(task) {
    const subtaskContainer = document.getElementById('subtaskContainer');
    subtaskContainer.innerHTML = '';

    if (task && task.subtasks) {
        for (let i = 0; i < task.subtasks.length; i++) {
            const subtask = task.subtasks[i];
            subtaskContainer.innerHTML += subtaskEditContainerTemplate(subtask, i);
        }
    }
}


function subtaskEditContainerTemplate(subtask, i) {
    return `
    <ul id="ulContainer${i}" class="ulContainer" onmouseover="mouseOverSubtaskEditContainer(this)" onmouseout="mouseOutSubtaskEditContainer(this)">
        <li id="subtaskListElement${i}" class="subtaskListElements">${subtask}</li>
        <div id="subtaskEditContainer" class="subtaskEditContainer dNone">
            <img id="editImg${i}" onclick="editSubtask(${i})" src="/assets/images/edit.svg" alt="Stift">
            <div class="subtaskSeparator"></div>
            <img onclick="deleteSubtask(${i})" src="/assets/images/delete.svg" alt="Mülleimer">
        </div>
    </ul>
    `;
}


function mouseOverSubtaskEditContainer(element) {
    if (!isEditing) {
        const subtaskEditContainer = element.querySelector('.subtaskEditContainer');
        subtaskEditContainer.classList.remove('dNone');
    }
}


function mouseOutSubtaskEditContainer(element) {
    if (!isEditing) {
        const subtaskEditContainer = element.querySelector('.subtaskEditContainer');
        subtaskEditContainer.classList.add('dNone');
    }
}


function deleteSubtask(i) {
    if (atLeastOneSubtaskExists(i)) { // if at least one subtask exists in array
        removeSubtask(i);
        renderSubtasks({ subtasks, i });
    }
}


function atLeastOneSubtaskExists(i) {
    return i > -1;
}


function removeSubtask(i) {
    subtasks.splice(i, 1);
}


function editSubtask(i) {
    if (!isEditing) {
        isEditing = true;

        let ulContainer = document.getElementById(`ulContainer${i}`);
        ulContainer.style.backgroundColor = '#EAEBEC';

        let addSubtaskSymbol = document.getElementById(`addSubtaskSymbol`);
        addSubtaskSymbol.classList.add('dNone');

        let subtaskListElement = document.getElementById(`subtaskListElement${i}`);
        subtaskListElement.contentEditable = true;
        subtaskListElement.focus();

        let confirmEditSymbol = document.getElementById(`editImg${i}`);
        confirmEditSymbol.src = "/assets/images/check_black.png";
        confirmEditSymbol.onclick = function () {
            closeEditing(subtaskListElement, confirmEditSymbol, addSubtaskSymbol, ulContainer, i);
        };

        subtaskInput.disabled = true;
    }
}


function closeEditing(subtaskListElement, confirmEditSymbol, addSubtaskSymbol, ulContainer, i) {
    isEditing = false;
    subtaskInput.disabled = false;
    subtaskListElement.contentEditable = false;
    confirmEditSymbol.src = "/assets/images/edit.svg";
    addSubtaskSymbol.classList.remove('dNone');
    ulContainer.style.backgroundColor = '';

    confirmEditSymbol.onclick = function () {
        editSubtask(i);
    };
}

//Clear Task
function clearTaskForm(){
    initAddTask('tasks');
}

// ADD TO BOARD
async function addTaskToBoard() {
    // let formattedDueDate = formatDueDate(dueDate.value);
    tasks.push(new Task(title.value, description.value, contactBubbles, dueDate.value, prio, userCategoryselect, subtasks))
    await setItem('tasks', JSON.stringify(tasks));
    initAddTask('tasks');
}

function formatDueDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-GB'); // british format -> dd/mm/yyyy
}
