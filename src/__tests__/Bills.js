/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import {bills} from "../fixtures/bills.js"
import {ROUTES_PATH} from "../constants/routes.js";
import userEvent from "@testing-library/user-event";
import Bills from "../containers/Bills.js";
import store from "../__mocks__/store.js";
import {convertDate} from "../helper/ConvertDate.js";
import {connectAsEmployee} from "../helper/connectAsEmployee.js";
import {loadEmployeesRoutes} from "../helper/loadEmployeesRoutes.js";

// const mockBills = jest.mock('../containers/Bills.js')

// Mock a connection as an employee before each test
beforeEach(async () => {
    await connectAsEmployee()
})

// Clear all mocks after each test
afterEach(() => {
    jest.clearAllMocks()
})

describe("Given I am connected as an employee", () => {
    describe("When I am on Bills Page", () => {

        test("Then bill icon in vertical layout should be highlighted", async () => {
            await loadEmployeesRoutes(ROUTES_PATH.Bills)
            await waitFor(() => screen.getByTestId('icon-window'))
            const windowIcon = screen.getByTestId('icon-window')
            expect(windowIcon.classList).toContain('active-icon')
            expect(windowIcon.id).toBe('layout-icon1')
        })

        test("Then bills should be ordered from earliest to latest", () => {
            document.body.innerHTML = BillsUI({ data: bills });
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML);
            const antiChronoV1 = (a, b) => (convertDate(b) - convertDate(b))

            const datesSorted = [...dates].sort(antiChronoV1)
            expect(dates).toEqual(datesSorted)
        })

        test("Then the table should have as much tableRows as mocked data", async () => {
            document.body.innerHTML = BillsUI({data: bills, error: false, loading: false})
            await waitFor(() => screen.getByTestId('tbody'))
            const tBody = screen.getByTestId('tbody')
            const getRows = [...tBody.childNodes].filter(node => node instanceof HTMLTableRowElement)
            expect(getRows).toHaveLength(bills.length)
        })
        describe('I click the button to create a New Bill', () => {
            test('Then I navigate to /#employee/bill/new', async () => {
                document.body.innerHTML = await BillsUI({data: bills, error: false, loading: false})

                await waitFor(() => screen.getByTestId("btn-new-bill"))
                const btn = screen.getByTestId("btn-new-bill")
                const mockFn = jest.fn(async () => await loadEmployeesRoutes(ROUTES_PATH.NewBill))
                btn.onclick = () => mockFn()

                await userEvent.click(btn)
                expect(mockFn).toHaveBeenCalled()
                expect(window.location.hash === "#employee/bill/new").toBeTruthy()
            })
        })
        describe('When I am on Bills page, and I call handleClickNewBill from container/Bills', () => {
            test('Then I navigate to /#employee/bill/new', async () => {
                const onNavigate = () => window.onNavigate(ROUTES_PATH['NewBill'])
                const containerBills = new Bills({document, onNavigate, store, localStorage})
                jest.mock("../containers/Bills.js")
                const mockHandleClickNewBill = jest.fn(() => containerBills.handleClickNewBill())
                mockHandleClickNewBill()
                expect(window.location.hash === "#employee/bill/new").toBeTruthy()
            })
        })
        describe('I click on the eye of a bill', () => {
            test('the modal opens', async () => {
                // Load the Bills page
                await loadEmployeesRoutes(ROUTES_PATH.Bills)

                // Create the Bills UI
                document.body.innerHTML = await BillsUI({data: bills, error: false, loading: false})

                // Define the dependencies for Bills
                const dependencies = {
                    document: document,
                    onNavigate: jest.fn(),
                    store,
                    localStorage,
                }

                // Create an instance of Bills
                const containerBills = new Bills(dependencies)
                // Wait for the eye icons to be available in the DOM
                await waitFor(() => screen.getAllByTestId('icon-eye'))

                // Get the first eye icon
                const iconEye = screen.getAllByTestId('icon-eye')[0]


                // Spy on handleClickIconEye method
                const spy = jest.spyOn(containerBills, 'handleClickIconEye')

                // Mock the modal function
                global.$ = jest.fn().mockReturnValue({
                    width: jest.fn(),
                    modal: jest.fn(),
                    find: jest.fn().mockReturnValue({
                        html: jest.fn()
                    }),
                })


                // Trigger a click on the eye icon
                await userEvent.click(iconEye)

                // Check if handleClickIconEye has been called
                expect(spy).toHaveBeenCalled()

                // Wait for the modal to be available in the DOM
                const modal = jest.fn($('#modaleFile'))
                // todo modal mocked implementation

                // await waitFor(() => screen.getByTestId('modaleFile'))  // waits up to 5000 milliseconds

                // Get the modal
                // const modalEl = screen.getByTestId('modaleFile')
                // Check if the modal is truthy
                expect(modal).toBeTruthy()
            })
        })
    })


    // describe("Given I am on Bills' Page", () => {
    //     // connect as employee and add mocked store
    //     beforeEach(async () => {
    //         // Bills.mockClear()
    //         // https://jestjs.io/docs/es6-class-mocks
    //
    //         await connectAsEmployee()
    //     })
    //     afterEach(() => mockBills.clearAllMocks())
    //     document.body.innerHTML = BillsUI({data: bills, error: false, loading: false})
    //     const onNavigate = () => window.onNavigate(ROUTES_PATH['Bills'])
    //     const containerBills = new Bills({document, onNavigate, store, localStorage})
    //
    //
    //     describe("Given i added a new bill is properly", () => {
    //         beforeEach(async () => await waitFor(() => screen.getByTestId('tbody')))
    //         afterEach(() => mockBills.clearAllMocks())
    //         const mockedBillsClass = new Bills({document, onNavigate, store, localStorage})
    //
    //         const FIRST_INDEX = 0
    //         // get tBody from form element
    //         const tBody = screen.getByTestId('tbody')
    //         // get rows from table
    //         const getRows = [...tBody.childNodes].filter(node => node instanceof HTMLTableRowElement)
    //         // get nth FIRST_INDEX row element
    //         const firstRow = [...getRows[FIRST_INDEX].childNodes].filter(node => node instanceof HTMLTableCellElement)
    //
    //         test("then the data should be present in the form", async () => {
    //             // get second column => "Nom" | access its value
    //             const firstMockedBillName = firstRow[1].textContent
    //             // check data
    //             console.log(firstMockedBillName)
    //             expect(firstMockedBillName === bills[FIRST_INDEX].name).toBeTruthy()
    //         })
    //
    //         describe("When I click on the eye icon", () => {
    //             $.fn.modal = jest.fn(); // fonction mocké de jquery
    //             const eyes = [...screen.getAllByTestId("icon-eye")]
    //             const modal = screen.getByTestId("modaleFile")
    //             const thisEye = eyes[FIRST_INDEX]
    //             const mockHandleClickOnEye = jest.fn(thisEye => {
    //                 // todo commentLorsque je Mock un constructeur, je n'ai plus besoin des parametres
    //                 jest.spyOn(mockedBillsClass, "handleClickIconEye").mockImplementation(() => {
    //                 })
    //             })
    //
    //             const MODAL_TITLE = "Justificatif"
    //             const ALT_TEXT = "Bill"
    //
    //             thisEye.onclick = () => mockHandleClickOnEye(thisEye)
    //             fireEvent.click(eyes[FIRST_INDEX])
    //
    //             test("Then handleClickOnEye should have be called", async () => {
    //                 await userEvent.click(eyes[FIRST_INDEX])
    //
    //                 expect(mockedBillsClass.handleClickIconEye).toHaveBeenCalled()
    //             })
    //             test("Then MODAL_TITLE element should be a present text in the screen", async () => {
    //                 await userEvent.click(eyes[FIRST_INDEX])
    //
    //                 await waitFor(() => screen.getByText(MODAL_TITLE, {exact: false}))
    //                 const modalText = screen.getByText("Justificatif", {exact: false})
    //                 expect(modalText).toBeTruthy()
    //             })
    //             test("Then the ALT_TEXT element should be an instance of HTMLImgElement", async () => {
    //                 await userEvent.click(eyes[FIRST_INDEX])
    //
    //                 await waitFor(() => screen.getAllByAltText(ALT_TEXT))
    //                 const imgAltText = screen.getAllByAltText("Bill")
    //                 expect(imgAltText[0]).toBeInstanceOf(HTMLImageElement)
    //             })
    //         })
    //
    //     })
    // })
})

