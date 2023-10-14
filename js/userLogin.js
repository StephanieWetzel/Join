let users = [];

async function init(){
    await fetchUsers();
}

function login(){
    let user = users.find(user => user.mail == email.value);
    let pw = users.find(user => user.password == password.value)
    if (user && pw) {
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