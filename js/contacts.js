let contacts = [];
let contactInfoOpened = false;
let logInUser;

async function init(activeSection) {
    loadLocalStorageLoggedInUser('loggedInUser');
    await includeHTML();
    await fetchContacts();
    markActiveSection(activeSection);
    loadContacts();
    setHeaderInitials();
}

function openContactForm() {
    removeAllActiveStates();
    clearContactInfo();
    document.querySelector(".add-contact").classList.remove("d-none");
    document.querySelector(".add-form-content").classList.add("formular-animation");
    document.querySelector(".sticky-btn").classList.add("d-none");
}

function clearContactInfo(){
    infoHead.innerHTML = '';
    contactInformation.innerHTML = '';
}

function closeContactForm(editOrAdd) {
    if (editOrAdd === 'add') {
        document.querySelector(".add-contact").classList.add("d-none");
        document.querySelector(".add-form-content").classList.remove('formular-animation');
    } else if (editOrAdd === 'edit') {
        document.querySelector(".edit-contact").classList.add("d-none");
        document.getElementById('editFormContent').classList.remove('formular-animation');
    }
    document.querySelector(".sticky-btn").classList.remove("d-none");
    contactInfoOpened = false;
    init('contactsSection');
}


function loadContacts() {
    contacts.forEach((contact, index) => {
        let initials = getInitials(contact.firstName, contact.lastName);
        let co = document.getElementById(contact.firstName.charAt(0).toLowerCase());
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





function showContactInfo(index) {
    document.getElementById('infoContent').classList.add('animate-contact-information');
    removeAllActiveStates();
    printContactHead(index);
    printContactInformation(index);
    document.getElementById(`c${index}`).classList.add('contact-active');
    contactInfoOpened = true;
    setTimeout(() => {
        document.getElementById('infoContent').classList.remove('animate-contact-information');
    }, 500)
}


function printContactHead(index) {
    let contact = contacts[index];
    let initials = getInitials(contact.firstName, contact.lastName);
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
                <img class="ml24 delete-image" src="assets/images/delete.svg">
                <p>Delete</p>
            </div>
        </div>
    </div>`
}


function openEditContact(index) {
    openEditContactTab();
    getProfilePic(index);
    changeValues(index);
}


function changeValues(index) {
    const contact = contacts[index]
    document.getElementById('edit-index').value = index;
    document.getElementById('editFullName').value = contact.firstName + ' ' + contact.lastName;
    document.getElementById('editMail').value = contact.mail;
    document.getElementById('editPhone').value = contact.phone;
}


function getProfilePic(index) {
    let profileP = document.getElementById('profilePic');
    let initials = getInitials(contacts[index].firstName, contacts[index].lastName);
    profileP.innerHTML = /*html */`
    <div class="contact-bubble large" style="background-color: ${contacts[index].color}">${initials}</div>
    `
}


function openEditContactTab() {
    removeAllActiveStates();
    clearContactInfo();
    document.querySelector(".edit-contact").classList.remove("d-none");
    document.getElementById('editFormContent').classList.add("formular-animation");
    document.querySelector(".sticky-btn").classList.add("d-none");
}


async function editContact() {
    let index = document.getElementById('edit-index').value;
    let contact = contacts[index];
    let fullName = document.getElementById('editFullName').value;
    let mail = document.getElementById('editMail').value;
    let tel = document.getElementById('editPhone').value;
    let firstLastName = splitString(fullName);
    overwriteContact(firstLastName, mail, tel, contact);
}


async function overwriteContact(firstLastName, mail, tel, contact) {
    contact.firstName = firstLastName[0];
    contact.lastName = firstLastName[1];
    contact.mail = mail;
    contact.phone = tel;
    await setItem('contacts', JSON.stringify(contacts));
}


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


async function createContact() {
    let firstLastName = splitString(fullName.value);
    contacts.push(new Contact(firstLastName[0], firstLastName[1], phone.value, mail.value));
    await setItem('contacts', JSON.stringify(contacts));
    resetForms();
}


function resetForms() {
    fullName.value = '';
    phone.value = '';
    mail.value = '';
}


function removeAllActiveStates() {
    if (contactInfoOpened) {
        document.querySelector('.contact-active').classList.remove('contact-active');
    }
    contactInfoOpened = false;
}


async function deleteContact(index) {
    removeAllActiveStates()
    contacts.splice(index, 1);
    infoHead.innerHTML = '';
    contactInformation.innerHTML = '';
    await setItem('contacts', JSON.stringify(contacts));
    init('contactsSection');
}


function getInitials(firstName, lastName) {
    let initials = firstName.charAt(0) + lastName.charAt(0);
    return initials
}


function splitString(string) {
    let strings = [];
    strings.push(string.substring(0, string.indexOf(' ')));
    strings.push(string.substring(string.indexOf(' ') + 1));
    return strings;
}