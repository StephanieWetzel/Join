const STORAGE_TOKEN = '4IQMVEDAS02VQ4EJLUVFCEPW7G87BF8LMGK1KYF7';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';

/**
 * Sets and saves an item in the remote storage using a key-value pair.
 *
 * @param {string} key - The key to associate with the item in storage.
 * @param {string} value - The value to store in the remote storage.
 * @returns {Promise} A promise that resolves with the result of the remote storage operation.
 */
async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN }
    return fetch(STORAGE_URL, {
        method: 'POST',
        body: JSON.stringify(payload)
    }).then(res => res.json());
}

/**
 * Retrieves an item from the remote storage using a key.
 *
 * @param {string} key - The key associated with the item to retrieve from storage.
 * @returns {Promise} A promise that resolves with the retrieved item's value or rejects with an error message.
 */
async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json()).then(res => {
        if (res.data) {
            return res.data.value
        } throw `Could not find data with "${key}".`;
    });
}

/**
 * Fetches and loads contact data from remote storage into the 'contacts' variable.
 * If the data does not exist, it handles and logs an error.
 */
async function fetchContacts() {
    try {
        contacts = JSON.parse(await getItem('contacts'));
    } catch (e) {
        console.error('Loading error:', e);
    }
}

/**
 * Fetches and loads user data from remote storage into the 'users' variable.
 * If the data does not exist, it handles and logs an error.
 */
async function fetchUsers() {
    try {
        users = JSON.parse(await getItem('users'));
    } catch (e) {
        console.error('Loading error:', e);
    }
}

/**
 * Fetches and loads task data from remote storage into the 'tasks' variable.
 * If the data does not exist, it handles and logs an error.
 */
async function fetchTasks() {
    try {
        tasks = JSON.parse(await getItem('tasks'));
    } catch (e) {
        console.error('Loading error:', e);
    }
}


/*Handle with care xD*/
/**
 * Deletes all saved users at the server
 */
async function deleteAllUsers() {
    let users = [];
    await setItem('users', JSON.stringify(users));
}

/**
 * Deletes all saved contacts at the server
 */
async function deleteAllContacts() {
    let contacts = [];
    await setItem('contacts', JSON.stringify(contacts));
}

/**
 * Deletes all saved tasks at the server
 */
async function deleteAllTasks(){
    let tasks = [];
    await setItem('tasks', JSON.stringify(tasks));
}


