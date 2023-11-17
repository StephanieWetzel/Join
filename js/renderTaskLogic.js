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
    isCreatingAtBoard = true;
}

async function createContactAtBoard(){
    let firstLastName = splitString(fullName.value);
    contacts.push(new Contact(firstLastName[0], firstLastName[1], phone.value, mail.value));
    await setItem('contacts', JSON.stringify(contacts));
    await fetchContacts();
    closeCBoard();
    assignContact();
}

function closeCBoard(){
    document.getElementById('myModal').style = 'display:block;';
    document.querySelector(".add-contact").classList.add("d-none");
    document.querySelector(".add-form-content").classList.remove('formular-animation');
    
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
 * 
 */
function renderTaskCard(task) {
    return /*html*/`
        <div draggable="true" onclick="openTask(${task.uniqueIndex})" ondragstart="startDragging(${task.uniqueIndex})" class="status-board">
            <div style="display: flex; justify-content: space-between">
                <p class="${setCategoryStyle(task.category)}">${task.category}</p>
                <img onclick="toggleMoveToOptions(${task.uniqueIndex}, event)" class="mobileDots" src="assets/images/more_vert_blue.svg">
            </div>
            <div id="moveToOptions${task.uniqueIndex}" class="moveToOptions mobileOptionsAnimation moveToInvis">
                <div class="moveToOptionsPopup">
                    <h4>Move to:</h4>
                    <p onclick="moveToMobile('todo', ${task.uniqueIndex}, event)">To do</p>
                    <p onclick="moveToMobile('inProgress', ${task.uniqueIndex}, event)">In Progress</p>
                    <p onclick="moveToMobile('awaitFeedback', ${task.uniqueIndex}, event)">Await Feedback</p>
                    <p onclick="moveToMobile('done', ${task.uniqueIndex}, event)">Done</p>
                </div>
            </div>
            <p class="task-title"><b>${task.title}</b></p>
            <span class="short-info">${task.description}</span>
            <div class="flex-box">
                ${task.subtasks.length > 0 ?
            `<div class="progress">
                        <div class="progress-bar" data-task-index="${task.uniqueIndex}" id="progressBar${task.uniqueIndex}" role="progressbar"></div>
                    </div>` : ''
        }
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
    `;
}

/**
 * Moves a task to a new status on a mobile device.
 *
 * @param {string} state - The new status to which the task is moved.
 * @param {number} taskId - The unique index of the task being moved.
 */
async function moveToMobile(state, taskId){
    event.stopPropagation();
    tasks.forEach(task => {
        if (task.uniqueIndex == taskId) {
            task.state = state;
        }
    });
    await setItem('tasks', JSON.stringify(tasks));
    initBoard('board');
}

/**
 * Toggles the visibility of 'moveToOptions' for a specific task.
 *
 * @param {number} taskIndex - The unique index of the task associated with the 'moveToOptions'.
 * @param {Event} event - The event object to stop propagation.
 */
function toggleMoveToOptions(taskIndex,event){
    event.stopPropagation();
    let toggledOptions = document.getElementById('moveToOptions' + taskIndex);
    toggledOptions.classList.toggle('moveToInvis');
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
/**
 * Updates the width of a progress bar element and saves the width locally.
 *
 * @param {string} progressBarId - The ID of the progress bar element.
 * @param {number} width - The width percentage to set for the progress bar.
 */
function updateProgressBarWidth(progressBarId, width) {
    const progressBar = document.getElementById(progressBarId);
    if (progressBar) {
        progressBar.style.width = `${width}%`;
        saveProgressBarWidthLocal(progressBarId, width);
    }
}

/**
 * Updates the progress bar for a specific task based on the completion status of its subtasks.
 *
 * @param {number} taskIndex - The index of the task associated with the progress bar.
 */
function updateProgressBar(taskIndex) {
    const subtaskList = document.querySelector(`#subtaskIndex${taskIndex}`);
    const totalSubtasks = subtaskList ? subtaskList.querySelectorAll('li').length : 0;
    if (totalSubtasks > 0) {
        const completedSubtasks = subtaskStatus[taskIndex].filter(status => status).length;
        const percent = (completedSubtasks / totalSubtasks) * 100;
        const progressBarId = `progressBar${taskIndex}`;
        updateProgressBarWidth(progressBarId, percent);
        saveProgressBarWidthLocal(progressBarId, percent);
        saveSubtaskStatusLocal(subtaskStatus);
    } else {
        const progressBarId = `progressBar${taskIndex}`;
        const progressBar = document.getElementById(progressBarId);
        if (progressBar) {
            progressBar.style.display = 'none';
        }
    }
}

/**
 * Initializes the progress bar widths based on the provided data.
 *
 */
function initProgressBarWidth() {
    for (const [taskId, width] of Object.entries(progressBarWidth)) {
        updateProgressBarWidth(taskId, width);
    }
}

/**
 * Toggles the images for a specific subtask based on its completion status.
 *
 * @param {number} index - The index of the subtask.
 * @param {number} taskIndex - The index of the task associated with the subtask.
 */
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

    updateProgressBar(taskIndex);
}