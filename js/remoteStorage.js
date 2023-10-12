const STORAGE_TOKEN = '4IQMVEDAS02VQ4EJLUVFCEPW7G87BF8LMGK1KYF7';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';

async function setItem(key, value){
    const payload = {key, value, token: STORAGE_TOKEN}
    return fetch(STORAGE_URL, {
        method: 'POST', 
        body: JSON.stringify(payload)}).then(res => res.json());
}

async function getItem(key){
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json()).then(res => {
        if (res.data) {
            return res.data.value
        } throw `Could not find data with "${key}".`; 
    });
}

async function fetchContacts(){
    try{
        contacts = JSON.parse(await getItem('contacts'));
    }catch (e){
        console.error('Loading error:', e);
    }   
}

async function fetchUsers(){
    try{
        users = JSON.parse(await getItem('users'));
    }catch (e){
        console.error('Loading error:', e);
    }
}
/*Handle with care xD*/
async function deleteAllUsers(){
    let users = [];
    await setItem('users', JSON.stringify(users));
}