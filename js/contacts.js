let contacts = [];
let contactInfoOpened = false;
let logInUser;
let isEditMobilePopupOpen = false;
const aplhabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
let isCreatingAtTask = false;
let isCreatingAtBoard = false;
/**
 * Function is calling at entering the Contacts-section, it sets the initials for the user who has logged in, includes html-templates, load contact data from server and displaying contacts with loaded data from server
 * 
 * @param {string} activeSection - The ID of the section that should be marked as active.
 */
async function init(activeSection) {
    loadLocalStorageLoggedInUser('loggedInUser');
    await includeHTML();
    await fetchContacts();
    markActiveSection(activeSection);
    loadContacts();
    setHeaderInitials(logInUser);
}

/**
 * Function for open the contact-form where User can add a acontact.
 * 
 */
function openContactForm() {
    removeAllActiveStates();
    clearContactInfo();
    document.querySelector(".add-contact").classList.remove("d-none");
    document.querySelector(".add-form-content").classList.add("formular-animation");
    document.querySelector(".sticky-btn").classList.add("d-none");
}

/**
 * Function clears the displayed contactinformation
 * 
 */
function clearContactInfo() {
    infoHead.innerHTML = '';
    contactInformation.innerHTML = '';
}

/**
 * Function closes the opened contact-form at add task section or contact section
 * 
 * @param {string} editOrAdd - The name of the opened contact-form -> there are two of them , for editing an existing contact or add a new contact
 */
function closeContactForm(editOrAdd) {
    if (!isCreatingAtTask) {
        closeContactFormAtContact(editOrAdd);
    } else {
        closeContactFormAtTask();
    }
    contactInfoOpened = false;
}

/**
 * Closes the add contact form at add task section
 */
function closeContactFormAtTask() {
    document.querySelector(".add-contact").classList.add("d-none");
    document.querySelector(".add-form-content").classList.remove('formular-animation');
}
/**
 * Closes the contact form in the context of contacts, hiding relevant elements and resetting UI states.
 *
 * @param {string} editOrAdd - Specifies whether the operation is for adding ('add') or editing ('edit') a contact.
 */
function closeContactFormAtContact(editOrAdd) {
    if (editOrAdd === 'add') {
        document.querySelector(".add-contact").classList.add("d-none");
        document.querySelector(".add-form-content").classList.remove('formular-animation');
    } else if (editOrAdd === 'edit') {
        document.querySelector(".edit-contact").classList.add("d-none");
        document.getElementById('editFormContent').classList.remove('formular-animation');
    }
    document.querySelector(".sticky-btn").classList.remove("d-none");
    init('contactsSection');
}

/**
 * Hides all characters from the alphabet
 */
function hideUnusedChars() {
    aplhabet.forEach((char) => {
        document.getElementById(char).classList.add("d-none");
    })
}

/**
 * Function for displaying contacts
 * 
 */
function loadContacts() {
    hideUnusedChars();
    contacts.forEach((contact, index) => {
        let initials = getInitials(contact.firstName, contact.lastName);
        let co = checkIfFirstNameOrLastName(contact);
        co.classList.remove('d-none')
        co.innerHTML += /*html*/`
        <div id="c${index}" class="contact" onclick="showContactInfo(${index})">
            <div class="contact-bubble small" style="background-color: ${contact.color}">${initials}</div>
            <div class="contact-name-mail">
                <p class="f-size">${contact.firstName} ${contact.lastName} </p>
                <p class="blue-color">${contact.mail}</p>
            </div>
        </div>
        `
    })
}

/**
 * This function checks, if a user enters the full name ->first name + last name, or only the first or last name
 * 
 * @param {object} contact - The handed over object as class-object
 * @returns 
 */
function checkIfFirstNameOrLastName(contact) {
    if (contact.firstName != '') {
        return document.getElementById(contact.firstName.charAt(0).toLowerCase());
    } else {
        return document.getElementById(contact.lastName.charAt(0).toLowerCase());
    }
}

/**
 * This function handles the view of the contacts for smaller devices
 * 
 */
function showContactBookMobile() {
    document.getElementById('contactBookInfo').classList.add('mobile-sight');
    document.getElementById('contactBook').classList.remove('mobile-sight');
}

/**
 * This function displays the information of a clicked contact, it checks the screen-width too and adjust the displayed information
 * 
 * @param {number} index - The index of the displayed Contact
 */
function showContactInfo(index) {
    removeAllActiveStates();
    const querie = window.matchMedia("(max-width: 850px)");
    if (querie.matches === true) {
        showInfoMobile(index);
        document.getElementById('contactBookInfo').classList.remove('mobile-sight');
        document.getElementById('contactBook').classList.add('mobile-sight');
    } else {
        showInfoDesktop(index);
    }
}

/**
 * This function displays the contactinformation for smaller devices
 * 
 * 
 * @param {number} index - The index of the displayed Contact
 */
function showInfoMobile(index) {
    printContactHead(index);
    printContactInformation(index);
}

/**
 * This function displays the contactinformation for big screens i.e. desktop PC's and notebooks. It adds animation + an active state for the current displayed contactinformation at the contactbook 
 *  
 * 
 * @param {number} index - The index of the displayed Contact
 */
function showInfoDesktop(index) {
    document.getElementById('infoContent').classList.add('animate-contact-information');
    printContactHead(index);
    printContactInformation(index);
    document.getElementById(`c${index}`).classList.add('contact-active');
    contactInfoOpened = true;
    setTimeout(() => {
        document.getElementById('infoContent').classList.remove('animate-contact-information');
    }, 500)
}

/**
 * This function displays the contact-head-information, gets the initials from the to be shown contact and prints the delete edit-button for devices wwith smaller screen-width
 * 
 * @param {number} index - The index of the displayed Contact
 */
function printContactHead(index) {
    let contact = contacts[index];
    let initials = getInitials(contact.firstName, contact.lastName);
    printContHeadBigScreen(contact, initials, index);
    printContEditDeleteMobile(index);
}

/**
 * This function displayys the contact-head-information for desktop PC's or notebooks
 * 
 * @param {object} contact - The handed over object as class-object
 * @param {string} initials - Initials from users first and last name
 * @param {number} index - The index of the displayed Contact
 */
function printContHeadBigScreen(contact, initials, index) {
    infoHead.innerHTML = /*html*/`
    <div class="contact-bubble large" style="background-color: ${contact.color}">${initials}</div>
    <div class="name-edit-delete">
        <h2>${contact.firstName} ${contact.lastName}</h2>
        <div class="edit-delete" >
            <div class="edit" onclick="openEditContact(${index})">
                <img class="edit-image" src="assets/images/edit.svg">
                <p>Edit</p>
            </div>
            <div class="delete" onclick="deleteContact(${index})">
                <img class="ml24 delete-image delete-image" src="assets/images/delete.svg">
                <p>Delete</p>
            </div>
        </div>
    </div>`
}

/**
 * This function displays the edit and delete buttons for devices with smaller screen-width i.e. mobile-devices
 * 
 * @param {number} index - The index of the displayed Contact
 */
function printContEditDeleteMobile(index) {
    let editDeleteMobileDiv = document.getElementById('editDeleteMobile');
    editDeleteMobileDiv.innerHTML = /*html*/`
    <div class="edit-mobile" onclick="openEditContact(${index})">
        <img class="edit-image-mobile" src="assets/images/edit.svg">
        <p>Edit</p>
    </div>
    <div class="delete-mobile" onclick="deleteContact(${index})">
        <img class="delete-image-mobile" src="assets/images/delete.svg">
        <p>Delete</p>
    </div>
    `
}

/**
 * This function opens the popup for mobile-devices with animation and stops the 'click' eventlistener to close it right away 
 * 
 * @param {event} event - Klick-event for stopping propagation-methode
 */
function openEditMobilePopup(event) {
    document.getElementById('editDeleteMobile').classList.remove('invis');
    document.getElementById('editDeleteMobile').classList.add('edit-delete-m-anim-open')
    isEditMobilePopupOpen = true;
    event.stopPropagation();
}

/**
 * This function closes the mobile-popup with an animation and a minor delay, if the popup is open
 * 
 */
function closeMobilePopup() {
    if (isEditMobilePopupOpen) {
        document.getElementById('editDeleteMobile').classList.remove('edit-delete-m-anim-open')
        document.getElementById('editDeleteMobile').classList.add('edit-delete-m-anim-close')
        setTimeout(() => {
            document.getElementById('editDeleteMobile').classList.remove('edit-delete-m-anim-close')
            document.getElementById('editDeleteMobile').classList.add('invis');
        }, 280)
        isEditMobilePopupOpen = false;
    }
}

/**
 * Event listener for closing popup if user is tapping anywhere on the screen except the popup itself
 * 
 */
document.addEventListener('click', function (event) {
    if (isEditMobilePopupOpen) {
        const popup = document.getElementById('editDeleteMobile');
        if (!popup.contains(event.target)) {
            closeMobilePopup();
        }
    }
});

/**
 * This function opens the contact-form for editing a contact for mobile-devices
 * 
 * @param {number} index - The index of the displayed Contact
 */
function openEditContact(index) {
    openEditContactTab();
    getProfilePic(index);
    changeValues(index);
    closeMobilePopup();
}

/**
 * This function changes the values of the empty inputfields with the values of the contact to be changed 
 * 
 * @param {number} index - The index of the displayed Contact
 */
function changeValues(index) {
    const contact = contacts[index]
    document.getElementById('edit-index').value = index;
    document.getElementById('editFullName').value = contact.firstName + ' ' + contact.lastName;
    document.getElementById('editMail').value = contact.mail;
    document.getElementById('editPhone').value = contact.phone;
}

/**
 * This function displays the profile bubble with the initials and the color of the contact
 * 
 * @param {number} index - The index of the displayed Contact
 */
function getProfilePic(index) {
    let profileP = document.getElementById('profilePic');
    let initials = getInitials(contacts[index].firstName, contacts[index].lastName);
    profileP.innerHTML = /*html */`
    <div class="contact-bubble large-edit" style="background-color: ${contacts[index].color}">${initials}</div>
    `
}

/**
 * This function opens the contact-form for editing a contact
 * 
 */
function openEditContactTab() {
    removeAllActiveStates();
    clearContactInfo();
    document.querySelector(".edit-contact").classList.remove("d-none");
    document.getElementById('editFormContent').classList.add("formular-animation");
    document.querySelector(".sticky-btn").classList.add("d-none");
}

/**
 * This function saves the edited contact-values and shows them
 * 
 */
async function editContact() {
    let index = document.getElementById('edit-index').value;
    let contact = contacts[index];
    let fullName = document.getElementById('editFullName').value;
    let mail = document.getElementById('editMail').value;
    let tel = document.getElementById('editPhone').value;
    let firstLastName = splitString(fullName);
    overwriteContact(firstLastName, mail, tel, contact);
    document.querySelector(".edit-contact").classList.add("d-none");
    document.getElementById('editFormContent').classList.remove('formular-animation');
    document.querySelector(".sticky-btn").classList.remove("d-none");
    showContactInfo(index);
}

/**
 * This function takes the edited contact-values, overwrites the existing values and saves them on the server
 * 
 * @param {array} firstLastName - Array of the first and last name from contact
 * @param {string} mail - the email-address
 * @param {number} tel - the phonenumber
 * @param {object} contact - The handed over object as class-object
 */
async function overwriteContact(firstLastName, mail, tel, contact) {
    contact.firstName = firstLastName[0];
    contact.lastName = firstLastName[1];
    contact.mail = mail;
    contact.phone = tel;
    await setItem('contacts', JSON.stringify(contacts));
}

/**
 * This function displays the information tab - the email and phonenumber - ,of the contact-information part, of current contact
 * 
 * @param {number} index - The index of the displayed Contact
 */
function printContactInformation(index) {
    let contact = contacts[index];
    contactInformation.innerHTML = /*html*/`
    <p>Contact Information</p>
    <div class="mt24">
        <p class="bold">Email</p>
        <p class="blue-color">${contact.mail}</p>
        <p class="bold">Phone</p>
        <p class="blue-color">${contact.phone}</p>
    </div>
    `
}

/**
 * This function creates a new contact based on the section where the contact is created , saves them on the server and shows them after creating
 * 
 */
async function createContact() {
    if (isCreatingAtTask && !isCreatingAtBoard) {
        await createContactAtTask();
    } else if (!isCreatingAtTask && !isCreatingAtBoard) {
        await createContactAtContact();
    } else {
        await createContactAtBoard();
    }
}


/**
 * Asynchronously creates a new contact, updates the contacts list, and performs additional UI actions.
 * 
 */
async function createContactAtContact() {
    document.querySelector(".info-popup").classList.remove('info-popup-animation');
    document.querySelector(".info-popup").classList.add('info-popup-animation');
    let firstLastName = splitString(fullName.value);
    contacts.push(new Contact(firstLastName[0], firstLastName[1], phone.value, mail.value));
    await setItem('contacts', JSON.stringify(contacts));
    resetForms();
    closeAddC();
    await init('contactsSection');
    showNewContact();
}

/**
 * This functtion shows the new created contact
 * 
 */
function showNewContact() {
    const addedContact = contacts.length - 1;
    showContactInfo(addedContact);
}

/**
 * This function closes the contact-form for adding a contact
 * 
 */
function closeAddC() {
    document.querySelector(".add-contact").classList.add("d-none");
    document.querySelector(".add-form-content").classList.remove('formular-animation');
    document.querySelector(".sticky-btn").classList.remove("d-none");
}

/**
 * This function resets the inputfields for the contact-form
 * 
 */
function resetForms() {
    fullName.value = '';
    phone.value = '';
    mail.value = '';
}

/**
 * This function removes all active states at contact book, only if a contact is currently opened
 * 
 */
function removeAllActiveStates() {
    if (contactInfoOpened) {
        document.querySelector('.contact-active').classList.remove('contact-active');
    }
    contactInfoOpened = false;
}

/**
 * This function deletes the current opened contact
 * 
 * @param {number} index - The index of the displayed Contact
 */
async function deleteContact(index) {
    removeAllActiveStates()
    contacts.splice(index, 1);
    infoHead.innerHTML = '';
    contactInformation.innerHTML = '';
    await setItem('contacts', JSON.stringify(contacts));
    init('contactsSection');
}

/**
 * This function is getting respectively the first letter from the first and last name.
 * 
 * @param {string} firstName - The first name of the contact.
 * @param {string} lastName - The last name of the contact.
 * @returns {string} - The first letter from the first name and the first letter from the last name.
 */
function getInitials(firstName, lastName) {
    let initials = firstName.charAt(0) + lastName.charAt(0);
    return initials
}

/**
 * This function splits a string into two parts based on the first space character
 * 
 * @param {string} string - The input string to be split
 * @returns {array} - An array containing two strings after splitting
 */
function splitString(string) {
    let strings = [];
    strings.push(string.substring(0, string.indexOf(' ')));
    strings.push(string.substring(string.indexOf(' ') + 1));
    return strings;
}