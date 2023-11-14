
let users = [];
let contacts = [];

/**
 * Initializes the application by fetching user and contact data.
 */
async function init() {
    await fetchUsers();
    await fetchContacts();
}

/**
 * Checks if the entered password and confirm password match and sets custom validation message.
 */
function checkPasswords() {
    let pw = document.getElementById('password');
    let cPw = document.getElementById('cPassword');
    if (pw.value !== cPw.value) {
        cPw.setCustomValidity("Passwords don't match")
    } else {
        cPw.setCustomValidity('');
    }
}

/**
 * Checks if the entered full name is already taken by a user and sets a custom validation message.
 */
function checkFullName() {
    let user = users.find(user => user.firstName + ' ' + user.lastName == fullName.value);
    if (user) {
        fullName.setCustomValidity("Username already taken!");
    } else {
        fullName.setCustomValidity('');
    }
}

/**
 * Checks if the entered email is already taken by a user and sets a custom validation message.
 */
function checkEmail() {
    let user = users.find(user => user.mail == email.value);
    if (user) {
        email.setCustomValidity("Email already taken!");
    } else {
        email.setCustomValidity('');
    }
}

/**
 * Handles user registration by creating a new user and contact, storing them in local storage,
 * and triggering an animation for the registration success popup.
 */
async function registration() {
    let firstLastName = splitString(fullName.value);
    users.push(new User(firstLastName[0], firstLastName[1], email.value, password.value));
    contacts.push(new Contact(firstLastName[0], firstLastName[1], "", email.value));
    await setItem('users', JSON.stringify(users));
    await setItem('contacts', JSON.stringify(contacts));
    animatePopup();
}

/**
 * Animates a registration success popup by applying CSS animations, clearing input fields,
 * and redirecting to the login page after a delay.
 */
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

/**
 * Clears the form-validation inputfields
 */
function clearInputs() {
    fullName.value = '';
    email.value = '';
    password.value = '';
    cPassword.value = '';
}

/**
 * Splits a string into an array of substrings based on the first occurrence of a space character (' ').
 *
 * @param {string} string - The string to be split.
 * @returns {string[]} An array containing the substrings obtained by splitting the input string. 
 */
function splitString(string) {
    let strings = [];
    strings.push(string.substring(0, string.indexOf(' ')));
    strings.push(string.substring(string.indexOf(' ') + 1));
    return strings;
}

/**
 * Toggles the visibility of the password using a "fish eye" effect, changing button and image styles.
 *
 * @param {string} BtnID - The ID of the button element associated with the fish eye effect.
 * @param {string} ImgID - The ID of the image element associated with the fish eye effect.
 */
function toggleFishEye(BtnID, ImgID) {
    let pwInput = document.getElementById("password");
    let fishBtn = document.getElementById(BtnID);
    let fishBtnImg = document.getElementById(ImgID);
    const querie = window.matchMedia("(max-width: 360px)")
    let count = pwInput.value;
    if (count.length >= 1 && window.innerHeight > 670 && !querie.matches) {
        toggleFishEyeStyle(pwInput, fishBtnImg, fishBtn, "32px 0 0 -71px");
    } else if (count.length >= 1 && window.innerHeight <= 670 && !querie.matches) {
        toggleFishEyeStyle(pwInput, fishBtnImg, fishBtn, "6px 0 -2px -64px");
    }else if (count.length >= 1 && querie.matches) {
        toggleFishEyeStyle(pwInput, fishBtnImg, fishBtn, "10px -12px 0px -71px");
    }
}

/**
 * Toggle the fish eye style by updating styles.
 * 
 * @param {HTMLElement} pwInput - The password input element.
 * @param {HTMLElement} fishBtnImg - The image element representing the fish button.
 * @param {HTMLElement} fishBtn - The fish button element.
 * @param {string} style - The margin style to be applied to the fish button.
 */
function toggleFishEyeStyle(pwInput, fishBtnImg, fishBtn, style){
    pwInput.style.background = "none";
    fishBtnImg.src = "./assets/images/fish_Eye_closed2.svg"
    fishBtn.style.margin = style;
}

/**
 * Toggles the visibility of a password input field and updates the associated button's image.
 *
 * @param {string} id - The ID of the password input element to toggle.
 * @param {string} btnId - The ID of the button element with the image to update.
 */
function togglePasswordVisibility(id, btnId) {
    let pwInput = document.getElementById(id);
    let btnImg = document.getElementById(btnId);
    if (pwInput.type === "password") {
        pwInput.type = "text";
        btnImg.src = "./assets/images/fish_Eye_open.svg";
    } else {
        btnImg.src = "./assets/images/fish_Eye_closed2.svg";
        pwInput.type = "password";
    }
}