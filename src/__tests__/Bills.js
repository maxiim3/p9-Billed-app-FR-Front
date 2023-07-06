/**
 * @jest-environment jsdom
 */

import {fireEvent, screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import {bills} from "../fixtures/bills.js"
import {ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import {JSDOM} from "jsdom";
import Bills from "../containers/Bills.js";
import {formatDate, formatStatus} from "../app/format.js";
import router from "../app/Router.js";


// Mocking format.js module.
jest.mock("../app/format.js", () => ({
    formatDate: jest.fn((date) => `formatted_date_${date}`),
    formatStatus: jest.fn((status) => `formatted_status_${status}`),
}));

// Mock store object that mocks the bills and list methods.
const mockStore = {
    // Mock method that returns the mockStore itself for method chaining.
    bills: jest.fn().mockReturnThis(),

    // Mock method that returns a promise which resolves to the bills array.
    list: jest.fn().mockResolvedValueOnce(bills)
};

describe("Given I am connected as an employee", () => {
    describe("When I am on Bills Page", () => {
        test("Then bill icon in the left hand side column should be highlighted", async () => {

            // Simulating local storage to mock an Employee user.
            Object.defineProperty(window, 'localStorage', {value: localStorageMock})
            window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee'
            }))

            // Root is the container for the app.
            const root = document.createElement("div")
            root.setAttribute("id", "root")
            document.body.append(root)

            // Invoking the router function to call the listener on window.onNavigate(_path).
            // then navigating to Bills path
            // This will call BillsUI and append it to the root element.
            router()
            window.onNavigate(ROUTES_PATH.Bills)

            // Accessing the 'icon-window' element. which is visible on the left hand side of the page.
            await waitFor(() => screen.getByTestId('icon-window'))
            const windowIcon = screen.getByTestId('icon-window')

            expect(windowIcon.classList.contains('active-icon')).toBeTruthy()

        })

        test("Then bills should be ordered from earliest to latest", () => {
            // Set up: Render the BillsUI with provided bills data.
            document.body.innerHTML = BillsUI({data: bills})

            // Action: Get all bill dates on the screen,
            const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)

            const antiChrono = (a, b) => ((a < b) ? 1 : -1)
            const datesSorted = [...dates].sort(antiChrono)

            expect(dates).toEqual(datesSorted)
        })

        test("Then, when iconEye is clicked, handleClickIconEye should have been called", () => {
            // Creating a JSDOM element.
            const domElement = new JSDOM(`<!DOCTYPE html><div data-testid="icon-eye"></div>`);
            const {document} = domElement.window;

            // Mocking the onNavigate function and the store for the Bills instance.
            const onNavigate = jest.fn();
            const store = {bills: () => ({list: () => Promise.resolve([])})};

            // Using the real localStorage object from window for Bills instance.
            const localStorage = window.localStorage;

            // Creating an instance of Bills.
            const billsInstance = new Bills({
                document,
                onNavigate,
                store,
                localStorage
            });

            // Spying on the handleClickIconEye method of the billsInstance to see if it gets called later.
            const handleClickIconEyeSpy = jest.spyOn(billsInstance, 'handleClickIconEye');

            // Simulating a click event on the iconEye div element.
            const iconEye = document.querySelector('div[data-testid="icon-eye"]');
            fireEvent.click(iconEye);

            expect(handleClickIconEyeSpy).toHaveBeenCalled();
        });

        test("Then, when the New-Bill Button is clicked, it should redirect the user to New-Bill page", () => {

            // Creating a simple DOM structure with a button that has a 'data-testid' attribute.
            // This button will be used to simulate the 'click' event.
            const dom = new JSDOM(`<!DOCTYPE html><button data-testid="btn-new-bill"></button>`);
            const {document} = dom.window;

            // Mocking the onNavigate function and the store for the Bills instance.
            const onNavigate = jest.fn();
            const store = {bills: () => ({list: () => Promise.resolve([])})};

            // Using the real localStorage object from window for Bills instance.
            const localStorage = window.localStorage;

            // Creating an instance of Bills.
            const billsInstance = new Bills({
                document,
                onNavigate,
                store,
                localStorage
            });

            // Getting the button from the JSDOM document and clicking it.
            const newBillButton = document.querySelector('button[data-testid="btn-new-bill"]');
            newBillButton.click();

            expect(onNavigate).toHaveBeenCalledWith(ROUTES_PATH['NewBill']);
        });

        test("Then getBills should return a sorted list of formatted bills when store is defined", async () => {

            // Mock store object with methods bills and list
            const storeMock = {
                // Mock bills method returning the storeMock object itself to enable method chaining
                bills: jest.fn().mockReturnThis(),

                // Mock list method returning a promise that resolves to the bills array
                list: jest.fn().mockResolvedValueOnce(bills)
            }

            // Creating an instance of Bills class with mocked dependencies
            const billInstance = new Bills({
                document,
                onNavigate,
                firestore: null,
                localStorage: window.localStorage,
                onGetUserId: () => Promise.resolve('a1b2c3d4e5')
            })

            // Assigning the mocked store to the store property of the billInstance
            billInstance.store = storeMock

            // Calling the getBills method and storing the result
            const result = await billInstance.getBills()

            expect(storeMock.bills).toHaveBeenCalled()
            expect(storeMock.list).toHaveBeenCalled()

            expect(formatDate).toHaveBeenCalledTimes(bills.length)
            expect(formatStatus).toHaveBeenCalledTimes(bills.length)

            result.forEach((bill, i) => {
                expect(bill.date).toBe(`formatted_date_${bills[i].date}`)
                expect(bill.status).toBe(`formatted_status_${bills[i].status}`)
            })
        })

        test("Then getBills should return undefined when store is undefined", async () => {
            // Initializing an instance of the Bills class without a defined store.
            // The onGetUserId function is mocked to return a resolved promise with a specific user ID.
            const billInstance = new Bills({
                document, onNavigate, firestore: null, localStorage: window.localStorage,
                onGetUserId: () => Promise.resolve('a1b2c3d4e5')
            })

            // Attempting to get bills from the undefined store.
            const result = await billInstance.getBills()

            expect(result).toBeUndefined()
        })

    });
    // Integration test for getBills
    describe("When getBills is called", () => {

        beforeEach(() => {

            // Spy on the bills method of the mockStore
            jest.spyOn(mockStore, "bills")

            // Setup local storage for a logged-in Employee user
            Object.defineProperty(
                window,
                'localStorage',
                {value: localStorageMock}
            )
            window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee',
                email: "a@a"
            }))

            // Setup a root container for the app and attach to the document body
            const root = document.createElement("div")
            root.setAttribute("id", "root")
            document.body.appendChild(root)

            // Initialize the app router
            router()
        })

        test("It should correctly handle a 404 error from the API", async () => {


            // Mock the bills method of mockStore to return a Promise that rejects with an error
            mockStore.bills.mockImplementationOnce(() => {

                return {

                    list: () => {
                        return Promise.reject(new Error("Erreur 404"))
                    }
                }
            })

            // Create a new instance of Bills
            const billInstance = new Bills({

                document, onNavigate, firestore: null, localStorage: window.localStorage,
                onGetUserId: () => Promise.resolve('a1b2c3d4e5')
            })

            // Assign the mocked store to the Bills instance
            billInstance.store = mockStore

            // Try to get the bills and assert that the error message is "Erreur 404"
            try {
                await billInstance.getBills()
            } catch (e) {
                expect(e.message).toBe("Erreur 404")
            }

            expect(mockStore.bills).toHaveBeenCalled()
        })

        test("It should correctly handle a 500 error from the API", async () => {


            // Mock the bills method of mockStore to return a Promise that rejects with an error
            mockStore.bills.mockImplementationOnce(() => {

                return {
                    list: () => {
                        return Promise.reject(new Error("Erreur 500"))
                    }
                }
            })

            // Create a new instance of Bills
            const billInstance = new Bills({
                document, onNavigate, firestore: null, localStorage: window.localStorage,
                onGetUserId: () => Promise.resolve('a1b2c3d4e5')
            })

            // Assign the mocked store to the Bills instance
            billInstance.store = mockStore

            // Try to get the bills and assert that the error message is "Erreur 500"
            try {
                await billInstance.getBills()
            } catch (e) {
                expect(e.message).toBe("Erreur 500")
            }

            expect(mockStore.bills).toHaveBeenCalled()
        })

    })
})
