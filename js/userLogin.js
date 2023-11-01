let users = [];
let loginUser;
let rememberedUser = 0;
async function init() {
    await fetchUsers();
    loadRememberState();
    checkIfRemembered();
}

function login() {
    let user = users.find(user => user.mail == email.value);
    let pw = users.find(user => user.password == password.value)
    if (user && pw) {
        loginUser = user;
        saveLoggedInUser();
        setRememberMe();
        let popup = document.getElementById('valid');
        popup.classList.add('show');
        setTimeout(() => {
            window.location.href = 'summary.html?msg=Login_successfull';
        }, 4200);
    } else {
        let popup = document.getElementById('invalid');
        popup.classList.add('show');
        setTimeout(() => {
            location.reload()
        }, 4200);
    }
}

function checkIfRemembered(){
    if (rememberedUser) {
        email.value = rememberedUser[0]['mail'];
        password.value = rememberedUser[0]['password'];
    }
}

function setRememberMe() {
    let rememberMe = document.getElementById('rememberMe');
    if (rememberMe.checked) {
        rememberedUser = [{
            mail: email.value,
            password: password.value
        }];
        saveRememberState();
    }
}

function saveRememberState() {
    let rememberAsJSON = JSON.stringify(rememberedUser);
    localStorage.setItem('rememberedUser', rememberAsJSON)
}

function loadRememberState() {
    if (localStorage.getItem('rememberedUser')) {
        let rememberAsString = localStorage.getItem('rememberedUser');
        rememberedUser = JSON.parse(rememberAsString);
    }
}

function guestLogin() {
    window.location.href = 'summary.html?msg=Login_Guest';
}

function resetValues() {
    email.value = '';
    password.value = '';
}

function saveLoggedInUser() {
    let loggedInUserAsJSON = JSON.stringify(loginUser);
    localStorage.setItem('loggedInUser', loggedInUserAsJSON);
}

function toggleFishEye() {
    let pwInput = document.getElementById("password");
    let fishBtn = document.getElementById('fishBtn');
    let fishBtnImg = document.getElementById("fishBtnImg");
    let count = pwInput.value;
    if (count.length >= 1) {
        pwInput.style.background = "none";
        fishBtnImg.src = "/assets/images/fish_Eye_closed2.svg"
        fishBtn.style.margin = "32px 0 0 -71px"
    } else {
        fishBtnImg.src = "assets/images/lock.svg"
    }
}

function togglePasswordVisibility(id) {
    let fishBtnImg = document.getElementById("fishBtnImg");
    let pwInput = document.getElementById(id);
    if (pwInput.type === "password") {
        pwInput.type = "text";
        fishBtnImg.src = "assets/images/fish_Eye_open.svg"
    } else {
        pwInput.type = "password";
        fishBtnImg.src = "assets/images/fish_Eye_closed2.svg"

    }
}