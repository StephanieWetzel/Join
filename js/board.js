let currentDraggedElement;
let subtaskStatus = {};

async function initBoard(activeSection) {
    loadLocalStorageLoggedInUser('loggedInUser');
    await includeHTML();
    await fetchTasks();
    await fetchContacts();
    markActiveSection(activeSection);
    setHeaderInitials(logInUser);
    classifyTask();
    filterTasksByTitle();
    assignContact();
}


let modal;
//let backToBoardBtn;


// Überprüfen Sie die Bildschirmbreite beim Laden der Seite und öffnen Sie ggf. das Overlay
//window.addEventListener("load", openModal);

// Überwachen Sie das Ändern der Bildschirmbreite
window.addEventListener("resize", checkScreenWidth);

function checkScreenWidth() {
    // backToBoardBtn = document.getElementById('backToBoardBtn');
    modal = document.getElementById("myModal");
    if (window.innerWidth < 600) {
        // Überprüfen, ob das Overlay geöffnet ist
        if (modal.style.display === "block") {
            window.location.href = 'addTask.html';
            // backToBoardBtn.classList.remove('d-none');    
        }
    }
}


function openModal() {
    modal = document.getElementById("myModal");
    // backToBoardBtn = document.getElementById('backToBoardBtn');
    if ((window.innerWidth > 600)) {
        fetch("assets/templates/addTask.template.html")
            .then((response) => response.text())
        modal.style.display = "block";
        document.body.style.overflow = 'hidden';
        // backToBoardBtn.style.display == 'none';
    } else {
        // backToBoardBtn.style.display == 'block';
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
 * This function displays the task with more information for the user.
 * 
 * @param {object} task - Represantative for the Task -class object
 */
function renderBigTask(task, taskId) {
    let openedTask = document.getElementById('customModal');
    openedTask.innerHTML =/*html*/`
    <div class="open-task">
            <div id="customModals${task.uniqueIndex}" class="card-content">
                <button onclick="closeTask()" id="closeModal"><img src="assets/images/close.svg" alt=""></button>
                <div class="status-board status-board-open">
                    <p class="${setCategoryStyle(task.category)}">${task.category}</p>
                    <p class="headline"><b>${task.title}</b></p>
                    <span class="taskInformation">${task.description}</span>
                    <span style="color: #42526E;">Due Date: <span class="m-left1">${formatDueDate(task.date)}</span></span>
                    <span style="color: #42526E;">Priority: <span class="m-left2">${task.priority}<img class="board-img" src="assets/images/${task.priority}_symbol.svg" alt=""></span></span>
                    <span style="color: #42526E;">Assigned To:</span>
                    <div>
                    ${task.assignedContacts ? task.assignedContacts.map(contact => /*html*/`
                    <div class="assignedFrom">
                        <div class="contact-bubble small contactBubbleAddTask" style="background-color: ${contact.color}">
                        ${contact.initials}
                        </div>
                        <span>${contact.firstName} ${contact.lastName}</span>
                    </div>
                    `).join('') : ''} 
               </div>
                    <span style="color: #42526E;">Subtasks</span>
                    <span>
                        <ul id="subtaskIndex${task.uniqueIndex}">
                            ${task.subtasks.map(subtask => `
                                <li class="list-style">
                                <img class="chop-image initial-image" src="assets/images/chop.svg" onclick="toggleSubtaskImage(${task.subtasks.indexOf(subtask)}, ${task.uniqueIndex});" alt="">
                                <img class="rectangle-image changed-image" src="assets/images/Rectangle.svg" onclick="toggleSubtaskImage(${task.subtasks.indexOf(subtask)}, ${task.uniqueIndex});" alt="">
                                ${subtask}
                                </li>
                            `).join('')}
                        </ul>
                    </span>
                    </div>
                    <div class="openBoard-options">
                    <div class="border-right hover-bg">
                        <img class="delete-img" src="assets/images/delete.svg" alt="">
                        <img class="delete-img" src="assets/images/Delete-shrift-black.svg" alt="">
                        <img class="hover-img" onclick="deleteTask(${task.uniqueIndex})" src="assets/images/delete-blue.svg" alt="">
                        <img class="hover-img" onclick="deleteTask(${task.uniqueIndex})" src="assets/images/Delete-shrift.svg" alt="">
                    </div>
                    <div class="hover-bg">
                        <img class="delete-img" src="assets/images/edit.svg" alt="">
                        <img class="delete-img" src="assets/images/Edit-shrift-black.svg" alt="">
                        <img class="hover-img" onclick="openEditTaskPopup(${task.uniqueIndex})" src="assets/images/edit-blue.svg" alt="">
                        <img class="hover-img" onclick="openEditTaskPopup(${task.uniqueIndex})" src="assets/images/Edit-shrift.svg" alt="">
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>`
}




//Progress Bar

function toggleSubtaskImage(index, taskIndex) {
    const chopImg = document.querySelectorAll('.chop-image')[index];
    const rectangleImg = document.querySelectorAll('.rectangle-image')[index];
    const progressBar1 = document.getElementById(`progressBar${taskIndex}`);
    const subtaskList = document.querySelector(`#subtaskIndex${taskIndex}`);

    if (!subtaskStatus[taskIndex]) {
        subtaskStatus[taskIndex] = [];
    }

    subtaskStatus[taskIndex][index] = !subtaskStatus[taskIndex][index];

    if (subtaskStatus[taskIndex][index]) {
        chopImg.classList.remove('initial-image');
        chopImg.classList.add('changed-image');
        rectangleImg.classList.remove('changed-image');
        rectangleImg.classList.add('initial-image');
    } else {
        chopImg.classList.remove('changed-image');
        chopImg.classList.add('initial-image');
        rectangleImg.classList.remove('initial-image');
        rectangleImg.classList.add('changed-image');
    }

    const totalSubtasks = subtaskList.querySelectorAll('li').length;
    const completedSubtasks = subtaskStatus[taskIndex].filter(status => status).length;
    const percent = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

    if (progressBar1) {
        progressBar1.style.width = `${percent}%`;
    }
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


function deleteTask(taskId) {
    const taskIndex = tasks.findIndex(task => task.uniqueIndex === taskId);

    if (taskIndex !== -1) {
        tasks.splice(taskIndex, 1);
        setItem('tasks', JSON.stringify(tasks));
        closeTask();
        initBoard('board');
    }
}


function openEditTaskPopup(taskId) {
    let createBtn = document.getElementById('createTaskBtn');
    let okBtn = document.getElementById('okBtn');
    let clearBtn = document.getElementById('clearBtn');
    let selectedTask = tasks.find(task => task.uniqueIndex === taskId);
    subtasks = selectedTask.subtasks;
    if (selectedTask) {
        document.getElementById("title").value = selectedTask.title;
        document.getElementById("description").value = selectedTask.description;
        document.getElementById("dueDate").value = selectedTask.date;
        document.getElementById("categoryInputField").value = selectedTask.category;

        handlePriorities(selectedTask.priority);
        renderSubtasks();
        showAlreadyAssContactsEdit(selectedTask.assignedContacts);
        //showAssignedContacts(selectedTask.assignedContacts);

        const modal = document.getElementById("myModal");
        modal.style.display = "block";
        createBtn.classList.add('d-none');
        okBtn.classList.remove('d-none');
        clearBtn.classList.add('d-none');
        closeTask();
    }
}


function showAlreadyAssContactsEdit(selectedTaskContacts) {
    for (let i = 0; i < contacts.length; i++) {
        ;
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


function assignedContactsTemplateEdit(contactEdit) {
    return `
        <div id="assignedContact" class="contact-bubble small contactBubbleAddTask selectedContactBubble" style="background-color: ${contactEdit}">${initials}</div>
    `;
}


function saveEditTask(taskId) {
    deleteTask(taskId); // Lösche die alte Aufgabe
    const taskIndex = tasks.findIndex(task => task.uniqueIndex === taskId);

    if (taskIndex == -1) {
        tasks.splice(taskIndex, 1, {
            uniqueIndex: taskId,
            title: document.getElementById("title").value,
            description: document.getElementById("description").value,
            date: document.getElementById("dueDate").value,
            category: document.getElementById("categoryInputField").value,
            priority: prio,
            subtasks: subtasks,
            assignedContacts: contactBubbles
        });

        setItem('tasks', JSON.stringify(tasks));
        closeModal();
        initBoard('board');
    }
}