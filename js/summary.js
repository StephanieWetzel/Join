let logInUser;
let tasks = [];

async function init(activeSection) {
    loadLocalStorageLoggedInUser('loggedInUser');
    await includeHTML();
    markActiveSection(activeSection);
    greet();
    setHeaderInitials(logInUser);
    await fetchTasks();
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

function displayUrgentTasksCounter(){
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
    console.log(urgentDates)
    urgentDates.sort(function(a,b){
        let dateA = new Date(a);
        let dateB = new Date(b);
        return dateA - dateB;
    })
    console.log(urgentDates)
}
