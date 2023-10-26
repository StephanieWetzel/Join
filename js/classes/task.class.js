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