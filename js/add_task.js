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


/**
 * Initializes the "Add Task" page with necessary data and UI components.
 *
 * @param {string} activeSection - The ID of the section that should be marked as active.
 * @returns {Promise<void>} - A promise that resolves when the initialization is complete. Void indicates that no specific value is returned.
 * @param {string} loggedInUser - The key for the logged-in user in local storage.
 * @param {object} logInUser - The logged-in user object.
 */
async function initAddTask(activeSection) {
    loadLocalStorageLoggedInUser('loggedInUser');
    await includeHTML();
    await fetchContacts();
    await fetchTasks();
    markActiveSection(activeSection);
    setHeaderInitials(logInUser);
    assignContact();
    checkIfTaskisEditing();
}


/**
 * Checks if there is an edited task stored locally, and if so, opens the edit task popup.
 * Clears the stored edited task identifier after opening the popup.
 *
 * @param {object} eTask - The task object to be edited.
 * @returns {object | null} - The edited task object if found, or null if not found.
 */
function checkIfTaskisEditing() {
    let eTask = loadEditedTaskLocal();
    if (eTask) {
        openEditTaskPopup(eTask);
        saveEditedTaskIdLocal(null);
    }
}


// ASSIGNED TO
/**
 * Populates the contact selection dropdown with contact information.
 *
 * @param {HTMLElement} contactSelection - The HTML element representing the contact selection dropdown.
 * @param {object} contact - The current contact object.
 * @param {string} initials - The initials of the current contact.
 */
function assignContact() {
    let contactSelection = document.getElementById('contactSelection');
    contactSelection.innerHTML = '';
    for (let i = 0; i < contacts.length; i++) {
        contact = contacts[i];
        initials = getInitials(contact.firstName, contact.lastName); // contact.js
        contactSelection.innerHTML += contactTemplate(contact, i);
    }
}


/**
 * Generates an HTML template for displaying a contact in the "Add Task" page.
 *
 * @param {object} contact - The contact object containing information like first name, last name, and color.
 * @param {number} i - The index of the contact in the contacts array.
 * @param {string} initials - The initials of the contact, derived from the first and last name.
 */
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


/**
 * Toggles the visibility and state of various elements related to contact management.
 * 
 */
function toggleContacts() {
    toggleMainContainer();
    toggleArrowSymbols();
    toggleInputValue();
}


/**
 * Toggles the visibility of the main container for contact selection.
 *
 * @param {HTMLElement} contactSelectionContainer - The HTML element representing the contact selection dropdown.
 */
function toggleMainContainer() {
    let contactSelectionContainer = document.getElementById('contactSelectionContainer');
    contactSelectionContainer.classList.toggle('dNone');
}


/**
 * Toggles the visibility of arrow symbols indicating the state of contact visibility.
 *
 * @param {HTMLElement} arrowDownSymbol - The HTML element representing the arrow symbol for indicating a collapsed state.
 * @param {HTMLElement} arrowUpSymbol - The HTML element representing the arrow symbol for indicating an expanded state.
 */
function toggleArrowSymbols() {
    let arrowDownSymbol = document.getElementById('arrowDownSymbol');
    arrowDownSymbol.classList.toggle('dNone');

    let arrowUpSymbol = document.getElementById('arrowUpSymbol');
    arrowUpSymbol.classList.toggle('dNone');
}


/**
 * Toggles the value of an input field used for assigning contacts.
 * If the field has a value, it is cleared; otherwise, a default value is set.
 *
 * @param {HTMLElement} assignContactsInputfield - The HTML input element used for assigning contacts.
 */
function toggleInputValue() {
    let assignContactsInputfield = document.getElementById('assignContactsInputfield');
    if (assignContactsInputfield.value) {
        assignContactsInputfield.value = '';
    }
    else {
        assignContactsInputfield.value = 'Select contacts to assign';
    }
}


/**
 * Displays the contact bubbles for assigned contacts in the designated area.
 *
 * @param {HTMLElement} assignedContacts - The HTML element representing the area for displaying assigned contacts.
 * @param {Array<object>} contactBubbles - An array to store contact bubble information to prevent duplication.
 * @param {object} contact - The current contact object.
 * @param {string} initials - The initials of the current contact.
 * @param {HTMLInputElement} checkbox - The HTML checkbox element for the current contact.
 */
function showAssignedContacts() {
    let assignedContacts = document.getElementById('assignedContacts');
    assignedContacts.innerHTML = '';
    contactBubbles = []; // makes sure bubbles aren´t multiplied
    for (let i = 0; i < contacts.length; i++) { // Iterate through the contacts array and display assigned contact bubbles
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


/**
 * Generates an HTML template for displaying an assigned contact bubble in the "Add Task" page.
 *
 * @returns {string} - The HTML template for the assigned contact bubble.
 */
function assignedContactsTemplate() {
    return `
        <div id="assignedContact" class="contact-bubble small contactBubbleAddTask selectedContactBubble" style="background-color: ${contact.color}">${initials}</div>
    `;
}


// PRIO BUTTONS
/**
 * Handles the display and interaction of priority elements based on the selected priority.
 *
 * @param {string} priority - The selected priority ('urgent', 'medium', or 'low').
 */
function handlePriorities(priority) {
    getPrioElements();
    handleUrgent(priority, urgentBtn, mediumBtn, lowBtn, urgentSymbol);
    handleMedium(priority, mediumBtn, urgentBtn, lowBtn, mediumSymbol);
    handleLow(priority, lowBtn, mediumBtn, urgentBtn, lowSymbol);
}


/**
 * Retrieves HTML elements related to task priorities for interaction and manipulation.
 *
 * @param {HTMLButtonElement} urgentBtn - The HTML button element for the 'urgent' priority.
 * @param {HTMLElement} urgentSymbol  - The HTML element representing the symbol/icon for the 'urgent' priority.
 * @param {HTMLButtonElement} mediumBtn - The HTML button element for the 'medium' priority.
 * @param {HTMLElement} mediumSymbol  - The HTML button element for the 'medium' priority.
 * @param {HTMLButtonElement} lowBtn - The HTML button element for the 'low' priority.
 * @param {HTMLElement} lowSymbol  - The HTML button element for the 'low' priority.
 */
function getPrioElements() {
    urgentBtn = document.getElementById('urgent');
    urgentSymbol = document.getElementById('urgentSymbol');

    mediumBtn = document.getElementById('medium');
    mediumSymbol = document.getElementById('mediumSymbol');

    lowBtn = document.getElementById('low');
    lowSymbol = document.getElementById('lowSymbol');
}


/**
 * Handles the interaction and display changes for the 'urgent' priority button.
 *
 * @param {string} priority - The selected priority ('urgent', 'medium', or 'low').
 */
function handleUrgent(priority) {
    if (priority === 'urgent') {
        if (urgentButtonAlreadyClicked()) {
            removeUrgentClassAndEnableOtherButtons();
        } else {
            addUrgentClassAndDisableOtherButtons();
            prio = priority; // Update the global priority variable
        }
    }
}


/**
 * Checks if the 'urgent' button has already been clicked.
 *
 * @returns {boolean} - `true` if the 'urgent' button has been clicked; otherwise, `false`.
 */
function urgentButtonAlreadyClicked() {
    return urgentBtn.classList.contains('urgent');
}


/**
 * Removes the 'urgent' class from the 'urgent' button and enables other priority buttons.
 */
function removeUrgentClassAndEnableOtherButtons() {
    urgentBtn.classList.remove('urgent');
    urgentSymbol.src = '/assets/images/urgent_symbol.svg';
    mediumBtn.disabled = false;
    lowBtn.disabled = false;
}


/**
 * Adds the 'urgent' class to the 'urgent' button and disables other priority buttons.
 */
function addUrgentClassAndDisableOtherButtons() {
    urgentBtn.classList.add('urgent');
    urgentSymbol.src = '/assets/images/urgent_symbol_white.png';
    mediumBtn.disabled = true;
    lowBtn.disabled = true;
}


// medium
/**
 * Handles the interaction and display changes for the 'medium' priority button.
 *
 * @param {string} priority - The selected priority ('urgent', 'medium', or 'low').
 */
function handleMedium(priority) {
    if (priority === 'medium') {
        if (mediumButtonAlreadyClicked()) {
            removeMediumClassAndEnableOtherButtons();
        } else {
            addMediumClassAndDisableOtherButtons();
            prio = priority; // Update the global priority variable
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
        renderSubtasks();
    }
}

function subtaskInputFieldHasContent() {
    return subtaskInput.value.length != '';
}


/*function renderSubtasks(task) {
    const subtaskContainer = document.getElementById('subtaskContainer');
    subtaskContainer.innerHTML = '';

    if (task && task.subtasks) {
        for (let i = 0; i < task.subtasks.length; i++) {
            const subtask = task.subtasks[i];
            subtaskContainer.innerHTML += subtaskEditContainerTemplate(subtask, i);
        }
    }
}*/


function renderSubtasks() {
    const subtaskContainer = document.getElementById('subtaskContainer');
    subtaskContainer.innerHTML = '';

    for (let i = 0; i < subtasks.length; i++) {
        const subtask = subtasks[i];
        subtaskContainer.innerHTML += subtaskEditContainerTemplate(subtask, i);
    }
};


function subtaskEditContainerTemplate(subtask, i) {
    return /*html*/`
    <ul id="ulContainer${i}" class="ulContainer" onmouseover="mouseOverSubtaskEditContainer(this)" onmouseout="mouseOutSubtaskEditContainer(this)">
        <li id="subtaskListElement${i}" class="subtaskListElements">${subtask}</li>
        <div id="subtaskEditContainer" class="subtaskEditContainer dNone">
            <img id="editImg${i}" onclick="editSubtask(${i})" src="/assets/images/edit.svg" alt="Stift">
            <div class="subtaskSeparator"></div>
            <img id="trashcan${i}" onclick="deleteSubtask(${i})" src="/assets/images/delete.svg" alt="Mülleimer">
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
        renderSubtasks();
    }
}


function atLeastOneSubtaskExists(i) {
    return i > -1;
}


function removeSubtask(i) {
    subtasks.splice(i, 1);
    subtaskContainer.innerHTML = '';
}


function editSubtask(i) {
    subtaskInput = document.getElementById('subtaskInput');

    if (!isEditing) {
        isEditing = true;

        let ulContainer = document.getElementById(`ulContainer${i}`);
        ulContainer.style.backgroundColor = '#EAEBEC';

        let addSubtaskSymbol = document.getElementById(`addSubtaskSymbol`);
        addSubtaskSymbol.classList.add('dNone');

        let trashcan = document.getElementById(`trashcan${i}`);
        trashcan.classList.add('dNone');

        let subtaskListElement = document.getElementById(`subtaskListElement${i}`);
        subtaskListElement.contentEditable = true;
        subtaskListElement.focus();

        let confirmEditSymbol = document.getElementById(`editImg${i}`);
        confirmEditSymbol.src = "/assets/images/check_black.png";
        confirmEditSymbol.onclick = function () {
            closeEditing(subtaskInput, trashcan, subtaskListElement, confirmEditSymbol, addSubtaskSymbol, ulContainer, i);
        };

        subtaskInput.disabled = true;
    }
}


function closeEditing(subtaskInput, trashcan, subtaskListElement, confirmEditSymbol, addSubtaskSymbol, ulContainer, i) {
    isEditing = false;
    subtaskInput.disabled = false;
    subtaskListElement.contentEditable = false;
    confirmEditSymbol.src = "/assets/images/edit.svg";
    addSubtaskSymbol.classList.remove('dNone');
    trashcan.classList.remove('dNone');
    ulContainer.style.backgroundColor = '';

    confirmEditSymbol.onclick = function () {
        editSubtask(i);
    };
}

//Clear Task
function clearTaskForm() {
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
