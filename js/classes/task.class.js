/**
 *  Represents a task with various properties.
 * 
 */
class Task {
    title;
    description;
    assignedContacts;
    date;
    priority;
    category;
    subtasks;
    state = 'todo';
    uniqueIndex;
    /**
     * Constructor for the Task class.
     * 
     * @param {string} title - The title of the task. 
     * @param {string} description - The description of the task.
     * @param {Array} assignedContacts - An array of contacts assigned to the task.
     * @param {Date} date - The date of thee task.
     * @param {string} priority - The priority of the task.
     * @param {string} category - The category of the task.
     * @param {Array} subtasks - An array of subtasks associated with the task.
     */
    constructor(title, description, assignedContacts, date, priority, category, subtasks, state) {
        this.title = title;
        this.description = description;
        this.assignedContacts = assignedContacts;
        this.date = date;
        this.priority = priority;
        this.category = category;
        this.subtasks = subtasks;
        this.uniqueIndex = Math.floor(Math.random() * (1-100000)) + 100000;
        this.state = state
    }
}