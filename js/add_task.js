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
    isCreatingAtTask = true;
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
/**
 * Opens the contact form in the context of a task, setting relevant states and applying animations.
 * 
 */
function openContactFormETask() {
    removeAllActiveStates();
    document.querySelector(".add-contact").classList.remove("d-none");
    document.querySelector(".add-form-content").classList.add("formular-animation");
    if (isCreatingAtBoard) {
        document.getElementById('myModal').style = 'display:none;';
    }
}
/**
 * Asynchronously creates a new contact, updates the contacts list, and performs additional actions related to tasks.
 * 
 */
async function createContactAtTask(){
    let firstLastName = splitString(fullName.value);
    contacts.push(new Contact(firstLastName[0], firstLastName[1], phone.value, mail.value));
    await setItem('contacts', JSON.stringify(contacts));
    await fetchContacts();
    closeAddCATask();
    assignContact();
}
/**
 * Closes the add contact section by hiding the relevant elements and removing animation classes.
 */
function closeAddCATask(){
    document.querySelector(".add-contact").classList.add("d-none");
    document.querySelector(".add-form-content").classList.remove('formular-animation');
}
