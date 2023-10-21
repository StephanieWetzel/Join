
async function init(activeSection){
    await includeHTML();
    markActiveSection(activeSection);
    setRightHeaderInvis()
}

async function initHelp(){
    loadLocalStorageLoggedInUser('loggedInUser');
    await includeHTML();
    setHeaderInitials(logInUser);
}

async function initPlain(){
    await includeHTML();
    setRightHeaderInvis();
    setSideBarInvis();
    changeAGBLinks();
}


function setRightHeaderInvis(){
    let hSection2 = document.getElementById('headSection2');
    hSection2.classList.add('invis');
}

function setSideBarInvis(){
    document.getElementById('sidebarSections').classList.add('invis')
}

function changeAGBLinks(){
    let pSection = document.getElementById('policyRightsSection');
    pSection.innerHTML = /*html */`
    <a id="policy" href="plainPolicy.html">Privacy Policy</a>
    <a id="lNotice" href="plainLNotice.html">Legal Notice</a>
    `
}