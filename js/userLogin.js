let users = [];

async function init(){
    await fetchUsers();
}

function login(){
    let user = users.find(user => user.mail == email.value);
    let pw = users.find(user => user.password == password.value)
    if (user && pw) {
        console.log('Succes');
    }else{
        let popup = document.getElementById('invalid');
        popup.classList.remove('invis');
        popup.classList.add('show');
       /* setTimeout(() => {
            location.reload()
        }, 4000);*/
    }
}

function resetValues(){
    email.value = '';
    password.value = '';
}