
/* Test purposes only :D */
let contacts =[
    new Contact("Albrecht", "Fuchs", "01800666666", "trololol123@swag.ru"),
    new Contact("Sebastian", "Wolff", "01800666666", "trololol123@swag.ru")
]
/*-------------------*/

let contactInfoOpened = false;


async function init(){
    await includeHTML();
    loadContacts();
}

async function includeHTML(){
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html");
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}


function openContactForm(){
    document.querySelector(".content").classList.add("d-none");
    document.querySelector(".add-contact").classList.remove("d-none");
}

function closeContactForm(){
    document.querySelector(".add-contact").classList.add("d-none");
    document.querySelector(".content").classList.remove("d-none");
    init();
}

function loadContacts(){
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

function showContactInfo(index){
    removeAllActiveStates();
    printContactHead(index);
    printContactInformation(index);
    document.getElementById(`c${index}`).classList.add('contact-active');
    contactInfoOpened = true;
}

function printContactHead(index) {
    let contact = contacts[index];
    let initials = getInitials(contact.firstName, contact.lastName)
    infoHead.innerHTML = /*html*/`
    <div class="contact-bubble large" style="background-color: ${contact.color}">${initials}</div>
    <div class="name-edit-delete">
        <h2>${contact.firstName} ${contact.lastName}</h2>
        <div class="edit-delete">
            <div class="edit">
                <img src="assets/icons/edit.svg">
                <p>Edit</p>
            </div>
            <div class="delete" onclick="deleteContact(${index})">
                <img class="ml24" src="assets/icons/delete.svg">
                <p >Delete</p>
            </div>
        </div>
    </div>`
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

function removeAllActiveStates(){
    if (contactInfoOpened){
        document.querySelector('.contact-active').classList.remove('contact-active');    
    }
    contactInfoOpened = false;
}

function deleteContact(index){
    removeAllActiveStates()
    contacts.splice(index, 1);
    infoHead.innerHTML = '';
    contactInformation.innerHTML = '';
    init();
}

function getInitials(firstName, lastName){
    let initials = firstName.charAt(0) + lastName.charAt(0);
    return initials
}