let urgentBtn;
let prio;
let urgentSymbol;
let mediumBtn;
let mediumSymbol;
let lowBtn;
let lowSymbol;
let contact;
let subtasks = [];
let subtaskInput;
let isEditing = false;
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
    setMinDate();
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
    let addTaskHeader = document.getElementById('addTaskHeading')
    if (eTask) {
        openEditTaskPopup(eTask);
        saveEditedTaskIdLocal(null);
        addTaskHeader.innerText = 'Edit Task';
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
    contactSelectionContainer.classList.toggle('dNone');
}


/**
 * Toggles the visibility of arrow symbols indicating the state of contact visibility.
 *
 * @param {HTMLElement} arrowDownSymbol - The HTML element representing the arrow symbol for indicating a collapsed state.
 * @param {HTMLElement} arrowUpSymbol - The HTML element representing the arrow symbol for indicating an expanded state.
 */
function toggleArrowSymbols() {
    arrowDownSymbol.classList.toggle('dNone');
    arrowUpSymbol.classList.toggle('dNone');
}


/**
 * Toggles the value of an input field used for assigning contacts.
 * If the field has a value, it is cleared; otherwise, a default value is set.
 *
 * @param {HTMLElement} assignContactsInputfield - The HTML input element used for assigning contacts.
 */
function toggleInputValue() {
    if (assignContactsInputfield.value) {
        assignContactsInputfield.value = '';
    }
    else {
        assignContactsInputfield.value = 'Select contacts to assign';
    }
}


// Functions for CLOSING contacts only
/**
 * Adds a click event listener to the document to handle clicks outside of the input field.
 * Closes the contact selection if the user clicks outside of specific elements.
 *
 * @param {Event} event - The click event object.
 */
document.addEventListener('click', function (event) {
    if (userClicksOutsideOfInputField(event)) {
        closeContactSelection();
    }
});


/**
 * Checks if the user clicked outside of specific elements related to the contact selection.
 *
 * @param {Event} event - The click event object.
 * @returns {boolean} Returns true if the click is outside of the specified input field and symbols.
 */
function userClicksOutsideOfInputField(event) {
    return !contactSelectionContainer.contains(event.target) &&
        !assignContactsInputfield.contains(event.target) &&
        !arrowDownSymbol.contains(event.target) &&
        !arrowUpSymbol.contains(event.target);
}


/**
 * Closes the contact selection by updating the relevant elements' classes and resetting the input field value.
 */
function closeContactSelection() {
    contactSelectionContainer.classList.add('dNone');
    arrowDownSymbol.classList.remove('dNone');
    arrowUpSymbol.classList.add('dNone');
    assignContactsInputfield.value = 'Select contacts to assign';
}


/**
 * Displays assigned contact bubbles in the designated container based on the checked checkboxes.
 *
 * @param {HTMLElement} assignedContacts - The HTML element representing the area for displaying assigned contacts.
 * @param {object[]} contactBubbles - An array to store contact bubble information to prevent duplication.
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
            printContact();
        }
    }
}


/**
 * Adds a contact to the array of assigned contact bubbles and displays it in the UI.
 */
function printContact() {
    contactBubbles.push({
        initials: initials,
        color: contact.color,
        firstName: contact.firstName,
        lastName: contact.lastName
    })
    assignedContacts.innerHTML += assignedContactsTemplate();
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


// CALENDAR
/**
 * Sets the minimum date for the specified date input field to the current date.
 *
 * @param {string} currentDate - The current date in ISO format (YYYY-MM-DD).
 * @param {HTMLInputElement} dateInput - The HTML input element representing the date input field.
 */
function setMinDate() {
    const currentDate = new Date().toISOString().split("T")[0];
    const dateInput = document.getElementById("dueDate");
    dateInput.min = currentDate; // Sets the minimum date for the date input field to the current date.
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
        addUrgentClass();
        prio = 'urgent'; // Updates the global variable value.
    } else {
        removeUrgentClass();
    }
}


/**
 * Adds the 'urgent' class to the 'urgent' button.
 */
function addUrgentClass() {
    urgentBtn.classList.add('urgent');
    urgentSymbol.src = "./assets/images/urgent_symbol_white.png";
}


/**
 * Removes the 'urgent' class from the 'urgent' button.
 */
function removeUrgentClass() {
    urgentBtn.classList.remove('urgent');
    urgentSymbol.src = './assets/images/urgent_symbol.svg';
}


// medium
/**
 * Handles the interaction and display changes for the 'medium' priority button.
 *
 * @param {string} priority - The selected priority ('urgent', 'medium', or 'low').
 */
function handleMedium(priority) {
    if (priority === 'medium') {
        addMediumClass();
        prio = 'medium'; // Updates the global variable value.
    } else {
        removeMediumClass();
    }
}


/**
 * Adds the 'medium' class to the 'medium' button.
 */
function addMediumClass() {
    mediumBtn.classList.add('medium');
    mediumSymbol.src = './assets/images/medium_symbol_white.png';
}


/**
 * Removes the 'medium' class from the 'medium' button.
 */
function removeMediumClass() {
    mediumBtn.classList.remove('medium');
    mediumSymbol.src = './assets/images/medium_symbol.svg';
}


// low
/**
 * Handles the interaction and display changes for the 'low' priority button.
 *
 * @param {string} priority - The selected priority ('urgent', 'medium', or 'low').
 */
function handleLow(priority) {
    if (priority === 'low') {
        addLowClass();
        prio = 'low'; // Updates the global variable value.
    } else {
        removeLowClass();
    }
}


/**
 * Adds the 'low' class to the 'low' button.
 */
function addLowClass() {
    lowBtn.classList.add('low');
    lowSymbol.src = './assets/images/low_symbol_white.png';
}


/**
 * Removes the 'low' class from the 'low' button.
 */
function removeLowClass() {
    lowBtn.classList.remove('low');
    lowSymbol.src = './assets/images/low_symbol.svg';
}


// CATEGORIES
/**
 * Toggles the visibility of the category selection field and associated arrow symbols.
 *
 * @param {HTMLElement} categoryArrowDown - The HTML element representing the arrow symbol pointing down for the category field.
 * @param {HTMLElement} categoryArrowUp  - The HTML element representing the arrow symbol pointing up for the category field.
 * @param {HTMLElement} categorySelection - The HTML element representing the category selection field.
 */
function toggleCategoryField() {
    categoryArrowDown.classList.toggle('dNone');
    categoryArrowUp.classList.toggle('dNone');
    categorySelection.classList.toggle('dNone');
}


/**
 * Assigns the selected category to the category input field and updates the user's category selection.
 *
 * @param {HTMLElement} selectedCategory - The HTML element representing the selected category.
 * @param {HTMLInputElement} categoryInputField - The HTML input field for category selection.
 */
function assignCategory(selectedCategory) {
    let categoryInputField = document.getElementById('categoryInputField');
    categoryInputField.value = selectedCategory.getAttribute('value'); // Sets the value of the category input field to the value attribute of the selected category.
    toggleCategoryField();
    userCategoryselect = categoryInputField.value; // Updates the global variable representing the user's selected category.
}


// Functions for CLOSING categories only
/**
 * Adds a click event listener to the document to handle clicks outside of the input field.
 * Closes the category selection if the user clicks outside of specific elements.
 *
 * @type {EventListener}
 * @param {Event} event - The click event object.
 */
document.addEventListener('click', function (event) {
    if (userClicksOutsideOfCategoryField(event))
        closeCategorySelection();
});


/**
 * Checks if the user clicked outside of the category field.
 *
 * @param {Event} event - The click event object.
 * @returns {boolean} - Returns true if the click is outside of the category field, otherwise false.
 */
function userClicksOutsideOfCategoryField(event) {
    return !categorySelection.contains(event.target) &&
        !categoryInputField.contains(event.target) &&
        !categoryArrowDown.contains(event.target) &&
        !categoryArrowUp.contains(event.target);
}


/**
 * Closes the category selection by adding CSS classes to hide and show respective elements.
 */
function closeCategorySelection() {
    categorySelection.classList.add('dNone');
    categoryArrowDown.classList.remove('dNone');
    categoryArrowUp.classList.add('dNone');
}


// SUBTASKS
/**
 * Adds a subtask to the list of subtasks and updates the rendering of subtasks.
 *
 * @param {HTMLInputElement} subtaskInput - The HTML input field for entering subtasks.
 */
function addSubtask() {
    subtaskInput = document.getElementById('subtaskInput');
    if (subtaskInputFieldHasContent()) {
        subtasks.push(subtaskInput.value);
        subtaskInput.value = '';
        renderSubtasks();
    }
}


/**
 * Checks if the subtask input field has content.
 *
 * @returns {boolean} - `true` if the subtask input field has content; otherwise, `false`.
 */
function subtaskInputFieldHasContent() {
    return subtaskInput.value.length != '';
}


/**
 * Renders the list of subtasks in the designated container.
 *
 * @param {HTMLElement} subtaskContainer - The HTML element that serves as the container for displaying subtasks.
 * @param {string} subtask - The current subtask in the iteration.
 */
function renderSubtasks() {
    const subtaskContainer = document.getElementById('subtaskContainer');
    subtaskContainer.innerHTML = '';

    for (let i = 0; i < subtasks.length; i++) { // Iterates through the list of subtasks and adds them to the subtask container using a template.
        const subtask = subtasks[i];
        subtaskContainer.innerHTML += subtaskEditContainerTemplate(subtask, i);
    }
};


/**
 * Generates an HTML template for a subtask edit container.
 *
 * @param {string} subtask - The text content of the subtask.
 * @param {number} i - The index of the subtask in the list.
 */
function subtaskEditContainerTemplate(subtask, i) {
    return /*html*/`
    <ul id="ulContainer${i}" class="ulContainer" onmouseover="mouseOverSubtaskEditContainer(this)" onmouseout="mouseOutSubtaskEditContainer(this)">
        <li id="subtaskListElement${i}" class="subtaskListElements">${subtask}</li>
        <div id="subtaskEditContainer" class="subtaskEditContainer dNone">
            <img id="editImg${i}" onclick="editSubtask(${i})" src="./assets/images/edit.svg" alt="Stift">
            <div class="subtaskSeparator"></div>
            <img id="trashcan${i}" onclick="deleteSubtask(${i})" src="./assets/images/delete.svg" alt="Mülleimer">
        </div>
    </ul>
    `;
}


/**
 * Handles the mouseover event for a subtask edit container, displaying the edit options.
 *
 * @param {HTMLElement} element - The HTML element representing the subtask edit container.
 * @param {boolean} isEditing -  A flag indicating whether the application is in editing mode.
 * @param {HTMLElement} subtaskEditContainer - The HTML element representing the subtask edit container within the provided element.
 */
function mouseOverSubtaskEditContainer(element) {
    if (!isEditing) {
        const subtaskEditContainer = element.querySelector('.subtaskEditContainer');
        subtaskEditContainer.classList.remove('dNone');
    }
}


/**
 * Handles the mouseout event for a subtask edit container, hiding the edit options.
 *
 * @param {HTMLElement} element - The HTML element representing the subtask edit container.
 * @param {boolean} isEditing -  A flag indicating whether the application is in editing mode.
 * @param {HTMLElement} subtaskEditContainer - The HTML element representing the subtask edit container within the provided element.
 */
function mouseOutSubtaskEditContainer(element) {
    if (!isEditing) {
        const subtaskEditContainer = element.querySelector('.subtaskEditContainer');
        subtaskEditContainer.classList.add('dNone');
    }
}


/**
 * Deletes a subtask at the specified index and updates the rendering of subtasks.
 *
 * @param {number} i - The index of the subtask to be deleted.
 */
function deleteSubtask(i) {
    if (atLeastOneSubtaskExists(i)) { // if at least one subtask exists in array
        removeSubtask(i);
        renderSubtasks();
    }
}


/**
 * Checks if at least one subtask exists at the specified index.
 *
 * @param {number} i - The index to be checked.
 * @returns {boolean} - `true` if at least one subtask exists at the specified index; otherwise, `false`.
 */
function atLeastOneSubtaskExists(i) {
    return i > -1;
}


/**
 * Removes a subtask at the specified index from the list of subtasks and clears the subtask container.
 *
 * @param {number} i - The index of the subtask to be removed.
 */
function removeSubtask(i) {
    subtasks.splice(i, 1);
    subtaskContainer.innerHTML = '';
}


let confirmEditSymbol;
let trashcan;
let subtaskListElement;
let ulContainer;


/**
 * Initiates the editing of a subtask by changing its style, making it editable, and handling the confirmation of edits.
 *
 * @param {number} i - The index of the subtask to be edited.
 * @param {HTMLInputElement} subtaskInput - The HTML input field for entering subtasks.
 * @param {boolean} isEditing - Sets the editing state to true.
 */
function editSubtask(i) {
    subtaskInput = document.getElementById('subtaskInput');

    if (!isEditing) {
        isEditing = true;
        changeStyleOfElements(i);
        makeContentEditable(i);

        confirmEditSymbol.onclick = function () { // Sets the click event for the confirm edit symbol to close the editing mode.
            closeEditing(subtaskInput, trashcan, subtaskListElement, confirmEditSymbol, addSubtaskSymbol, ulContainer, i);
        };

        subtaskInput.disabled = true;
    }
}


/**
 * Changes the style of elements related to the editing process for a subtask.
 *
 * @param {number} i - The index of the subtask for which styles are to be changed.
 * @param {HTMLUListElement} ulContainer - The HTML unordered list container element for the subtask at the specified index.
 * @param {HTMLDivElement} addSubtaskSymbol - The HTML div element representing the add subtask symbol.
 * @param {HTMLImageElement} trashcan - The HTML image element representing the trashcan icon for the subtask at the specified index.
 * @param {HTMLImageElement} confirmEditSymbol  - The HTML image element representing the confirm edit symbol for the subtask at the specified index.
 */
function changeStyleOfElements(i) {
    ulContainer = document.getElementById(`ulContainer${i}`);
    ulContainer.style.backgroundColor = '#EAEBEC';

    let addSubtaskSymbol = document.getElementById(`addSubtaskSymbol`);
    addSubtaskSymbol.classList.add('dNone');

    trashcan = document.getElementById(`trashcan${i}`);
    trashcan.classList.add('dNone');

    confirmEditSymbol = document.getElementById(`editImg${i}`);
    confirmEditSymbol.src = "./assets/images/check_black.png";
}


/**
 * Makes the content of the subtask list element at the specified index editable and sets focus to it.
 * 
 * @param {number} i - The index of the subtask list element to be made editable.
 * @param {HTMLLIElement} subtaskListElement - The HTML list element representing the subtask at the specified index.
 */
function makeContentEditable(i) {
    subtaskListElement = document.getElementById(`subtaskListElement${i}`);
    subtaskListElement.contentEditable = true;
    subtaskListElement.focus();
}


/**
 * Closes the editing mode for a subtask, reverts UI changes, and sets the application state accordingly.
 *
 * @param {HTMLInputElement} subtaskInput - The HTML input field for entering subtasks.
 * @param {HTMLImageElement} trashcan - The HTML image element representing the trashcan icon.
 * @param {HTMLLIElement} subtaskListElement - The HTML list item element representing the subtask.
 * @param {HTMLImageElement} confirmEditSymbol - The HTML image element representing the confirm edit symbol.
 * @param {HTMLDivElement} addSubtaskSymbol - The HTML div element representing the add subtask symbol.
 * @param {HTMLUListElement} ulContainer - The HTML unordered list element container.
 * @param {number} i - The index of the subtask being edited.
 * @param {boolean} isEditing - Sets the editing state to false.
 */
function closeEditing(subtaskInput, trashcan, subtaskListElement, confirmEditSymbol, addSubtaskSymbol, ulContainer, i) {
    isEditing = false;
    subtaskInput.disabled = false;
    subtaskListElement.contentEditable = false;
    confirmEditSymbol.src = "./assets/images/edit.svg";
    addSubtaskSymbol.classList.remove('dNone');
    trashcan.classList.remove('dNone');
    ulContainer.style.backgroundColor = '';

    confirmEditSymbol.onclick = function () {
        editSubtask(i);
    };
}


/**
 * Clears the task form by reinitializing the Add Task functionality with the default active section.
 */
function clearTaskForm() {
    initAddTask('tasks');
}


// ADD TO BOARD
/**
 * Adds a new task to the board with the provided details, updates the board state and redirects to board.
 * 
 * @param {string} priority - The priority of the task.
 * @throws {Error} Throws an error if required fields are not filled.
 */
async function addTaskToBoard(priority) {
    checkBoardState();
    if (priority == undefined || contactBubbles == '') { // Checks if the priority or contactBubbles is undefined/empty and shows an alert if true.
        alert("Please fill out all required(*) fields!");
    } else {
        tasks.push(new Task(title.value, description.value, contactBubbles, dueDate.value, prio, userCategoryselect, subtasks, boardState))
        await setItem('tasks', JSON.stringify(tasks));
        initAddTask('tasks');
        window.location.href = "board.html"; // Redirects to the board.html page.
    }
    saveBoardStateLocal(null);
}


/**
 * Checks and loads the board state from local storage.
 * If the board state is not found, sets it to a default value ('todo').
 */
function checkBoardState() {
    boardState = loadSavedBoardStateLocal();
    if (boardState == null) {
        boardState = 'todo'
    } else {
        boardState = boardState;
    }
}

/**
 * Formats a date string into the British date format (dd/mm/yyyy).
 *
 * @param {string} dateString - The date string to be formatted.
 * @returns {string} - The formatted date string in dd/mm/yyyy format.
 */
function formatDueDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-GB');
}