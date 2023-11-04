/**
 * Initializes the web application by performing various tasks in a specified order.
 *
 * @param {string} activeSection - The ID of the section that should be marked as active in the navigation.
 */
async function init(activeSection){
    await includeHTML();
    markActiveSection(activeSection);
    setRightHeaderInvis()
}
/**
 * Initializes the help section of the web application by performing various tasks in a specified order.
 * This is a simplified initialization for the help section.
 */
async function initHelp(){
    loadLocalStorageLoggedInUser('loggedInUser');
    await includeHTML();
    setHeaderInitials(logInUser);
}

/**
 * Initializes the agb-section in a plain mode by performing various tasks in a specified order.
 * This mode simplifies the application's appearance and functionality.
 */
async function initPlain(){
    await includeHTML();
    setRightHeaderInvis();
    setSideBarInvis();
    changeAGBLinks();
}

/**
 * Sets the right header section as invisible by adding a CSS class.
 */
function setRightHeaderInvis(){
    let hSection2 = document.getElementById('headSection2');
    hSection2.classList.add('invis');
}

/**
 * Sets the sidebar section as invisible by adding a CSS class.
 */
function setSideBarInvis(){
    document.getElementById('sidebarSections').classList.add('invis')
}

/**
 * Changes the links related to terms and conditions (AGB) in the HTML content of a specific section.
 */
function changeAGBLinks(){
    let pSection = document.getElementById('policyRightsSection');
    pSection.innerHTML = /*html */`
    <a id="policy" href="plainPolicy.html">Privacy Policy</a>
    <a id="lNotice" href="plainLNotice.html">Legal Notice</a>
    `
}