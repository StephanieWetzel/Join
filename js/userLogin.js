let users = [];
let loginUser;
let rememberedUser = 0;

/**
 * Initializes the login-section by performing various tasks in a specified order.
 * This function is responsible for fetching user data, handling user state (remembered state), and performing checks.
 *
 */
async function init() {
    await fetchUsers();
    loadRememberState();
    checkIfRemembered();
}

/**
 * Logs in a user based on the provided email and password, and performs related actions.
 * Shows succes message if login is succesfull and error message if login failed
 */
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

/**
 * Checks if a remembered user exists and fills the email and password fields if found.
 */
function checkIfRemembered() {
    if (rememberedUser) {
        email.value = rememberedUser[0]['mail'];
        password.value = rememberedUser[0]['password'];
    }
}

/**
 * Sets the remember-me state by saving user data if the remember-me checkbox is checked.
 */
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

/**
 * Saves the remember-me state by storing user data in local storage as a JSON string.
 */
function saveRememberState() {
    let rememberAsJSON = JSON.stringify(rememberedUser);
    localStorage.setItem('rememberedUser', rememberAsJSON)
}

/**
 * Loads the remember-me state by retrieving user data from local storage.
 */
function loadRememberState() {
    if (localStorage.getItem('rememberedUser')) {
        let rememberAsString = localStorage.getItem('rememberedUser');
        rememberedUser = JSON.parse(rememberAsString);
    }
}

/**
 * Proceeds to the summary with the guest status.
 */
function guestLogin() {
    window.location.href = 'summary.html?msg=Login_Guest';
}

/**
 * Resets the email and phone number values
 */
function resetValues() {
    email.value = '';
    password.value = '';
}

/**
 * Saves the login data from the user in the localstorage
 */
function saveLoggedInUser() {
    let loggedInUserAsJSON = JSON.stringify(loginUser);
    localStorage.setItem('loggedInUser', loggedInUserAsJSON);
}

/**
 * Toggles the visibility of the password as a plain text by changing the input field's style and the fish-eye button's appearance.
 */
function toggleFishEye() {
    let pwInput = document.getElementById("password");
    let fishBtn = document.getElementById('fishBtn');
    let fishBtnImg = document.getElementById("fishBtnImg");
    let count = pwInput.value;
    if (count.length >= 1) {
        pwInput.style.background = "none";
        fishBtnImg.src = "./assets/images/fish_Eye_closed2.svg"
        fishBtn.style.margin = "32px 0 0 -71px"
    } else {
        fishBtnImg.src = "assets/images/lock.svg"
    }
}

/**
 * Toggles the visibility of a password input field by changing its input type (text/password)
 * and updates the appearance of a related fish-eye button's image.
 *
 * @param {string} id - The ID of the password input field to toggle visibility for.
 */
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