const cardCounts = {
    todo: 0,
    done: 0,
    urgent: 0,
    tasksInBoard: 0,
    tasksInProgress: 0,
    awaitingFeedback: 0,
};



async function init(activeSection) {
    loadLocalStorageLoggedInUser('loggedInUser');
    await includeHTML();
    markActiveSection(activeSection);
    setHeaderInitials(logInUser);
    closeTask();
    closeModal();
    renderTasks();
}


document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchInput');
    const searchImg = document.getElementById('searchImg');
    let inputFilled = false;

    function toggleInputContent() {
        if (inputFilled) {
            searchInput.value = '';
            inputFilled = false;
        } else {
            searchInput.value = 'Website';
            inputFilled = true;
        }
    }

    searchImg.addEventListener('click', toggleInputContent);
});


function openModal() {
    const modal = document.getElementById("myModal");
    const modalContent = document.querySelector(".modal-content");

    fetch("assets/templates/addTask.template.html")
        .then((response) => response.text())
        .then((data) => {
            modalContent.innerHTML = data;
        });
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
    const customModal = document.getElementById('customModal'); 

    customModal.innerHTML = ''; 
    
        const taskHTML = `
        <div class="open-task">
            <div>
                <button onclick="closeTask()" id="closeModal"><img src="/assets/images/close.svg"
                        alt=""></button>
                <div class="status-board status-board-open">
                    <p class="technical-task">Technical Task</p>
                    <p class="headline"><b>CSS Architecture Planning</b></p>
                    <span class="taskInformation">Define CSS naming conventions and structure</span>
                    <span style="color: #42526E;">Due Date: <span class="m-left1">02/09/2023</span></span>
                    <span style="color: #42526E;">Priority: <span class="m-left2">Urgent<img class="board-img"
                                src="./assets/images/urgent_symbol.svg" alt=""></span></span>
                    <span style="color: #42526E;">Assigned To:</span>
                    <div class="assignedFrom">
                        <p class="FH">FH</p><span>Fuad Hussen</span>
                    </div>
                    <div class="assignedFrom">
                        <p class="SW1">SW</p><span>Stephanie Wetzel</span>
                    </div>
                    <div class="assignedFrom">
                        <p class="SW2">SW</p><span>Sebastian Wolff</span>
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
        `;

        customModal.innerHTML += taskHTML;
    }


window.onload = function () {
    renderTasks();
}