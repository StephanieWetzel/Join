
let users = [];
let contacts = [];

async function init() {
    await fetchUsers();
    await fetchContacts();
}

function checkPasswords() {
    let pw = document.getElementById('password');
    let cPw = document.getElementById('cPassword');
    if (pw.value !== cPw.value) {
        cPw.setCustomValidity("Passwords don't match")
    } else {
        cPw.setCustomValidity('');
    }
}

function checkFullName() {
    let user = users.find(user => user.firstName + ' ' + user.lastName == fullName.value);
    if (user) {
        fullName.setCustomValidity("Username already taken!");
    } else {
        fullName.setCustomValidity('');
    }
}

function checkEmail() {
    let user = users.find(user => user.mail == email.value);
    if (user) {
        email.setCustomValidity("Email already taken!");
    } else {
        email.setCustomValidity('');
    }
}

async function registration() {
    let firstLastName = splitString(fullName.value);
    users.push(new User(firstLastName[0], firstLastName[1], email.value, password.value));
    contacts.push(new Contact(firstLastName[0], firstLastName[1], "", email.value));
    await setItem('users', JSON.stringify(users));
    await setItem('contacts', JSON.stringify(contacts));
    animatePopup();
}

function animatePopup() {
    let blend = document.getElementById('popupBlend');
    let popTxt = document.getElementById('popupText');
    blend.classList.remove('d-none');
    blend.classList.add('animate-popup-blend');
    popTxt.classList.add('animate-popup-text');
    setTimeout(() => {
        clearInputs();
        window.location.href = 'login_index.html?msg=Registration succes!';
    }, 3200)
}

function clearInputs() {
    fullName.value = '';
    email.value = '';
    password.value = '';
    cPassword.value = '';
}

function splitString(string) {
    let strings = [];
    strings.push(string.substring(0, string.indexOf(' ')));
    strings.push(string.substring(string.indexOf(' ') + 1));
    return strings;
}

function toggleFishEye(BtnID, ImgID){
    let pwInput = document.getElementById("password");
    let fishBtn = document.getElementById(BtnID);
    let fishBtnImg = document.getElementById(ImgID);
    let count = pwInput.value;
    if (count.length >= 1 && window.innerHeight > 670) {
        pwInput.style.background = "none";
        fishBtnImg.src = "/assets/images/fish_Eye_closed2.svg"
        fishBtn.style.margin = "32px 0 0 -71px"
    }else if (count.length >= 1 && window.innerHeight <= 670) {
        pwInput.style.background = "none";
        fishBtnImg.src = "/assets/images/fish_Eye_closed2.svg"
        fishBtn.style.margin = "6px 0 -2px -64px"
    }
}

function togglePasswordVisibility(id, btnId){
    let pwInput = document.getElementById(id);
    let btnImg = document.getElementById(btnId);
    if (pwInput.type === "password") {
        pwInput.type = "text";
        btnImg.src = "/assets/images/fish_Eye_open.svg";
    }else{
        btnImg.src = "/assets/images/fish_Eye_closed2.svg";
        pwInput.type = "password";
    }
}