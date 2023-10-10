async function init(activeSection){
    await includeHTML();
    markActiveSection(activeSection);
    greet();
}


function greet() {
    let content = document.getElementById('greet');
    const currentTime = new Date();
    const currentHour = currentTime.getHours();

    let greetingMessage = '';

    if (currentHour >= 5 && currentHour < 12) {
        greetingMessage = 'Good morning,';
    } else if (currentHour >= 12 && currentHour < 18) {
        greetingMessage = 'Good Afternoon,';
    } else {
        greetingMessage = 'Good Evening,';
    }

    content.innerHTML = `
        <h2>${greetingMessage}</h2>
        <h1>Sofia Müller</h1>
    `;
}
