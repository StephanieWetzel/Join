let todos;
let inProgress;
let awaitFeedback;
let done;
let currentDraggedElement;

async function initBoard(activeSection) {
    loadLocalStorageLoggedInUser('loggedInUser');
    await includeHTML();
    markActiveSection(activeSection);
    setHeaderInitials(logInUser);
    await fetchTasks();
    classifyTask();
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
    initBoard('board');
}


function openTask(taskUIndex) {
    let modal = document.getElementById("customModal");
    modal.style.display = 'block';
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
}

function classifyTask(){
    todos = filterTasks('todo', 'noTodo');
    inProgress = filterTasks('inProgress', 'noProgress');
    awaitFeedback = filterTasks('awaitFeedback', 'noFeedback');
    done = filterTasks('done', 'noDone');
}

function filterTasks(state, noTaskID){
    filteredTasks = tasks.filter(t => t.state == state);
    document.getElementById(state).innerHTML = '';
    if (filteredTasks.length > 0) {
        document.getElementById(noTaskID).style.display = "none";
        filteredTasks.forEach((fTask, index) => {
            document.getElementById(state).innerHTML += renderTaskCard(fTask);
        }); 
    }else{
        document.getElementById(noTaskID).style.display = "flex";
    }
    return filteredTasks
}

function setCategoryStyle(category){
    if (category == "User Story") {
        return "user-story"
    }else if (category == "Technical Task") {
        return "technical-task"
    }
}

function renderTaskCard(task) {
    return /*html*/`
        <div draggable="true" onclick="openTask(${task.uniqueIndex})" ondragstart="startDragging(${task.uniqueIndex})" class="status-board">
            <p class="${setCategoryStyle(task.category)}">${task.category}</p>
            <p><b>${task.title}</b></p>
            <span class="short-info">${task.description}</span>
            <div class="flex-box">
                <div class="progress">
                    <div class="progress-bar" id="progressBar" role="progressbar"></div>
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

function renderBigTask(task) {
    debugger
    let openedTask = document.getElementById('customModal');
    openedTask.innerHTML =/*html*/`
    <div class="open-task">
            <div>
                <button onclick="closeTask()" id="closeModal"><img src="/assets/images/close.svg" alt=""></button>
                <div class="status-board status-board-open">
                    <p class="${setCategoryStyle(task.category)}">${task.category}</p>
                    <p class="headline"><b>${task.title}</b></p>
                    <span class="taskInformation">${task.description}</span>
                    <span style="color: #42526E;">Due Date: <span class="m-left1">${formatDueDate(task.date)}</span></span>
                    <span style="color: #42526E;">Priority: <span class="m-left2">${task.priority}<img class="board-img" src="./assets/images/urgent_symbol.svg" alt=""></span></span>
                    <span style="color: #42526E;">Assigned To:</span>
                    <div>
                    ${task.assignedContacts ? task.assignedContacts.map(contact => /*html*/`
                    <div class="assignedFrom">
                        <div class="contact-bubble small contactBubbleAddTask" style="background-color: ${contact.color}">
                        ${contact.initials}
                        </div><span>${contact.firstName} ${contact.lastName}</span>
                    </div>
                    `).join('') : ''}
                    </div>
                    <span style="color: #42526E;">Subtasks</span>
                    <div>
                        <span><img src="./assets/images/chop.svg" alt=""></span>
                        <span><img src="./assets/images/Rectangle.svg" alt=""></span>
                        <span>Implement Recipe Recommendation</span>
                    </div>
                    <div class="openBoard-options">
                        <img src="./assets/images/delete.svg" alt="">
                        <span>Delete</span>
                        <img src="./assets/images/edit.svg" alt="">
                        <span>Edit</span>
                    </div>
                </div>
            </div>
        </div>`

}



//Drag n' Drop

function allowDrop(event){
    event.preventDefault();
}

function startDragging(id){
    currentDraggedElement = id;
}

async function moveTo(state){
    tasks.forEach(task => {
        if (task.uniqueIndex == currentDraggedElement) {
            task.state = state;
        }
    });
    await setItem('tasks', JSON.stringify(tasks));
    initBoard('board');
}