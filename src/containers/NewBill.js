import { ROUTES_PATH } from '../constants/routes.js'
import Logout from "./Logout.js"

export default class NewBill {
    constructor({ document, onNavigate, store, localStorage }) {
        this.document = document
        this.onNavigate = onNavigate
        this.store = store
        const formNewBill = this.document.querySelector(`form[data-testid="form-new-bill"]`)
        formNewBill.addEventListener("submit", this.handleSubmit)
        const file = this.document.querySelector(`input[data-testid="file"]`)
        file.addEventListener("change", this.handleChangeFile)
        this.fileUrl = null
        this.fileName = null
        this.billId = null
        new Logout({ document, localStorage, onNavigate })
    }

    /**
     * # is valid extension
     * @description check if the file extension is valid
     * @param fileType: string
     * @returns {boolean}
     * @throws {Error} if the file extension is not valid
     */
    isValidExtension(fileType) {

        if (typeof fileType !== 'string')
            throw new Error('extension is not type of string')
        else if (!fileType.includes("image"))
            throw new Error("the uploaded file must be an image of type jps, jpeg or png")
        else {
            let extension = fileType?.split('/')[1]
            let validExtensions = ['jpg', 'jpeg', 'png']

            if (validExtensions.includes(extension)) return true

            throw new Error('The image must be of type jpg, jpeg or png')
        }
    }

    handleChangeFile = e => {
        e.preventDefault()
        const file = this.document.querySelector(`input[data-testid="file"]`).files[0]
        const fileName = file.name
        try {

            const isValidFile = this.isValidExtension(file.type)

            if (!isValidFile) return

            // const updatedFile = {...file, fileName: fileName + }
        const formData = new FormData()
            console.log(file)
        const email = JSON.parse(localStorage.getItem("user")).email
        formData.append('file', file)
        formData.append('email', email)

        this.store
            .bills()
            .create({
                data: formData,
                headers: {
                    noContentType: true
                }
            })
                .then((FormData) => {
                    this.billId = FormData.key
                    this.fileUrl = formData.filePath
                    this.fileName = FormData.fileName
            }).catch(error => console.error(error))
        } catch (err) {
            const parentDiv = e.srcElement.parentElement
            const errorMessage = err
            const feedbackMsg = document.createElement('div')
            feedbackMsg.setAttribute('class', 'feedback-user')
            feedbackMsg.innerHTML = `
                    <p style="font-size: 12px; color:red">${errorMessage}</p>
                `
            parentDiv.appendChild(feedbackMsg)
            e.target.value = ""

            // console.error(err)
    }
    }
    handleSubmit = e => {
        e.preventDefault()
        console.log('e.target.querySelector(`input[data-testid="datepicker"]`).value', e.target.querySelector(`input[data-testid="datepicker"]`).value)
        const email = JSON.parse(localStorage.getItem("user")).email
        const bill = {
            email,
            type: e.target.querySelector(`select[data-testid="expense-type"]`).value,
            name:  e.target.querySelector(`input[data-testid="expense-name"]`).value,
            amount: parseInt(e.target.querySelector(`input[data-testid="amount"]`).value),
            date:  e.target.querySelector(`input[data-testid="datepicker"]`).value,
            vat: e.target.querySelector(`input[data-testid="vat"]`).value,
            pct: parseInt(e.target.querySelector(`input[data-testid="pct"]`).value) || 20,
            commentary: e.target.querySelector(`textarea[data-testid="commentary"]`).value,
            fileUrl: this.fileUrl,
            fileName: this.fileName,
            status: 'pending'
        }
        this.updateBill(bill)
        this.onNavigate(ROUTES_PATH['Bills'])
    }

    // not need to cover this function by tests
    updateBill = (bill) => {
        if (this.store) {
            this.store
                .bills()
                .update({data: JSON.stringify(bill), selector: this.billId})
                .then(() => {
                    this.onNavigate(ROUTES_PATH['Bills'])
                })
                .catch(error => console.error(error))
        }
    }
}
