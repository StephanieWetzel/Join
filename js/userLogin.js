let users = [];
let loginUser;
async function init(){
    await fetchUsers();
}

function login(){
    debugger
    let user = users.find(user => user.mail == email.value);
    let pw = users.find(user => user.password == password.value)
    if (user && pw) {
        loginUser = user;
        saveLoggedInUser();
        let popup = document.getElementById('valid');
        popup.classList.add('show');
        setTimeout(() => {
            window.location.href = 'summary.html?msg=Login_successfull';
        }, 4200);
    }else{
        let popup = document.getElementById('invalid');
        popup.classList.add('show');
        setTimeout(() => {
            location.reload()
        }, 4200);
    }
}

function resetValues(){
    email.value = '';
    password.value = '';
}

function saveLoggedInUser(){
    let loggedInUserAsJSON = JSON.stringify(loginUser);
    localStorage.setItem('loggedInUser', loggedInUserAsJSON);
}

//loggedInUser