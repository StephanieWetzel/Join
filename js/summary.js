let logInUser;
let tasks = [];
let months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];

async function init(activeSection) {
    loadLocalStorageLoggedInUser('loggedInUser');
    await includeHTML();
    markActiveSection(activeSection);
    greet();
    setHeaderInitials(logInUser);
    await fetchTasks();
    displayUrgentTasks();
    displayTasksInBoard();
}


function greet() {
    let content = document.getElementById('greet');
    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    let greetingMessage = '';

    if (currentHour >= 5 && currentHour < 12) {
        greetingMessage = 'Good morning';
    } else if (currentHour >= 12 && currentHour < 18) {
        greetingMessage = 'Good Afternoon';
    } else {
        greetingMessage = 'Good Evening';
    }
    setUserNameAndMessage(content, greetingMessage);
}

function setUserNameAndMessage(content, greetingMessage){
    if (logInUser) {
        content.innerHTML = `
        <h2>${greetingMessage},</h2>
        <h1>${logInUser.firstName} ${logInUser.lastName}</h1>`
    }else{
        content.innerHTML = `
        <h2>${greetingMessage}</h2>`
    }
}

function getUrgentTasksCounter(){
    let uCount = 0;
    tasks.forEach(task => {
        if (task.priority === 'urgent') {
            uCount++;}}
        );
    return uCount
}

function getUpcomingDeadline(){
    let urgentDates = [];
    tasks.forEach(task => {
        if (task.priority === 'urgent') {
            urgentDates.push(task.date)
        }
    });
    urgentDates.sort()
    console.log(urgentDates[0])
    return urgentDates[0];
}

function getUrgentMonthDay(str){
    let lastTwoDigits = str.slice(-2);
    return lastTwoDigits;
}

function getUrgentMonth(str){
    let splits = str.split('-'); //splits the incoming string at any '-' index , takes the so splitted single strings into array
    return months[splits[1] - 1]
}

function getUrgentYear(str){
    let year = str.slice(0, 4);
    return year
}

function displayUrgentTasks(){
    let uTasks = getUrgentTasksCounter();
    let uDate = getUpcomingDeadline();
    urgentCounter.innerHTML = /*html*/`
    <h1>${uTasks}</h1>
    <span>Urgent</span>`
    deadlineDate.innerHTML = /*html */`
    <p>${getUrgentMonth(uDate)} ${getUrgentMonthDay(uDate)}, ${getUrgentYear(uDate)}</p>
    <p>Upcoming Deadline</p>
    `
}

function displayTasksInBoard(){
    let tasksInBoard = tasks.length;
    tInBoard.innerHTML = /*html*/`
    <h1>${tasksInBoard}</h1>
    <span>Tasks in Board</span>
    `
}
