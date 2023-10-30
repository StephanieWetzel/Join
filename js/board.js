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


// function updateSummaryCounts() {
//     // Hier sollten Sie den code einfügen, um die cardCounts-Datenstruktur zu aktualisieren
//     // Zählen Sie die Karten in verschiedenen Abschnitten des Boards und aktualisieren Sie cardCounts
//     cardCounts.todo = countTodoCards(); // Beispiel: Funktion, um die Anzahl der To-do-Karten zu zählen
//     cardCounts.done = countDoneCards(); // Beispiel: Funktion, um die Anzahl der Done-Karten zu zählen
//     cardCounts.urgent = countUrgentCards(); // Beispiel: Funktion, um die Anzahl der Urgent-Karten zu zählen
//     // usw.

//     // Rufen Sie die greet-Funktion aus der summary.js-Datei auf, um die Zusammenfassung zu aktualisieren
//     greet();
// }

// // Diese Funktion zählt die Anzahl der To-do-Karten im Board (Beispiel)
// function countTodoCards() {
//     // Hier sollte der Code stehen, um die Anzahl der To-do-Karten im Board zu zählen
//     // Zum Beispiel, durch Iteration über die Karten und Überprüfung ihres Status
//     // Geben Sie die Anzahl der To-do-Karten zurück
//     return 1; // Beispiel: 1 To-do-Karte
// }

// // Diese Funktion zählt die Anzahl der Done-Karten im Board (Beispiel)
// function countDoneCards() {
//     // Hier sollte der Code stehen, um die Anzahl der Done-Karten im Board zu zählen
//     // Zum Beispiel, durch Iteration über die Karten und Überprüfung ihres Status
//     // Geben Sie die Anzahl der Done-Karten zurück
//     return 1; // Beispiel: 1 Done-Karte
// }

// // Diese Funktion zählt die Anzahl der Urgent-Karten im Board (Beispiel)
// function countUrgentCards() {
//     // Hier sollte der Code stehen, um die Anzahl der Urgent-Karten im Board zu zählen
//     // Zum Beispiel, durch Iteration über die Karten und Überprüfung ihres Status
//     // Geben Sie die Anzahl der Urgent-Karten zurück
//     return 1; // Beispiel: 1 Urgent-Karte
// }