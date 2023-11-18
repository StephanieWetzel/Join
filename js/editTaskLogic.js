/**
 * Opens the edit task popup and initializes the edit form with task details.
 *
 * @param {string} taskId - The unique identifier of the task to be edited.
 */
function openEditTaskPopup(taskId) {
    document.getElementById('addTaskHeading').innerText = 'Edit Task'
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

    // Überprüfe, ob der Titel nicht leer ist
    if (title.value.trim() === "") {
        alert("Please enter a title before saving the task.");
        return; // Verlasse die Funktion, wenn der Titel leer ist
    }

    // Überprüfe, ob das Datum nicht leer ist
    if (dueDate.value.trim() === "") {
        alert("Please enter a due date before saving the task.");
        return; // Verlasse die Funktion, wenn das Datum leer ist
    }

    // Überprüfe, ob mindestens ein Kontakt zugewiesen ist
    if (contactBubbles.length === 0) {
        alert("Please assign at least one contact before saving the task.");
        return; // Verlasse die Funktion, wenn kein Kontakt zugewiesen ist
    }

    tasks.forEach(task => { // Iterates through the tasks array and updates the information of the task with the specified unique index.
        if (task.uniqueIndex === taskId) {
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
 * Overwrites task data with updated values, including subtasks.
 * 
 * @param {Object} task - The task object to be updated.
 * @param {Array} updatedSubtasks - The array of updated subtasks for the task.
 */
function overWriteTaskData(task, updatedSubtasks) {
    task.title = title.value;
    task.description = description.value;
    task.date = dueDate.value;
    task.assignedContacts = contactBubbles;
    task.priority = prio;
    task.category = categoryInputField.value;
    task.subtasks = updatedSubtasks;
}