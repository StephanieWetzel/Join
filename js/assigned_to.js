/**
 * Populates the contact selection dropdown with contact information.
 *
 * @param {HTMLElement} contactSelection - The HTML element representing the contact selection dropdown.
 * @param {object} contact - The current contact object.
 * @param {string} initials - The initials of the current contact.
 */
function assignContact() {
    let contactSelection = document.getElementById('contactSelection');
    contactSelection.innerHTML = '';
    for (let i = 0; i < contacts.length; i++) {
        contact = contacts[i];
        initials = getInitials(contact.firstName, contact.lastName); // contact.js
        contactSelection.innerHTML += contactTemplate(contact, i);
    }
}


/**
 * Generates an HTML template for displaying a contact in the "Add Task" page.
 *
 * @param {object} contact - The contact object containing information like first name, last name, and color.
 * @param {number} i - The index of the contact in the contacts array.
 * @param {string} initials - The initials of the contact, derived from the first and last name.
 */
function contactTemplate(contact, i) {
    return `
        <div class="contactAddTask checkboxContainer">
            <div class="contactInfoContainer">
                <div class="contact-bubble small contactBubbleAddTask" style="background-color: ${contact.color}">${initials}</div>
                <option>${contact.firstName} ${contact.lastName}</option>
            </div>
            <input onclick="showAssignedContacts()" id="checkbox${i}" class="checkbox" type="checkbox" value="">
        </div>
    `;
}


/**
 * Toggles the visibility and state of various elements related to contact management.
 * 
 */
function toggleContacts() {
    toggleMainContainer();
    toggleArrowSymbols();
    toggleInputValue();
}


/**
 * Toggles the visibility of the main container for contact selection.
 *
 * @param {HTMLElement} contactSelectionContainer - The HTML element representing the contact selection dropdown.
 */
function toggleMainContainer() {
    contactSelectionContainer.classList.toggle('dNone');
}


/**
 * Toggles the visibility of arrow symbols indicating the state of contact visibility.
 *
 * @param {HTMLElement} arrowDownSymbol - The HTML element representing the arrow symbol for indicating a collapsed state.
 * @param {HTMLElement} arrowUpSymbol - The HTML element representing the arrow symbol for indicating an expanded state.
 */
function toggleArrowSymbols() {
    arrowDownSymbol.classList.toggle('dNone');
    arrowUpSymbol.classList.toggle('dNone');
}


/**
 * Toggles the value of an input field used for assigning contacts.
 * If the field has a value, it is cleared; otherwise, a default value is set.
 *
 * @param {HTMLElement} assignContactsInputfield - The HTML input element used for assigning contacts.
 */
function toggleInputValue() {
    if (assignContactsInputfield.value) {
        assignContactsInputfield.value = '';
    }
    else {
        assignContactsInputfield.value = 'Select contacts to assign';
    }
}


// Functions for CLOSING contacts only
/**
 * Adds a click event listener to the document to handle clicks outside of the input field.
 * Closes the contact selection if the user clicks outside of specific elements.
 *
 * @param {Event} event - The click event object.
 */
document.addEventListener('click', function (event) {
    if (userClicksOutsideOfInputField(event)) {
        closeContactSelection();
    }
});


/**
 * Checks if the user clicked outside of specific elements related to the contact selection.
 *
 * @param {Event} event - The click event object.
 * @returns {boolean} Returns true if the click is outside of the specified input field and symbols.
 */
function userClicksOutsideOfInputField(event) {
    return !contactSelectionContainer.contains(event.target) &&
        !assignContactsInputfield.contains(event.target) &&
        !arrowDownSymbol.contains(event.target) &&
        !arrowUpSymbol.contains(event.target);
}


/**
 * Closes the contact selection by updating the relevant elements' classes and resetting the input field value.
 */
function closeContactSelection() {
    contactSelectionContainer.classList.add('dNone');
    arrowDownSymbol.classList.remove('dNone');
    arrowUpSymbol.classList.add('dNone');
    assignContactsInputfield.value = 'Select contacts to assign';
}


/**
 * Displays assigned contact bubbles in the designated container based on the checked checkboxes.
 *
 * @param {HTMLElement} assignedContacts - The HTML element representing the area for displaying assigned contacts.
 * @param {object[]} contactBubbles - An array to store contact bubble information to prevent duplication.
 * @param {object} contact - The current contact object.
 * @param {string} initials - The initials of the current contact.
 * @param {HTMLInputElement} checkbox - The HTML checkbox element for the current contact.
 */
function showAssignedContacts() {
    let assignedContacts = document.getElementById('assignedContacts');
    assignedContacts.innerHTML = '';
    contactBubbles = []; // makes sure bubbles aren´t multiplied
    for (let i = 0; i < contacts.length; i++) { // Iterate through the contacts array and display assigned contact bubbles
        contact = contacts[i];
        initials = getInitials(contact.firstName, contact.lastName);
        let checkbox = document.getElementById(`checkbox${i}`);
        if (checkbox.checked) {
            printContact();
        }
    }
}


/**
 * Adds a contact to the array of assigned contact bubbles and displays it in the UI.
 */
function printContact() {
    contactBubbles.push({
        initials: initials,
        color: contact.color,
        firstName: contact.firstName,
        lastName: contact.lastName
    })
    assignedContacts.innerHTML += assignedContactsTemplate();
}


/**
 * Generates an HTML template for displaying an assigned contact bubble in the "Add Task" page.
 *
 * @returns {string} - The HTML template for the assigned contact bubble.
 */
function assignedContactsTemplate() {
    return `
        <div id="assignedContact" class="contact-bubble small contactBubbleAddTask selectedContactBubble" style="background-color: ${contact.color}">${initials}</div>
    `;
}