/**
 * Represents a user with basic information
 */
class User {
    firstName;
    lastName;
    mail;
    password;

    /**
     * Creates a new user instance.
     *
     * @param {string} firstName - The user's first name.
     * @param {string} lastName - The user's last name.
     * @param {string} mail - The user's email address.
     * @param {string} password - The user's password. 
     */
    constructor(firstName, lastName, mail, password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.mail = mail;
        this.password = password;
    }
}