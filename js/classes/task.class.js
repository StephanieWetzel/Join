class Task {
    title;
    description;
    assignedContacts;
    date;
    priority;
    category;
    subtasks;

    constructor(title, description, assignedContacts, date, priority, category, subtasks) {
        this.title = title;
        this.description = description;
        this.assignedContacts = assignedContacts;
        this.date = date;
        this.priority = priority;
        this.category = category;
        this.subtasks = subtasks;
    }




}

/*
function loadContacts() {
    let contactSelection = document.getElementById('contacts')
    contacts.forEach(contact => {
        const newOption = new Option(contact.firstName, contact.firstName);
        contactSelection.add(newOption, undefined);
    });
}*/