/**
 * @jest-environment jsdom
 */

import {fireEvent, screen, waitFor} from "@testing-library/dom"
import NewBill from "../containers/NewBill.js"
import {ROUTES_PATH} from '../constants/routes.js'
import {localStorageMock} from "../__mocks__/localStorage.js";
import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {

    // Integration test POST
    describe("When I am on NewBill Page and I post a new bill", () => {
        test("Then the bill should be updated and I should navigate to Bills", () => {
            const html = document.createElement('div')
            html.innerHTML = `
            <form data-testid="form-new-bill">
                <select data-testid="expense-type">
                    <option value="type1">Type1</option>
                    <option value="type2">Type2</option>
                </select>
                <input data-testid="expense-name" type="text" />
                <input data-testid="amount" type="number" />
                <input data-testid="datepicker" type="date" />
                <input data-testid="vat" type="text" />
                <input data-testid="pct" type="number" />
                <textarea data-testid="commentary"></textarea>
                <input data-testid="file" type="file" />
                <button type="submit">Submit</button>
            </form>
        `
            document.body.innerHTML = html.outerHTML
            window.localStorage.setItem('user', JSON.stringify({email: 'test@email.com'}))
            const onNavigate = jest.fn()
            const localStorage = window.localStorage
            const firestore = null
            const newBill = new NewBill({
                document,
                onNavigate,
                firestore,
                localStorage
            })
            const handleSubmit = jest.fn(newBill.handleSubmit)
            const formNewBill = document.querySelector(`form[data-testid="form-new-bill"]`)
            formNewBill.addEventListener("submit", handleSubmit)
            newBill.updateBill = jest.fn()

            // Set form values
            formNewBill.querySelector(`input[data-testid="expense-name"]`).value = 'Test Expense'
            formNewBill.querySelector(`input[data-testid="amount"]`).value = '123'
            formNewBill.querySelector(`input[data-testid="datepicker"]`).value = '2023-05-30'
            formNewBill.querySelector(`input[data-testid="vat"]`).value = '20'
            formNewBill.querySelector(`input[data-testid="pct"]`).value = '20'
            formNewBill.querySelector(`textarea[data-testid="commentary"]`).value = 'Test commentary'


            // Set file-related properties of the NewBill instance
            newBill.fileUrl = 'http://example.com/test.jpeg';
            newBill.fileName = 'test.jpeg';

            // Simulate form submission
            fireEvent.submit(formNewBill)

            // Verify that updateBill was called with the correct bill object
            const expectedBill = {
                email: 'test@email.com',
                type: 'type1',
                name: 'Test Expense',
                amount: 123,
                date: '2023-05-30',
                vat: '20',
                pct: 20,
                commentary: 'Test commentary',
                fileUrl: 'http://example.com/test.jpeg',
                fileName: 'test.jpeg',
                status: 'pending',
            };

            // Simulate form submission
            fireEvent.submit(formNewBill)

            expect(newBill.updateBill).toHaveBeenCalled()
            expect(onNavigate).toHaveBeenCalledWith(ROUTES_PATH['Bills'])
            expect(newBill.updateBill).toHaveBeenCalledWith(expectedBill);
            // Verify that the user was redirected to the Bills page
            expect(onNavigate).toHaveBeenCalledWith(ROUTES_PATH['Bills']);
        })
    })
    describe("When I am on NewBill Page", () => {
        beforeEach(() => {
            // Simulating local storage to mock an Employee user.
            Object.defineProperty(window, 'localStorage', {value: localStorageMock})
            window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee'
            }))
        })
        afterEach(() => {
            // Resetting the local storage.
            window.localStorage.clear()
        })
        test("Then the new bill (mail) icon on the left hand side column should be highlighted", async () => {
            // Root is the container for the app.
            const root = document.createElement("div")
            root.setAttribute("id", "root")
            document.body.append(root)

            // Invoking the router function to call the listener on window.onNavigate(_path).
            // then navigating to Bills path
            // This will call newBillUI and append it to the root element.
            router()
            window.onNavigate(ROUTES_PATH.NewBill)

            // Accessing the 'icon-mail' element. which is visible on the left hand side of the page.
            await waitFor(() => screen.getByTestId('icon-mail'))
            const mailIcon = screen.getByTestId('icon-mail')

            expect(mailIcon.classList.contains('active-icon')).toBeTruthy()
        });

        test("Only JPG, PNG and JPEG file extensions should be accepted", () => {


            // Root is the container for the app.
            const root = document.createElement("div")
            root.setAttribute("id", "root")
            document.body.append(root)

            // Invoking the router function to call the listener on window.onNavigate(_path).
            // then navigating to Bills path
            // This will call newBillUI and append it to the root element.
            router()
            window.onNavigate(ROUTES_PATH.NewBill)


            const html = document.createElement('div');
            html.innerHTML = `
                <form data-testid="form-new-bill">
                <input data-testid="file" type="file" />
                </form>
            `;
            document.body.innerHTML = html.outerHTML;

            const onNavigate = jest.fn();
            const localStorage = window.localStorage;
            localStorage.setItem("user", JSON.stringify({type: 'Admin', email: 'test@test.fr'}))
            const firestore = null;
            const store = {
                bills: () => ({
                    list: () => Promise.resolve([]),
                    create: () => Promise.resolve(true)
                })
            };

            const newBill = new NewBill({
                document,
                onNavigate,
                store,
                localStorage
            });

            const handleChangeFile = jest.fn(newBill.handleChangeFile);
            const file = document.querySelector(`input[data-testid="file"]`);
            file.addEventListener('change', handleChangeFile);

            const jpgFile = new File(['content'], 'test.jpg', {type: 'image/jpg'});

            fireEvent.change(file, {
                target: {
                    files: [jpgFile],
                },
            });
            expect(handleChangeFile).toHaveBeenCalled();


            // const successMessage = document.querySelector('.file-type-info');
            const successMessage = screen.getByTestId("textElement");
            expect(successMessage.textContent).toBe('test.jpg uploaded successfully.');
            expect(successMessage.style.color).toBe('green');

            const pngFile = new File(['content'], 'test.png', {type: 'image/png'});

            fireEvent.change(file, {
                target: {
                    files: [pngFile],
                },
            });
            const successJpegMessage = screen.getByTestId("textElement")
            expect(successJpegMessage.textContent).toBe('test.png uploaded successfully.');
            expect(successJpegMessage.style.color).toBe('green');

            const pdfFile = new File(['content'], 'test.pdf', {type: 'application/pdf'});
            fireEvent.change(file, {
                target: {
                    files: [pdfFile],
                },
            });
            const errorMessage = screen.getByTestId("textElement")
            expect(errorMessage.textContent).toBe('This file is not supported, please upload a JPG, JPEG or PNG file.');
            expect(errorMessage.style.color).toBe('red');
        });
    })
})
