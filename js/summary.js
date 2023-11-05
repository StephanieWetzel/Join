let logInUser;
let tasks = [];
let months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
];

/**
 * Initializes the summary-section by performing various tasks in a specified order.
 *
 * @param {string} activeSection - The ID of the section that should be marked as active.
 */
async function init(activeSection) {
    loadLocalStorageLoggedInUser('loggedInUser');
    await includeHTML();
    markActiveSection(activeSection);
    greet();
    setHeaderInitials(logInUser);
    await fetchTasks();
    displayUrgentTasks();
    displayTasksInBoard();
    displayTasksStates();
}

/**
 * Greets the user with a message based on the current time and updates the greeting in an HTML element.
 */
function greet() {
    let content = document.getElementById('greet');
    let mobileContent = document.getElementById('mobileGreet');
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    if (currentHour >= 5 && currentHour < 12) {
        greetingMessage = 'Good morning';
    } else if (currentHour >= 12 && currentHour < 18) {
        greetingMessage = 'Good Afternoon';
    } else {
        greetingMessage = 'Good Evening';
    }
    setUserNameAndMessage(content, greetingMessage);
    setUserNameAndMessage(mobileContent, greetingMessage);
    setMobileAnimation();
}

/**
 * Sets the content of an HTML element to display a user's greeting message and name, if a user is logged in.
 *
 * @param {HTMLElement} content - The HTML element where the greeting message and name (if available) should be displayed.
 * @param {string} greetingMessage - The greeting message to display.
 */
function setUserNameAndMessage(content, greetingMessage) {
    if (logInUser) {
        content.innerHTML = `
        <h2>${greetingMessage},</h2>
        <h1>${logInUser.firstName} ${logInUser.lastName}</h1>`
    } else {
        content.innerHTML = `
        <h2>${greetingMessage}</h2>`
    }
}

function setMobileAnimation(){
    const querie = window.matchMedia("(max-width: 1024px)")
    if (querie.matches === true) {
        document.getElementById('mobileGreet').classList.add('fadeOutAnimation');
        document.getElementById('summaryMainContent').classList.add('fadeInAnimation')
    }
    setTimeout(() => {
        document.getElementById('mobileGreet').classList.remove('fadeOutAnimation');
        document.getElementById('summaryMainContent').classList.remove('fadeInAnimation')
    },2050)
}

/**
 * Counts the number of tasks marked as 'urgent' in the 'tasks' array.
 *
 * @returns {number} The count of tasks marked as 'urgent'.
 */
function getUrgentTasksCounter() {
    let uCount = 0;
    tasks.forEach(task => {
        if (task.priority === 'urgent') {
            uCount++;
        }});
    return uCount
}

/**
 * Retrieves the upcoming deadline date from tasks marked as 'urgent' by checking their dates.
 *
 * @returns {string} The date in string format representing the upcoming deadline.
 */
function getUpcomingDeadline() {
    let urgentDates = [];
    tasks.forEach(task => {
        if (task.priority === 'urgent') {
            urgentDates.push(task.date)
        }
    });
    urgentDates.sort()
    return urgentDates[0];
}

/**
 * Extracts the day of the month from a given string.
 *
 * @param {string} str - The input string containing a date.
 * @returns {string} The day of the month extracted from the input string.
 */
function getUrgentMonthDay(str) {
    let lastTwoDigits = str.slice(-2);
    return lastTwoDigits;
}

/**
 * Extracts the month from a given string and returns its textual representation.
 *
 * @param {string} str - The input string containing a date.
 * @returns {string} The textual representation of the month extracted from the input string.
 */
function getUrgentMonth(str) {
    let splits = str.split('-'); //splits the incoming string at any '-' index , takes the so splitted single strings into array
    return months[splits[1] - 1]
}

/**
 * Extracts the year from a given string.
 * 
 * @param {string} str - The input string containing a date.
 * @returns {string} The year extracted from the input string.
 */
function getUrgentYear(str) {
    let year = str.slice(0, 4);
    return year
}

/**
 * Displays the count of urgent tasks and their upcoming deadline in the corresponding HTML elements.
 * 
 */
function displayUrgentTasks() {
    let uTasks = getUrgentTasksCounter();
    let uDate = getUpcomingDeadline();
    if (uTasks > 0) {
        urgentCounter.innerHTML = /*html*/`
        <h1>${uTasks}</h1>
        <span>Urgent</span>`
        deadlineDate.innerHTML = /*html */`
        <p>${getUrgentMonth(uDate)} ${getUrgentMonthDay(uDate)}, ${getUrgentYear(uDate)}</p>
        <p>Upcoming Deadline</p>
        `  
    }else{
        urgentCounter.innerHTML = /*html*/`
        <h1>${uTasks}</h1>
        <span>Urgent</span>`
        deadlineDate.innerHTML = /*html */`
        <p>No Upcoming Deadline</p>
        `  
    }
   
}

/**
 * Displays the total number of tasks currently in the board in an HTML container.
 * 
 */
function displayTasksInBoard() {
    let tasksInBoard = tasks.length;
    tInBoard.innerHTML = /*html*/`
    <h1>${tasksInBoard}</h1>
    <span>Tasks in Board</span>
    `
}
/**
 * Displays the number of tasks in different states in their corresponding HTML containers.
 * 
 */
function displayTasksStates() {
    displayNumberOfState('numberOfTodos', 'todo', 'card-count', 'To-do');
    displayNumberOfState('numberOfDone', 'done', null, 'Done');
    displayNumberOfState('numberOfProgress', 'inProgress', null, 'Tasks in Progress');
    displayNumberOfState('numberOfFeedback', 'awaitFeedback', null, 'Awaiting Feedback')
}

/**
 * Displays the number of tasks in a specific state in an HTML element.
 *
 * @param {string} id - The ID of the HTML container element where the number should be displayed.
 * @param {string} stateName - The state for which the number of tasks is to be retrieved and displayed.
 * @param {string} className - The CSS class name to be applied to the number display.
 * @param {string} name - The label or name to be displayed alongside the number.
 */
function displayNumberOfState(id, stateName, className, name) {
    let cont = document.getElementById(id);
    cont.innerHTML = /*html*/`
    <h1 class="${className}">${getNumberOfStateTasks(stateName)}</h1>
    <span>${name}</span>
    `
}

/**
 * Retrieves the number of tasks in a specific state.
 *
 * @param {string} stat - The state for which the number of tasks is to be retrieved.
 * @returns {number} The number of tasks that match the specified state.
 */
function getNumberOfStateTasks(stat) {
    let filteredTasks = tasks.filter(t => t.state == stat);
    filteredTasks = filteredTasks.length;
    return filteredTasks
}
