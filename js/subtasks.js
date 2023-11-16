/**
 * Adds a subtask to the list of subtasks and updates the rendering of subtasks.
 *
 * @param {HTMLInputElement} subtaskInput - The HTML input field for entering subtasks.
 */
function addSubtask() {
    subtaskInput = document.getElementById('subtaskInput');
    if (subtaskInputFieldHasContent()) {
        subtasks.push(subtaskInput.value);
        subtaskInput.value = '';
        renderSubtasks();
    }
}


/**
 * Checks if the subtask input field has content.
 *
 * @returns {boolean} - `true` if the subtask input field has content; otherwise, `false`.
 */
function subtaskInputFieldHasContent() {
    return subtaskInput.value.length != '';
}


/**
 * Renders the list of subtasks in the designated container.
 *
 * @param {HTMLElement} subtaskContainer - The HTML element that serves as the container for displaying subtasks.
 * @param {string} subtask - The current subtask in the iteration.
 */
function renderSubtasks() {
    const subtaskContainer = document.getElementById('subtaskContainer');
    subtaskContainer.innerHTML = '';

    for (let i = 0; i < subtasks.length; i++) { // Iterates through the list of subtasks and adds them to the subtask container using a template.
        const subtask = subtasks[i];
        subtaskContainer.innerHTML += subtaskEditContainerTemplate(subtask, i);
    }
};


/**
 * Generates an HTML template for a subtask edit container.
 *
 * @param {string} subtask - The text content of the subtask.
 * @param {number} i - The index of the subtask in the list.
 */
function subtaskEditContainerTemplate(subtask, i) {
    return /*html*/`
    <ul id="ulContainer${i}" class="ulContainer" onmouseover="mouseOverSubtaskEditContainer(this)" onmouseout="mouseOutSubtaskEditContainer(this)">
        <li id="subtaskListElement${i}" class="subtaskListElements">${subtask}</li>
        <div id="subtaskEditContainer" class="subtaskEditContainer dNone">
            <img id="editImg${i}" onclick="editSubtask(${i})" src="./assets/images/edit.svg" alt="Stift">
            <div class="subtaskSeparator"></div>
            <img id="trashcan${i}" onclick="deleteSubtask(${i})" src="./assets/images/delete.svg" alt="Mülleimer">
        </div>
    </ul>
    `;
}


/**
 * Handles the mouseover event for a subtask edit container, displaying the edit options.
 *
 * @param {HTMLElement} element - The HTML element representing the subtask edit container.
 * @param {boolean} isEditing -  A flag indicating whether the application is in editing mode.
 * @param {HTMLElement} subtaskEditContainer - The HTML element representing the subtask edit container within the provided element.
 */
function mouseOverSubtaskEditContainer(element) {
    if (!isEditing) {
        const subtaskEditContainer = element.querySelector('.subtaskEditContainer');
        subtaskEditContainer.classList.remove('dNone');
    }
}


/**
 * Handles the mouseout event for a subtask edit container, hiding the edit options.
 *
 * @param {HTMLElement} element - The HTML element representing the subtask edit container.
 * @param {boolean} isEditing -  A flag indicating whether the application is in editing mode.
 * @param {HTMLElement} subtaskEditContainer - The HTML element representing the subtask edit container within the provided element.
 */
function mouseOutSubtaskEditContainer(element) {
    if (!isEditing) {
        const subtaskEditContainer = element.querySelector('.subtaskEditContainer');
        subtaskEditContainer.classList.add('dNone');
    }
}


/**
 * Deletes a subtask at the specified index and updates the rendering of subtasks.
 *
 * @param {number} i - The index of the subtask to be deleted.
 */
function deleteSubtask(i) {
    if (atLeastOneSubtaskExists(i)) { // if at least one subtask exists in array
        removeSubtask(i);
        renderSubtasks();
    }
}


/**
 * Checks if at least one subtask exists at the specified index.
 *
 * @param {number} i - The index to be checked.
 * @returns {boolean} - `true` if at least one subtask exists at the specified index; otherwise, `false`.
 */
function atLeastOneSubtaskExists(i) {
    return i > -1;
}


/**
 * Removes a subtask at the specified index from the list of subtasks and clears the subtask container.
 *
 * @param {number} i - The index of the subtask to be removed.
 */
function removeSubtask(i) {
    subtasks.splice(i, 1);
    subtaskContainer.innerHTML = '';
}


let confirmEditSymbol;
let trashcan;
let subtaskListElement;
let ulContainer;


/**
 * Initiates the editing of a subtask by changing its style, making it editable, and handling the confirmation of edits.
 *
 * @param {number} i - The index of the subtask to be edited.
 * @param {HTMLInputElement} subtaskInput - The HTML input field for entering subtasks.
 * @param {boolean} isEditing - Sets the editing state to true.
 */
function editSubtask(i) {
    subtaskInput = document.getElementById('subtaskInput');

    if (!isEditing) {
        isEditing = true;
        changeStyleOfElements(i);
        makeContentEditable(i);

        confirmEditSymbol.onclick = function () { // Sets the click event for the confirm edit symbol to close the editing mode.
            closeEditing(subtaskInput, trashcan, subtaskListElement, confirmEditSymbol, addSubtaskSymbol, ulContainer, i);
        };

        subtaskInput.disabled = true;
    }
}


/**
 * Changes the style of elements related to the editing process for a subtask.
 *
 * @param {number} i - The index of the subtask for which styles are to be changed.
 * @param {HTMLUListElement} ulContainer - The HTML unordered list container element for the subtask at the specified index.
 * @param {HTMLDivElement} addSubtaskSymbol - The HTML div element representing the add subtask symbol.
 * @param {HTMLImageElement} trashcan - The HTML image element representing the trashcan icon for the subtask at the specified index.
 * @param {HTMLImageElement} confirmEditSymbol  - The HTML image element representing the confirm edit symbol for the subtask at the specified index.
 */
function changeStyleOfElements(i) {
    ulContainer = document.getElementById(`ulContainer${i}`);
    ulContainer.style.backgroundColor = '#EAEBEC';

    let addSubtaskSymbol = document.getElementById(`addSubtaskSymbol`);
    addSubtaskSymbol.classList.add('dNone');

    trashcan = document.getElementById(`trashcan${i}`);
    trashcan.classList.add('dNone');

    confirmEditSymbol = document.getElementById(`editImg${i}`);
    confirmEditSymbol.src = "./assets/images/check_black.png";
}


/**
 * Makes the content of the subtask list element at the specified index editable and sets focus to it.
 * 
 * @param {number} i - The index of the subtask list element to be made editable.
 * @param {HTMLLIElement} subtaskListElement - The HTML list element representing the subtask at the specified index.
 */
function makeContentEditable(i) {
    subtaskListElement = document.getElementById(`subtaskListElement${i}`);
    subtaskListElement.contentEditable = true;
    subtaskListElement.focus();
}


/**
 * Closes the editing mode for a subtask, reverts UI changes, and sets the application state accordingly.
 *
 * @param {HTMLInputElement} subtaskInput - The HTML input field for entering subtasks.
 * @param {HTMLImageElement} trashcan - The HTML image element representing the trashcan icon.
 * @param {HTMLLIElement} subtaskListElement - The HTML list item element representing the subtask.
 * @param {HTMLImageElement} confirmEditSymbol - The HTML image element representing the confirm edit symbol.
 * @param {HTMLDivElement} addSubtaskSymbol - The HTML div element representing the add subtask symbol.
 * @param {HTMLUListElement} ulContainer - The HTML unordered list element container.
 * @param {number} i - The index of the subtask being edited.
 * @param {boolean} isEditing - Sets the editing state to false.
 */
function closeEditing(subtaskInput, trashcan, subtaskListElement, confirmEditSymbol, addSubtaskSymbol, ulContainer, i) {
    isEditing = false;
    subtaskInput.disabled = false;
    subtaskListElement.contentEditable = false;
    confirmEditSymbol.src = "./assets/images/edit.svg";
    addSubtaskSymbol.classList.remove('dNone');
    trashcan.classList.remove('dNone');
    ulContainer.style.backgroundColor = '';

    subtasks[i] = subtaskListElement.innerText; // Saves the edited subtask content.
    renderSubtasks(); // Updates the subtasks list with the edited content.

    confirmEditSymbol.onclick = function () { // Click event handler for the confirm edit symbol after closing editing mode.
        editSubtask(i);
    };
}