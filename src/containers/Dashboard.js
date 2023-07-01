import {formatDate} from '../app/format.js'
import DashboardFormUI from '../views/DashboardFormUI.js'
import BigBilledIcon from '../assets/svg/big_billed.js'
import {ROUTES_PATH} from '../constants/routes.js'
import USERS_TEST from '../constants/usersTest.js'
import Logout from "./Logout.js"

export const filteredBills = (data, status) => {
    return (data && data.length) ?
        data.filter(bill => {
            let selectCondition

            // in jest environment
            if (typeof jest !== 'undefined') {
                selectCondition = (bill.status === status)
            }
            /* istanbul ignore next */
            else {
                // in prod environment
                const userEmail = JSON.parse(localStorage.getItem("user")).email
                selectCondition =
                    (bill.status === status) &&
                    ![...USERS_TEST, userEmail].includes(bill.email)
            }

            return selectCondition
        }) : []
}

export const card = (bill) => {
    const firstAndLastNames = bill.email.split('@')[0]
    const firstName = firstAndLastNames.includes('.') ?
        firstAndLastNames.split('.')[0] : ''
    const lastName = firstAndLastNames.includes('.') ?
        firstAndLastNames.split('.')[1] : firstAndLastNames

    return (`
    <div class='bill-card' id='open-bill${bill.id}' data-testid='open-bill${bill.id}' data-selected="false">
      <div class='bill-card-name-container'>
        <div class='bill-card-name'> ${firstName} ${lastName} </div>
        <span class='bill-card-grey'> ... </span>
      </div>
      <div class='name-price-container'>
        <span> ${bill.name} </span>
        <span> ${bill.amount} € </span>
      </div>
      <div class='date-type-container'>
        <span> ${formatDate(bill.date)} </span>
        <span> ${bill.type} </span>
      </div>
    </div>
  `)
}

export const cards = (bills) => {
    return bills && bills.length ? bills.map(bill => card(bill)).join("") : ""
}

export const getStatus = (index) => {
    switch (index) {
        case 1:
            return "pending"
        case 2:
            return "accepted"
        case 3:
            return "refused"
    }
}

export default class {
    constructor({document, onNavigate, store, bills, localStorage}) {
        this.document = document
        this.onNavigate = onNavigate
        this.store = store
        $('#arrow-icon1').click((e) => this.handleShowTickets(e, bills, 1))
        $('#arrow-icon2').click((e) => this.handleShowTickets(e, bills, 2))
        $('#arrow-icon3').click((e) => this.handleShowTickets(e, bills, 3))
        new Logout({localStorage, onNavigate})
        this.bills = bills
        this.observeTicketContainer()
    }

    handleClickIconEye = () => {
        const billUrl = $('#icon-eye-d').attr("data-bill-url")

        // extract the jQuery Selector as a constant
        const $modaleFileAdmin1 = $('#modaleFileAdmin1');

        const imgWidth = Math.floor($modaleFileAdmin1.width() * 0.8)
        $modaleFileAdmin1.find(".modal-body").html(`<div style='text-align: center;'><img crossorigin="anonymous" width=${imgWidth} src=${billUrl} alt="Bill"/></div>`)
        if (typeof $modaleFileAdmin1.modal === 'function') $modaleFileAdmin1.modal('show')
    }

    handleEditTicket(e, bill) {
        $('.dashboard-right-container div').html(DashboardFormUI(bill))
        $('.vertical-navbar').css({height: '150vh'})
        $('#icon-eye-d').click(this.handleClickIconEye)
        $('#btn-accept-bill').click((e) => this.handleAcceptSubmit(e, bill))
    }

    handleAcceptSubmit = (e, bill) => {
        const newBill = {
            ...bill,
            status: 'accepted',
            commentAdmin: $('#commentary2').val()
        }
        this.updateBill(newBill)
        this.onNavigate(ROUTES_PATH['Dashboard'])
    }

    handleRefuseSubmit = (e, bill) => {
        const newBill = {
            ...bill,
            status: 'refused',
            commentAdmin: $('#commentary2').val()
        }
        this.updateBill(newBill)
        this.onNavigate(ROUTES_PATH['Dashboard'])
    }

    handleShowTickets(e, bills, index) {
        // SET CURRENT CONTAINER INDEX TO INDEX OF CLICKED ARROW-ICON
        if (this.index === undefined || this.index !== index) this.index = index

        // GET CURRENT STATE
        const selector = `status-bills-container${index}`
        const currentContainer = document.getElementById(CSS.escape(selector))
        const containerIsOpen = currentContainer.dataset.open
        console.log(currentContainer)

        switch (containerIsOpen) {
            case "false":
                currentContainer.dataset.open = "true"
                return this.openContainer(index)
            case "true":
                currentContainer.dataset.open = "false"
                return this.closeContainer(index)
        }
        return this.bills


    }

    openContainer(index) {
        console.log(index)
        $(`#arrow-icon${index}`).css({transform: 'rotate(0deg)'})
        $(`#status-bills-container${index}`).html(cards(filteredBills(this.bills, getStatus(index))))
    }

    closeContainer(index) {
        $(`#arrow-icon${index}`).css({transform: 'rotate(90deg)'})
        $(`#status-bills-container${index}`).html("")
    }

    resetAllBillsState() {
        const displayedBills = [...document.querySelectorAll('.bill-card')]
        displayedBills.forEach(other => {
            other.dataset.selected = "false"
            other.style.backgroundColor = "#0D5AE5"
        })
    }

    resetRightContainer() {
        console.log("reset")
        $('.dashboard-right-container div').html(`
        <div id="big-billed-icon" data-testid="big-billed-icon"> ${BigBilledIcon} </div>
      `)
        $('.vertical-navbar').css({height: '120vh'})
    }

    observeTicketContainer() {
        const containers = [...document.querySelectorAll(".status-bills-container")]
        const observer = new MutationObserver(mutations => this.mutationCallBack(mutations, containers))
        containers.forEach(container => observer.observe(container, {subtree: true, attributes: true}))
    }

    mutationCallBack(mutations, containers) {
        // Select parent
        if (mutations[0].attributeName === "data-open") {
            const container = mutations[0].target
            const aContainerIsOpen = containers.some(container => container.dataset.open === "true")

            if (!aContainerIsOpen) this.resetRightContainer()
            else {
                const displayedBills = [...document.querySelectorAll('.bill-card')]
                displayedBills.every(bill => bill.dataset.selected === "false") && this.resetRightContainer()
                displayedBills.forEach(bill => {
                    bill.onclick = (e) => {
                        const $b = document.getElementById(bill.id)

                        if ($b.dataset.selected === "false") {
                            this.resetAllBillsState()
                            $b.dataset.selected = "true"
                            $b.style.backgroundColor = "#2A2B35"
                            const billId = $b.id.split('open-bill')[1]
                            const data = this.bills.find(({id}) => id === billId)
                            this.handleEditTicket(e, data)
                        } else if ($b.dataset.selected === "true") {
                            this.resetAllBillsState()
                            this.resetRightContainer()
                        }
                    }
                })
            }
        }
        // // Select Children
        // else if (mutations[0].attributeName === "data-selected") {
        //     const allBills = mutations.filter(mutation => mutation.attributeName === "data-selected")
        //     console.log(allBills)
        // }
    }

    getBillsAllUsers = () => {
        if (this.store) {
            return this.store
                .bills()
                .list()
                .then(snapshot => {
                    const bills = snapshot
                        .map(doc => ({
                            id: doc.id,
                            ...doc,
                            date: doc.date,
                            status: doc.status
                        }))
                    return bills
                })
                .catch(error => {
                    throw error;
                })
        }
    }

    // not need to cover this function by tests
    /* istanbul ignore next */
    updateBill = (bill) => {
        if (this.store) {
            return this.store
                .bills()
                .update({data: JSON.stringify(bill), selector: bill.id})
                .then(bill => bill)
                .catch(console.log)
        }
    }
}
