


async function init(activeSection) {
    loadLocalStorageLoggedInUser('loggedInUser');
    await includeHTML();
    markActiveSection(activeSection);
    setHeaderInitials(logInUser);
    await fetchTasks();
    closeTask();
    openModal();
    closeModal();
    renderTasks();
}


function openModal() {
    const modal = document.getElementById("myModal");


    fetch("assets/templates/addTask.template.html")
        .then((response) => response.text())
    modal.style.display = "block";
}



function closeModal() {
    const modal = document.getElementById("myModal");

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    modal.style.display = "none";
}


function openTask() {
    let modal = document.getElementById("customModal");
    modal.style.display = 'block';
}


function closeTask() {
    const modal = document.getElementById("customModal");

    modal.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }

    modal.style.display = "none";
}


function renderTasks() {
    const newTask = document.getElementById('newTask');
    newTask.innerHTML = '';
    debugger
    tasks.forEach(task => {
        const taskHTML = `
            <div class="status-board">
                <p class="user-story">User Story</p>
                <p><b>${task.title}</b></p>
                <span class="short-info">${task.description}</span>
                <div class="flex-box">
                    <div class="progress">
                        <div class="progress-bar" id="progressBar" role="progressbar"></div>
                    </div>
                    <p>${task.subtasks.length}/${task.totalSubtasks} Subtasks</p>
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

        newTask.innerHTML += taskHTML;
    });
}