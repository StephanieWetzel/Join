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