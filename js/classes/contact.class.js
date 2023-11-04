/**
 * Represents a contact with various properties.
 */
class Contact{
    firstName;
    lastName;
    phone;
    mail;
    color;
    /**
     * Constructor for the contact class.
     * 
     * @param {string} firstName - The first name of the contact. 
     * @param {string} lastName - The last name of the contact.
     * @param {number} phone - The phone number of the contact.
     * @param {string} mail - The Email address of the contact
     */
    constructor(firstName, lastName, phone, mail){
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.mail = mail;
        this.getRNDColor();
    }
    
    /**
     * Generates a random RGB color and assigns it to the 'color' property of the calling object.
     */
    getRNDColor(){
        const red = Math.floor(Math.random()*256);
        const green = Math.floor(Math.random()*256);
        const blue = Math.floor(Math.random()*256);
        const rndColor = `rgb(${red},${green},${blue})`;
        this.color = rndColor;
    }
}