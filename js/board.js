let currentDraggedElement;
let selectedSubtaskIndex = null;
let subtaskStatus = {};
let progressBarWidth = {};
let modal;

async function initBoard(activeSection) {
    console.log(tasks)
    loadLocalStorageLoggedInUser('loggedInUser');
    await includeHTML();
    await fetchTasks();
    await fetchContacts();
    markActiveSection(activeSection);
    setHeaderInitials(logInUser);
    classifyTask();
    filterTasksByTitle();
    assignContact();
    subtaskStatus = loadSubtaskStatusLocal() || {};
    progressBarWidth = loadProgressBarWidthLocal() || {}; // Ändere hier

    initProgressBarWidth();
}

window.addEventListener("resize", checkScreenWidth);

/**
 * Checks the screen width and redirects if necessary.
 *
 */
function checkScreenWidth() {
    modal = document.getElementById("myModal");
    if (window.innerWidth <= 600) {
        if (modal.style.display === "block") {
            window.location.href = 'addTask.html';
        }
    }
}


function openModal() {
    modal = document.getElementById("myModal");
    if ((window.innerWidth > 600)) {
        fetch("assets/templates/addTask.template.html")
            .then((response) => response.text())
        modal.style.display = "block";
        document.body.style.overflow = 'hidden';
    } else {
        window.location.href = 'addTask.html';
    }
}


function closeModal() {
    modal = document.getElementById("myModal");

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    modal.style.display = "none";
    document.body.style.overflow = 'visible';
    saveEditedTaskIdLocal(null)
    initBoard('board');
}


// Fügen Sie die Modal-Überprüfung hinzu, wenn sich der Bildschirm nach dem Schließen des Modals ändert
window.addEventListener("resize", checkScreenWidth);


// function redirectToBoard() {
//     window.location.href = "board.html";
// }



function openTask(taskUIndex) {
    let modal = document.getElementById("customModal");
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    tasks.forEach(task => {
        if (task.uniqueIndex == taskUIndex) {
            renderBigTask(task)
        }
    });
}


function closeTask() {
    const modal = document.getElementById("customModal");

    modal.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }
    modal.style.display = "none";
    document.body.style.overflow = 'visible';
}

/**
 * Classifies tasks into different categories and filters them accordingly.
 * Tasks are categorized based on their current state and filtered into their categories
 * like 'todo', 'inProgress', 'awaitFeedback', and 'done'.
 * 
 */
function classifyTask() {
    filterTasks('todo', 'noTodo');
    filterTasks('inProgress', 'noProgress');
    filterTasks('awaitFeedback', 'noFeedback');
    filterTasks('done', 'noDone');
}

/**
 * This function filters the available tasks by its state (todo, in progress, await feedback etc) and displays them at its section. If there is no Task for an section , no task todo will be shown
 * 
 * @param {string} state - The parameter which to sort, also for the ID of its div-element
 * @param {string} noTaskID - ID for the no task todo div element
 * @returns 
 */
function filterTasks(state, noTaskID) {
    filteredTasks = tasks.filter(t => t.state == state);
    document.getElementById(state).innerHTML = '';
    if (filteredTasks.length > 0) {
        document.getElementById(noTaskID).style.display = "none";
        filteredTasks.forEach((fTask) => {
            document.getElementById(state).innerHTML += renderTaskCard(fTask);
            document.getElementById(state).classList.remove('noAvailableTask');
        });
    } else {
        document.getElementById(noTaskID).style.display = "flex";
        document.getElementById(state).classList.add('noAvailableTask');
    }
    return filteredTasks
}

/**
 * This function sets the class for the respective category
 * 
 * @param {string} category - Hand over class name
 * @returns 
 */
function setCategoryStyle(category) {
    if (category == "User Story") {
        return "user-story"
    } else if (category == "Technical Task") {
        return "technical-task"
    }
}

/**
 * This function displays the small card for a task
 * 
 * @param {object} task - Represantative for the Task -class object
 * @returns 
 */
function renderTaskCard(task) {
    return /*html*/`
        <div draggable="true" onclick="openTask(${task.uniqueIndex})" ondragstart="startDragging(${task.uniqueIndex})" class="status-board">
            <p class="${setCategoryStyle(task.category)}">${task.category}</p>
            <p class="task-title"><b>${task.title}</b></p>
            <span class="short-info">${task.description}</span>
            <div class="flex-box">
                <div class="progress">
                    <div class="progress-bar" data-task-index="${task.uniqueIndex}" id="progressBar${task.uniqueIndex}" role="progressbar"></div>
                </div>
                <p>${task.subtasks.length} Subtasks</p>
            </div>
            <div class="priority">
                <div class="priority-text">
                ${task.assignedContacts ? task.assignedContacts.map(contact => `
                    <div class="contact-bubble small contactBubbleAddTask" style="background-color: ${contact.color}">
                        ${contact.initials}
                    </div>
                `).join('') : ''}
                </div>
                <img src="./assets/images/${task.priority}_symbol.svg">
            </div>
        </div>
        `
}

/**
 * Renders the content of the big task view in the modal.
 *
 * @param {Object} task - The task object containing details to be displayed in the big task view.
 * @param {string} taskId - The unique identifier of the task.
 */
function renderBigTask(task, taskId) {
    let openedTask = document.getElementById('customModal');
    openedTask.innerHTML =/*html*/`
    <div class="open-task">
        <div id="customModals${task.uniqueIndex}" class="card-content">
            <button onclick="closeTask()" id="closeModal"><img src="assets/images/close.svg" alt=""></button>
            <div class="status-board status-board-open">
                ${renderBigTaskHead(task)}
                <div>${renderBigTaskAssignendContacts(task)}</div>
                ${renderBigTaskSubtasks(task)}
                <div class="openBoard-options">
                    <div class="border-right hover-bg">${renderDeleteButton(task.uniqueIndex)}</div>
                    <div class="hover-bg">${renderEditButton(task.uniqueIndex)}</div>
                </div>
            </div>
        </div>`
}

/**
 * Generates HTML template for displaying subtasks in the big task view.
 * 
 * @param {Object} task - The task object containing subtasks to be displayed.
 * @returns {string} The HTML template for displaying subtasks in the big task view.
 */
subtaskStatus = loadSubtaskStatusLocal() || {};
function renderBigTaskSubtasks(task) {
    return /*html*/`
    <span style="color: #42526E;">Subtasks</span>
    <span>
    <ul id="subtaskIndex${task.uniqueIndex}">
        ${task.subtasks.map((subtask, index) => `
        <li class="list-style">
            <img id="chopImg" class="chop-image ${subtaskStatus[task.uniqueIndex] && subtaskStatus[task.uniqueIndex][index] ? 'changed-image' : 'initial-image'}" src="assets/images/chop.svg" onclick="toggleSubtaskImage(${index}, ${task.uniqueIndex});" alt="">
            <img class="rectangle-image ${subtaskStatus[task.uniqueIndex] && subtaskStatus[task.uniqueIndex][index] ? 'initial-image' : 'changed-image'}" src="assets/images/Rectangle.svg" onclick="toggleSubtaskImage(${index}, ${task.uniqueIndex});" alt="">
            ${subtask}
        </li>
        `).join('')}
    </ul>
    </span>
    `
}
/**
 * Generates HTML template for displaying assigned contacts in the big task view.
 *
 * @param {Object} task - The task object containing assigned contacts to be displayed.
 * @returns {string} The HTML template for assigned contacts in the big task view.
 */
function renderBigTaskAssignendContacts(task) {
    return /*html*/ `
    ${task.assignedContacts ? task.assignedContacts.map(contact => /*html*/`
    <div class="assignedFrom">
        <div class="contact-bubble small contactBubbleAddTask" style="background-color: ${contact.color}">
            ${contact.initials}
        </div>
        <span>${contact.firstName} ${contact.lastName}</span>
    </div>
    `).join('') : ''} 
    `
}

/**
 * Generates HTML template for the header of a big task display.
 *
 * @param {Object} task - The task object containing details to be displayed in the header.
 * @returns {string} The HTML template for the big task header.
 */
function renderBigTaskHead(task) {
    return /*html*/`
    <p class="${setCategoryStyle(task.category)}">${task.category}</p>
    <p class="headline"><b>${task.title}</b></p>
    <span class="taskInformation">${task.description}</span>
    <span style="color: #42526E;">Due Date: <span class="m-left1">${formatDueDate(task.date)}</span></span>
    <span style="color: #42526E;">Priority: <span class="m-left2">${task.priority}<img class="board-img" src="assets/images/${task.priority}_symbol.svg" alt=""></span></span>
    <span style="color: #42526E;">Assigned To:</span>
    `
}

/**
 * Generates HTML template for a delete button with hover effects.
 *
 * @param {string} uniqueIndex - The unique identifier of the task associated with the delete button.
 */
function renderDeleteButton(uniqueIndex) {
    return /*html*/`
        <img class="delete-img" src="assets/images/delete.svg" alt="">
        <img class="delete-img" src="assets/images/Delete-shrift-black.svg" alt="">
        <img class="hover-img" style="display: none;" onclick="deleteTask(${uniqueIndex})" src="assets/images/delete-blue.svg" alt="">
        <img class="hover-img" style="display: none;" onclick="deleteTask(${uniqueIndex})" src="assets/images/Delete-shrift.svg" alt="">
    `
}

/**
 * Generates HTML template for an edit button with hover effects.
 *
 * @param {string} uniqueIndex - The unique identifier of the task associated with the edit button.
 */
function renderEditButton(uniqueIndex) {
    return /*html*/`
        <img class="delete-img" src="assets/images/edit.svg" alt="">
        <img class="delete-img" src="assets/images/Edit-shrift-black.svg" alt="">
        <img class="hover-img" style="display: none;" onclick="openEditTaskPopup(${uniqueIndex})" src="assets/images/edit-blue.svg" alt="">
        <img class="hover-img" style="display: none;" onclick="openEditTaskPopup(${uniqueIndex})" src="assets/images/Edit-shrift.svg" alt="">
    `
}


//Progress Bar
function updateProgressBarWidth(progressBarId, width) {
    const progressBar = document.getElementById(progressBarId);
    if (progressBar) {
        progressBar.style.width = `${width}%`;
        saveProgressBarWidthLocal(progressBarId, width);
    }
}


function updateProgressBar(taskIndex) {
    const subtaskList = document.querySelector(`#subtaskIndex${taskIndex}`);
    const totalSubtasks = subtaskList.querySelectorAll('li').length;
    const completedSubtasks = subtaskStatus[taskIndex].filter(status => status).length;
    const percent = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

    const progressBarId = `progressBar${taskIndex}`;
    updateProgressBarWidth(progressBarId, percent);
    saveProgressBarWidthLocal(progressBarId, percent);
    saveSubtaskStatusLocal(subtaskStatus);
}


function initProgressBarWidth() {
    for (const [taskId, width] of Object.entries(progressBarWidth)) {
        updateProgressBarWidth(taskId, width);
    }
}


function toggleSubtaskImage(index, taskIndex) {
    const chopImg = document.querySelectorAll('.chop-image')[index];
    const rectangleImg = document.querySelectorAll('.rectangle-image')[index];

    if (!subtaskStatus[taskIndex]) {
        subtaskStatus[taskIndex] = [];
    }

    subtaskStatus[taskIndex][index] = !subtaskStatus[taskIndex][index];
    const isSubtaskCompleted = subtaskStatus[taskIndex][index];
    chopImg.classList.toggle('initial-image', !isSubtaskCompleted);
    chopImg.classList.toggle('changed-image', isSubtaskCompleted);
    rectangleImg.classList.toggle('initial-image', isSubtaskCompleted);
    rectangleImg.classList.toggle('changed-image', !isSubtaskCompleted);

    updateProgressBar(taskIndex); // Rufe die Funktion auf, um den Fortschrittsbalken zu aktualisieren und die Daten zu speichern
}




//Filter Function

function filterTasksByTitle() {
    const input = document.getElementById('searchInput');
    const searchTerm = input.value.trim().toLowerCase();
    const taskContainers = document.querySelectorAll('.newTask');
    const noFeedback = document.getElementById('noFeedback')
    taskContainers.forEach((taskContainer) => {
        const titleElement = taskContainer.querySelector('.task-title');
        if (titleElement) {
            const title = titleElement.textContent.toLowerCase();
            if (title.includes(searchTerm)) {
                taskContainer.style.display = 'block';
            } else {
                taskContainer.style.display = 'none';
                noFeedback.style.display = 'none';
            }
        }
    });
}



document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchInput');

    if (searchInput) {
        searchInput.addEventListener('keyup', function () {
            filterTasksByTitle();
        })
    }
})



//Drag n' Drop

/**
 * Allows a drop event by preventing its default behavior, making an element droppable.
 *
 * @param {Event} event - The drop event object.
 */
function allowDrop(event) {
    event.preventDefault();
}

/**
 * Initiates the dragging operation by setting the currently dragged element.
 *
 * @param {string} id - The identifier of the element to be dragged.
 */
function startDragging(id) {
    currentDraggedElement = id;
}

/**
 * Moves a task to a new state and updates the task list in local storage.
 * 
 * @param {string} state - The new state to which the task should be moved.
 */
async function moveTo(state) {
    tasks.forEach(task => {
        if (task.uniqueIndex == currentDraggedElement) {
            task.state = state;
        }
    });
    await setItem('tasks', JSON.stringify(tasks));
    initBoard('board');
}

/**
 * This function removes the task with the given taskId from the tasks array, saves the updated tasks to local storage,
 * closes the task details popup, and then initializes the board to reflect the changes.
 *
 * @param {string} taskId - The unique identifier of the task to be deleted.
 */
function deleteTask(taskId) {
    const taskIndex = tasks.findIndex(task => task.uniqueIndex === taskId);

    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        setItem('tasks', JSON.stringify(tasks));
        closeTask();
        initBoard('board');
    }
}

/**
 * Opens the edit task popup and initializes the edit form with task details.
 *
 * @param {string} taskId - The unique identifier of the task to be edited.
 */
function openEditTaskPopup(taskId) {
    let createBtn = document.getElementById('createTaskBtn');
    let clearBtn = document.getElementById('clearBtn');
    let modal = document.getElementById("myModal");
    let selectedTask = tasks.find(task => task.uniqueIndex === taskId);
    subtasks = selectedTask.subtasks;
    printEditButton(taskId);
    if (selectedTask && window.innerWidth > 600) {
        setTaskToEdit(selectedTask);
    } else if (selectedTask && window.innerWidth < 600 && window.location.href.includes('board.html')) {
        saveEditedTaskIdLocal(selectedTask.uniqueIndex);
        window.location.href = 'addTask.html';
    } else if (selectedTask && window.location.href.includes('addTask.html')) {
        setTaskToEdit(selectedTask);
    }
}

/**
 * Sets up the edit form with details of the selected task.
 *
 * @param {Object} selectedTask - The task object to be edited.
 */
function setTaskToEdit(selectedTask) {
    changeEditValues(selectedTask);
    handlePriorities(selectedTask.priority);
    renderSubtasks();
    showAlreadyAssContactsEdit(selectedTask.assignedContacts);
    checkIfBoardLocation();
    checkifCloseTaskNecessary();
}

/**
 * Checks if the current page is 'board.html' and performs related actions.
 * Displays the modal div if the current page is 'board.html'
 * 
 */
function checkIfBoardLocation() {
    let createBtn = document.getElementById('createTaskBtn');
    let clearBtn = document.getElementById('clearBtn');
    let modal = document.getElementById("myModal");
    if (window.location.href.includes('board.html')) {
        modal.style.display = 'block';
    }
    createBtn.classList.add('d-none');
    clearBtn.classList.add('d-none');
}

/**
 * Checks if closing the task is necessary based on the current page URL.
 *
 */
function checkifCloseTaskNecessary() {
    if (window.location.href.includes('board.html')) {
        closeTask();
    }
}

/**
 * Changes the values in the editTask form based on the properties of the selected task.
 *
 * @param {Object} selectedTask - The task object whose properties will be used to update the edit form.
 */
function changeEditValues(selectedTask) {
    document.getElementById("title").value = selectedTask.title;
    document.getElementById("description").value = selectedTask.description;
    document.getElementById("dueDate").value = selectedTask.date;
    document.getElementById("categoryInputField").value = selectedTask.category;
    saveEditedTaskIdLocal(selectedTask.uniqueIndex);
}

/**
 * Prints the edit button for a selected task with the provided task ID.
 *
 * @param {string} taskId - The unique identifier of the task to be edited.
 */
function printEditButton(taskId) {
    let okDiv = document.getElementById('okBtnDiv');
    okDiv.innerHTML = /*html*/`
    <button id="okBtn" onclick="saveEditTask(${taskId})" type="button" class="addTaskBtn createBtn">
        Ok
        <img src="assets/images/check.svg" alt="weißer Haken">
    </button>
    `
}

/**
 * Displays already assigned contacts at editing a task and checks corresponding checkboxes.
 *
 * @param {Array<Object>} selectedTaskContacts - The array of contacts already assigned to the task.
 */
function showAlreadyAssContactsEdit(selectedTaskContacts) {
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        initials = getInitials(contact.firstName, contact.lastName);
        const contactCheckbox = document.getElementById(`checkbox${i}`)
        for (let j = 0; j < selectedTaskContacts.length; j++) {
            const sAssContact = selectedTaskContacts[j];
            if (contact.firstName == sAssContact.firstName && contact.lastName == sAssContact.lastName) {
                contactCheckbox.checked = true;
                assignedContacts.innerHTML += assignedContactsTemplateEdit(contact.color);
            }
        }
    }
}

/**
 * Generates HTML template for an assigned contact bubble in an edit context.
 * 
 * @param {string} contactEdit - The color of the contact bubble.
 * @returns {string} The HTML template for the assigned contact bubble.
 */
function assignedContactsTemplateEdit(contactEdit) {
    return `
        <div id="assignedContact" class="contact-bubble small contactBubbleAddTask selectedContactBubble" style="background-color: ${contactEdit}">${initials}</div>
    `;
}


/**
 * Saves the edited task information, updates the tasks array, and performs necessary actions for the edited task.
 *
 * @param {string} taskId - The unique identifier of the task being edited.
 * @param {string[]} updatedSubtasks - Extracts updated subtasks from the form after they were edited.
 */
async function saveEditTask(taskId) {
    showAssignedContacts();

    const updatedSubtasks = extractSubtasksFromForm();

    tasks.forEach(task => { // Iterates through the tasks array and updates the information of the task with the specified unique index.
        if (task.uniqueIndex === taskId) {
            console.log(task);
            task.title = title.value;
            task.description = description.value;
            task.date = dueDate.value;
            task.assignedContacts = contactBubbles;
            task.priority = prio;
            task.category = categoryInputField.value;
            task.subtasks = updatedSubtasks;
        }
    });
    subtasks = [];
    await setItem('tasks', JSON.stringify(tasks));
    checkIfRedirectionToBoardIsAvailable();
}


/**
 * Extracts the updated subtasks from the subtask form in the UI (Board).
 *
 * @returns {string[]} - An array containing the updated subtasks.
 * @param {HTMLElement} subtaskList - The HTML element representing the container for subtasks in the UI.
 * @param {NodeList} subtaskInputs - The NodeList containing all subtask list elements in the subtask form.
 * @param {string[]} updatedSubtasks - An array to store the updated subtasks.
 *
 */
function extractSubtasksFromForm() {
    const subtaskList = document.getElementById('subtaskContainer');
    const subtaskInputs = subtaskList.querySelectorAll('.subtaskListElements');
    const updatedSubtasks = [];

    for (let i = 0; i < subtaskInputs.length; i++) { // Iterates through the subtask list elements and extracts the text content as updated subtasks.
        const subtaskInput = subtaskInputs[i];
        updatedSubtasks.push(subtaskInput.innerText);
    }

    return updatedSubtasks; // Returns the array containing the updated subtasks.
}


/**
 * Checks if the current page is 'board.html', and takes appropriate actions.
 * 
 */
function checkIfRedirectionToBoardIsAvailable() {
    if (window.location.href.includes('board.html')) {
        initBoard('board');
        closeModal();
    } else {
        window.location.href = 'board.html';
    }
    saveEditedTaskIdLocal(null);
}

/**
 * Saves the provided task ID to local storage for later retrieval.
 * 
 * @param {string|number} taskId - The ID of the task to be edited
 */
function saveEditedTaskIdLocal(taskId) {
    let eTaskAsJSON = JSON.stringify(taskId);
    localStorage.setItem('taskToEdit', eTaskAsJSON);
}
/**
 * Retrieves and parses the edited task from local storage.
 * 
 * @returns {Object|null} The edited task object, or null if not found.
 */
function loadEditedTaskLocal() {
    if (localStorage.getItem('taskToEdit')) {
        let etaskAsJSON = localStorage.getItem('taskToEdit');
        eTask = JSON.parse(etaskAsJSON);
        return eTask;
    }
}


function saveSubtaskStatusLocal(taskId) {
    let subtaskAsJSON = JSON.stringify(taskId);
    localStorage.setItem('subtaskStatus', subtaskAsJSON);
}


function saveProgressBarWidthLocal(taskId, width) {
    const progressBarWidth = loadProgressBarWidthLocal();
    progressBarWidth[taskId] = width;
    localStorage.setItem('progressBarWidth', JSON.stringify(progressBarWidth));

    console.log('ProgressBar-Breite gespeichert:', taskId, width);
}


function loadSubtaskStatusLocal() {
    if (localStorage.getItem('subtaskStatus')) {
        let subtaskAsJSON = localStorage.getItem('subtaskStatus');
        return JSON.parse(subtaskAsJSON);
    }
    return {};
}


function loadProgressBarWidthLocal() {
    let progressBarWidth = JSON.parse(localStorage.getItem('progressBarWidth')) || {};
    console.log('ProgressBar-Breite geladen:', progressBarWidth);

    return progressBarWidth; // Gebe progressBarWidth direkt zurück
}