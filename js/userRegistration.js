
let users =[];
let contacts =[];

async function init(){
    await fetchUsers();
    await fetchContacts();
}

function checkPasswords(){
    let pw = document.getElementById('password');
    let cPw = document.getElementById('cPassword');

    if (pw.value !== cPw.value) {
        cPw.setCustomValidity("Passwords don't match")
    }else{
        cPw.setCustomValidity('');
    }
}

function checkFullName(){
    let user = users.find(user => user.firstName + ' ' + user.lastName == fullName.value);
    if (user) {
        fullName.setCustomValidity("Username allready taken!");
    }else{
        fullName.setCustomValidity('');
    }
}

function checkEmail(){
    let user = users.find(user => user.mail == email.value);
    if (user) {
        email.setCustomValidity("Email already taken!");
    }else{
        email.setCustomValidity('');
    }
}

async function registration(){
    let firstLastName = splitString(fullName.value);
    users.push(new User(firstLastName[0], firstLastName[1], email.value, password.value));
    contacts.push(new Contact(firstLastName[0], firstLastName[1], "", email.value));
    await setItem('users', JSON.stringify(users));
    await setItem('contacts', JSON.stringify(contacts));
    clearInputs();
    window.location.href = 'login_index.html?msg=Registration succes!';
}

function clearInputs(){
    fullName.value = '';
    email.value = '';
    password.value = '';
    cPassword.value = '';
}

function splitString(string){
    let strings = [];
    strings.push(string.substring(0, string.indexOf(' ')));
    strings.push(string.substring(string.indexOf(' ') + 1));
    return strings;
}