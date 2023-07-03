// Import necessary modules
import store from "./Store.js"
import Login, {PREVIOUS_LOCATION} from "../containers/Login.js"
import Bills from "../containers/Bills.js"
import NewBill from "../containers/NewBill.js"
import Dashboard from "../containers/Dashboard.js"
import BillsUI from "../views/BillsUI.js"
import DashboardUI from "../views/DashboardUI.js"
import {ROUTES, ROUTES_PATH} from "../constants/routes.js"


/**
 * Initializes the application, sets up routing and views for the current URL
 * @returns {null}
 */
export default () => {
    // Access the root DOM element
    const rootDiv = document.getElementById('root')

    // Initialize the app view based on the current route
    rootDiv.innerHTML = ROUTES({pathname: window.location.pathname})

    handleNavigation(rootDiv)

    getOnpopstate(rootDiv)

    handlePageLoadAndRefresh(rootDiv);

    return null
}

/**
 * Handles navigation for single page application.
 * It updates the history state and changes the view based on the given pathname.
 * @param {Object} rootDiv - Root DOM element
 */
function handleNavigation(rootDiv) {
    window.onNavigate = (pathname) => {
        // Update history state
        window.history.pushState({}, pathname, window.location.origin + pathname)

        // Route handling logic
        // Login route
        if (pathname === ROUTES_PATH['Login']) {
            // Update view and create new Login container
            rootDiv.innerHTML = ROUTES({pathname})
            document.body.style.backgroundColor = "#0E5AE5"
            new Login({document, localStorage, onNavigate, PREVIOUS_LOCATION, store})
        }
        // Bills route
        else if (pathname === ROUTES_PATH['Bills']) {
            // Update view, adjust icons and create new Bills container
            rootDiv.innerHTML = ROUTES({pathname, loading: true})
            setActiveIcon('layout-icon1')
            initializeBills(rootDiv, error => {
                rootDiv.innerHTML = ROUTES({pathname, error})
            })
        }
        // New Bill route
        else if (pathname === ROUTES_PATH['NewBill']) {
            // Update view, adjust icons and create new NewBill container
            rootDiv.innerHTML = ROUTES({pathname, loading: true})
            new NewBill({document, onNavigate, store, localStorage})
            setActiveIcon('layout-icon2')
        }
        // Dashboard route
        else if (pathname === ROUTES_PATH['Dashboard']) {
            // Update view and create new Dashboard container
            rootDiv.innerHTML = ROUTES({pathname, loading: true})
            initializeDashboardUI(rootDiv, error => {
                    rootDiv.innerHTML = ROUTES({pathname, error})
                }
            );
        }
    };
}

/**
 * Handles popstate events, adjusts the view based on whether a user is logged in.
 * @param {Object} rootDiv - Root DOM element
 */
function getOnpopstate(rootDiv) {
    window.onpopstate = (e) => {
        const user = JSON.parse(localStorage.getItem('user'))
        if (window.location.pathname === "/" && !user) {
            document.body.style.backgroundColor = "#0E5AE5"
            rootDiv.innerHTML = ROUTES({pathname: window.location.pathname})
        } else if (user) {
            onNavigate(PREVIOUS_LOCATION)
        }
    };
}

/**
 * Handles page load and page refresh events.
 * It sets up the correct page view based on the URL and hash.
 * @param {Object} rootDiv - Root DOM element
 */
function handlePageLoadAndRefresh(rootDiv) {
    // Handle page refresh or initial page load
    if (window.location.pathname === "/" && window.location.hash === "") {
        // Create new Login container if there is no hash
        new Login({document, localStorage, onNavigate, PREVIOUS_LOCATION, store})
        document.body.style.backgroundColor = "#0E5AE5"
    } else if (window.location.hash !== "") {
        // Handle different hashes (routes) as necessary
        if (window.location.hash === ROUTES_PATH['Bills']) {
            // Create new Bills container if hash is '#Bills'
            rootDiv.innerHTML = ROUTES({pathname: window.location.hash, loading: true})
            setActiveIcon('layout-icon1')
            initializeBills(rootDiv, error => {
                rootDiv.innerHTML = ROUTES({pathname: window.location.hash, error})
            })
        } else if (window.location.hash === ROUTES_PATH['NewBill']) {
            // Create new NewBill container if hash is '#NewBill'
            rootDiv.innerHTML = ROUTES({pathname: window.location.hash, loading: true})
            new NewBill({document, onNavigate, store, localStorage})
            setActiveIcon('layout-icon2')
        } else if (window.location.hash === ROUTES_PATH['Dashboard']) {
            // Create new Dashboard container if hash is '#Dashboard'
            rootDiv.innerHTML = ROUTES({pathname: window.location.hash, loading: true})
            initializeDashboardUI(rootDiv, error => {
                    rootDiv.innerHTML = ROUTES({pathname: window.location.hash, error})
                }
            )
        }
    }
}

/**
 * Initializes the Bills view.
 * It fetches the bills data, renders the Bills UI, and initializes the Bills container.
 * @param {Object} rootDiv - Root DOM element
 * @param {function} errorReturnStatement - Function to execute on data fetch error
 */
function initializeBills(rootDiv, errorReturnStatement) {
    // console.log("Router/initializeBills : initializeBills from Router has been called") // debug
    const bills = new Bills({document, onNavigate, store, localStorage})
    bills.getBills().then(data => {
        rootDiv.innerHTML = BillsUI({data})
        setActiveIcon('layout-icon1')
        new Bills({document, onNavigate, store, localStorage})
    }).catch(errorReturnStatement)
}

/**
 * Sets the active icon based on the current view.
 * @param {string} activeIcon - The ID of the icon to be set as active
 */
function setActiveIcon(activeIcon) {
    const divIcon1 = document.getElementById('layout-icon1')
    const divIcon2 = document.getElementById('layout-icon2')
    switch (activeIcon) {
        case 'layout-icon1' :
            divIcon1.classList.add('active-icon')
            divIcon2.classList.remove('active-icon')
            break;
        case 'layout-icon2' :
            divIcon1.classList.remove('active-icon')
            divIcon2.classList.add('active-icon')
    }
}

/**
 * Initializes the Dashboard view.
 * It fetches all bills data, renders the Dashboard UI, and initializes the Dashboard container.
 * @param {Object} rootDiv - Root DOM element
 * @param {function} errorReturnStatement - Function to execute on data fetch error
 */
function initializeDashboardUI(rootDiv, errorReturnStatement) {
    const bills = new Dashboard({document, onNavigate, store, bills: [], localStorage})
    bills.getBillsAllUsers().then(bills => {
        rootDiv.innerHTML = DashboardUI({data: {bills}})
        new Dashboard({document, onNavigate, store, bills, localStorage})
    }).catch(errorReturnStatement)
}
