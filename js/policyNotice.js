
async function init(activeSection){
    await includeHTML();
    markActiveSection(activeSection);
    setRightHeaderInvis()
}


function setRightHeaderInvis(){
    let hSection2 = document.getElementById('headSection2');
    hSection2.classList.add('invis');
}