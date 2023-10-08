class Contact{
    firstName;
    lastName;
    phone;
    mail;
    color;

    constructor(firstName, lastName, phone, mail){
        this.firstName = firstName;
        this.lastName = lastName;
        this.phone = phone;
        this.mail = mail;
        this.getRNDColor();
    }

    getRNDColor(){
        const red = Math.floor(Math.random()*256);
        const green = Math.floor(Math.random()*256);
        const blue = Math.floor(Math.random()*256);
        const rndColor = `rgb(${red},${green},${blue})`;
        this.color = rndColor;
    }
}