import {ROUTES_PATH} from '../constants/routes.js'
import Logout from "./Logout.js"

/**
 * # NewBill
 * @description This class represents a new bill in the system.
 * @property {Object} document - The document object from the DOM.
 * @property {Function} onNavigate - A function used to navigate within the app.
 * @property {Object} store - The store object to manage data.
 * @property {string} fileUrl - The URL of the file uploaded.
 * @property {string} fileName - The name of the file uploaded.
 * @property {string} billId - The unique ID of the bill.
 */
export default class NewBill {
    /**
     * # constructor
     * @description Initializes a new instance of the NewBill class.
     * @param {Object} params - The initialization parameters.
     * @param {Object} params.document - The document object from the DOM.
     * @param {Function} params.onNavigate - A function used to navigate within the app.
     * @param {Object} params.store - The store object to manage data.
     * @param {Object} params.localStorage - The local storage to manage persistent data.
     */
    constructor({document, onNavigate, store, localStorage}) {
        this.document = document
        this.onNavigate = onNavigate
        this.store = store
        this.fileUrl = null
        this.fileName = null
        this.billId = null
        this.initForm(document, localStorage, onNavigate); // 👈 Extracted initialization to separate function
    }

    /**
     * # initForm
     * @description Initializes the form by attaching the appropriate event listeners.
     * @param {Object} document - The document object from the DOM.
     * @param {Object} localStorage - The local storage to manage persistent data.
     * @param {Function} onNavigate - A function used to navigate within the app.
     * @dependency constructor
     */
    initForm(document, localStorage, onNavigate) {
        const formNewBill = document.querySelector(`form[data-testid="form-new-bill"]`);
        formNewBill.addEventListener("submit", this.handleSubmit);
        const file = document.querySelector(`input[data-testid="file"]`);
        file.addEventListener("change", this.handleChangeFile);
        new Logout({document, localStorage, onNavigate});
    }

    /**
     * # handleChangeFile
     * @description Handles the event of a file change.
     * @param {Object} event - The event object.
     * @dependency initForm, removeExistingMessage, isValidFileType, handleValidFile, handleInvalidFile, uploadFile
     * @return void
     * @example handleChangeFile(event)
     */
    handleChangeFile = (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        const fileName = file.name;
        const fileExtension = fileName.split('.').pop().toLowerCase();

        const parentElement = event.target.parentNode;
        this.removeExistingMessage(parentElement);  // 👈 Extracted logic to separate function

        if (this.isValidFileType(fileExtension)) {
            this.handleValidFile(parentElement, fileName); // 👈 Extracted logic to separate function
        } else {
            this.handleInvalidFile(parentElement, fileExtension); // 👈 Extracted logic to separate function
        }

        this.uploadFile(file, fileName); // 👈 Extracted logic to separate function
    }

    /**
     * # removeExistingMessage
     * @description Removes any existing validation message.
     * @param {Object} parentElement - The parent element of the validation message.
     * @dependency handleChangeFile
     * @return void
     * @example removeExistingMessage(parentElement)
     */
    removeExistingMessage(parentElement) {
        const existingMessage = parentElement.querySelector('.file-type-info');
        if (existingMessage) {
            parentElement.removeChild(existingMessage);
        }
    }


    /**
     * # isValidFileType
     * @description Checks if the file type is valid.
     * @param {string} fileExtension - The file extension.
     * @dependency handleChangeFile
     * @return {boolean} Whether the file type is valid.
     * @example isValidFileType('jpg')
     */
    isValidFileType(fileExtension) {
        return ['jpg', 'jpeg', 'png'].includes(fileExtension);
    }

    /**
     * # handleValidFile
     * @description Handles the event of a valid file.
     * @param {Object} parentElement - The parent element of the file input.
     * @param {string} fileName - The name of the file.
     * @dependency handleChangeFile, addMessage, emitCustomEvent
     * @return void
     * @example handleValidFile(parentElement, fileName)
     */
    handleValidFile(parentElement, fileName) {
        this.addMessage(parentElement, `${fileName} uploaded successfully.`, 'green');
        this.emitCustomEvent(parentElement, 'fileAccepted', {fileName});
    }

    /**
     * # handleInvalidFile
     * @description Handles the event of an invalid file.
     * @param {Object} parentElement - The parent element of the file input.
     * @param {string} fileExtension - The file extension.
     * @dependency handleChangeFile, addMessage, emitCustomEvent
     * @return void
     * @example handleInvalidFile(parentElement, fileExtension)
     */
    handleInvalidFile(parentElement, fileExtension) {
        if (fileExtension === 'pdf') {
            this.addMessage(parentElement, 'This file is not supported, please upload a JPG, JPEG or PNG file.', 'red');
            this.emitCustomEvent(parentElement, 'fileRejected');
        }
    }

    /**
     * # addMessage
     * @description Adds a validation message.
     * @param {Object} parentElement - The parent element of the validation message.
     * @param {string} text - The validation message.
     * @param {string} color - The color of the validation message.
     * @dependency handleValidFile, handleInvalidFile
     * @return void
     * @example addMessage(parentElement, 'Uploaded successfully.', 'green')
     */
    addMessage(parentElement, text, color) {
        let textElement = document.createElement('p');
        textElement.textContent = text;
        textElement.style.color = color;
        textElement.classList.add('file-type-info');
        parentElement.appendChild(textElement);
    }

    /**
     * # emitCustomEvent
     * @description Emits a custom event.
     * @param {Object} parentElement - The parent element of the event.
     * @param {string} eventName - The name of the event.
     * @param {Object} detail - The detail of the event.
     * @dependency handleValidFile, handleInvalidFile
     * @return void
     * @example emitCustomEvent(parentElement, 'fileAccepted', {fileName: 'example.jpg'})
     */
    emitCustomEvent(parentElement, eventName, detail) {
        const event = new CustomEvent(eventName, {detail: detail});
        parentElement.dispatchEvent(event);
    }

    /**
     * # uploadFile
     * @description Uploads a file.
     * @param {Object} file - The file to upload.
     * @param {string} fileName - The name of the file.
     * @dependency handleChangeFile
     * @return void
     * @example uploadFile(file, 'example.jpg')
     */
    uploadFile(file, fileName) {
        const formData = new FormData();
        const email = JSON.parse(localStorage.getItem("user")).email;
        formData.append('file', file);
        formData.append('email', email);

        this.store
            .bills()
            .create({
                data: formData,
                headers: {
                    noContentType: true
                }
            })
            .then(({fileUrl, key}) => {
                this.billId = key;
                this.fileUrl = fileUrl;
                this.fileName = fileName;
            }).catch(error => console.error(error))
    }

    /**
     * # handleSubmit
     * @description Handles the event of form submission.
     * @param {Object} event - The event object.
     * @dependency initForm, createBillObject, updateBill
     * @return void
     * @example handleSubmit(event)
     */
    handleSubmit = (event) => {
        event.preventDefault();
        const email = JSON.parse(localStorage.getItem("user")).email;
        const bill = this.createBillObject(email, event.target);
        this.updateBill(bill); // 👈 Extracted bill creation logic to separate function
        this.onNavigate(ROUTES_PATH['Bills'])
    }

    /**
     * # createBillObject
     * @description Creates a bill object.
     * @param {string} email - The email of the user.
     * @param {Object} target - The target element of the event.
     * @dependency handleSubmit
     * @return {Object} The bill object.
     * @example createBillObject('example@example.com', event.target)
     */
    createBillObject(email, target) {  // 👈 Extracted bill creation logic to separate function
        return {
            email,
            type: target.querySelector(`select[data-testid="expense-type"]`).value,
            name: target.querySelector(`input[data-testid="expense-name"]`).value,
            amount: parseInt(target.querySelector(`input[data-testid="amount"]`).value),
            date: target.querySelector(`input[data-testid="datepicker"]`).value,
            vat: target.querySelector(`input[data-testid="vat"]`).value,
            pct: parseInt(target.querySelector(`input[data-testid="pct"]`).value) || 20,
            commentary: target.querySelector(`textarea[data-testid="commentary"]`).value,
            fileUrl: this.fileUrl,
            fileName: this.fileName,
            status: 'pending'
        }
    }

    /**
     * # updateBill
     * @description Updates a bill.
     * @param {Object} bill - The bill to update.
     * @dependency handleSubmit
     * @return void
     * @example updateBill(bill)
     */
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
