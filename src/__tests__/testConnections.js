import {localStorageMock} from "../__mocks__/localStorage.js";
import {connectAsAdmin} from "../helper/connectAsAdmin.js";
import {connectAsEmployee} from "../helper/connectAsEmployee.js";

// Grouping the tests
describe('connectAsAdmin', () => {
    // Runs before each test to mock window.localStorage.setItem
    beforeEach(() => {
        Object.defineProperty(window, 'localStorage', {value: localStorageMock});
        // spy on to mock setItem
        jest.spyOn(window.localStorage, 'setItem')
    })
    // clean up the mocks after each test.
    afterEach(() => {
        window.localStorage.setItem.mockRestore()
    })


    it('should set user as Admin in local storage', async () => {
        // run the tested function
        await connectAsAdmin()

        // check that localStorage.setItem has been called with the proper parameters
        expect(window.localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify({type: "Admin"}))
    })
    it('should set user as Employee in local storage', async () => {
        // run the tested function
        await connectAsEmployee();

        // check that localStorage.setItem has been called with the proper parameters
        expect(window.localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify({type: "Employee"}));
    });
})
