class Task{
    title;
    decript;
    contact;
    date;
    prio;
    category;
    subtasks=[];

    constructor(x){
        this.title = x
    }




}



new Task("Tomate");

function loadContacts() {
    let contactSelection = document.getElementById('contacts')
    contacts.forEach(contact => {
        const newOption = new Option(contact.firstName, contact.firstName);
        contactSelection.add(newOption, undefined);
    });
}