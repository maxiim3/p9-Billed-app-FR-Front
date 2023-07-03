import {ROUTES_PATH} from '../constants/routes.js'
import {formatDate, formatStatus} from "../app/format.js"
import Logout from "./Logout.js"

export default class {
    /**
     * Constructor for the class.
     * Sets up event listeners for button clicks and initializes the Logout component.
     * @param {Object} options - The options for the class
     * @param {Document} options.document - The global document object
     * @param {function} options.onNavigate - The function to call to navigate to a new page
     * @param {Store} options.store - The Store instance to use
     * @param {Storage} options.localStorage - The global localStorage object
     */
    constructor({document, onNavigate, store, localStorage}) {
        this.document = document
        this.onNavigate = onNavigate
        this.store = store
        const buttonNewBill = document.querySelector(`button[data-testid="btn-new-bill"]`)
        if (buttonNewBill) buttonNewBill.addEventListener('click', this.handleClickNewBill)
        const iconEye = document.querySelectorAll(`div[data-testid="icon-eye"]`)
        if (iconEye) iconEye.forEach(icon => {
            icon.addEventListener('click', () => this.handleClickIconEye(icon))
        })
        new Logout({document, localStorage, onNavigate})
    }

    /**
     * Handles the click event for the new bill button.
     * Navigates to the NewBill page.
     */
    handleClickNewBill = () => {
        this.onNavigate(ROUTES_PATH['NewBill'])
    }
    /**
     * Handles the click event for the eye icon.
     * Opens a modal with an image of the bill.
     * @param {Element} icon - The eye icon that was clicked
     */
    handleClickIconEye = (icon) => {
        const billUrl = icon.getAttribute("data-bill-url")

        // extract the jQuery selector into a variable
        const $modaleFile = $('#modaleFile');

        const imgWidth = Math.floor($modaleFile.width() * 0.5)
        $modaleFile.find(".modal-body").html(`<div style='text-align: center;' class="bill-proof-container"><img crossorigin="anonymous" width=${imgWidth} src=${billUrl} alt="Bill" /></div>`)
        $modaleFile.modal('show')
    }
    /**
     * Retrieves a list of bills from the store.
     * Formats the date and status of each bill for display.
     * @returns {Promise<Array>} A promise that resolves to an array of bills
     */
    getBills = () => {
        if (this.store) {
            // console.log("Container/Bills.js - getBills() has been called") // debug
            return this.store
                .bills()
                .list()
                .then(snapshot => {
                    const bills = snapshot
                        .sort((a, b) => new Date(b.date) - new Date(a.date))
                        .map(doc => {
                            try {
                                return {
                                    ...doc,
                                    date: formatDate(doc.date),
                                    status: formatStatus(doc.status)
                                }
                            } catch (e) {
                                // if for some reason, corrupted data was introduced, we manage here failing formatDate function
                                // log the error and return unformatted date in that case
                                console.log(e, 'for', doc)
                                return {
                                    ...doc,
                                    date: doc.date,
                                    status: formatStatus(doc.status)
                                }
                            }
                        })
                    return bills
                })
        }
    }
}
