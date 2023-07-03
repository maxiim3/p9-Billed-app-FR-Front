import {localStorageMock} from "../__mocks__/localStorage.js";

/**
 * # Connect As Employee
 * @description Connect as an employee by setting the user in the localStorage.
 * @example
 * await connectAsEmployee()
 * @requires localStorageMock
 * @requires localStorage
 * @return {Promise<void>}
 */
export async function connectAsEmployee() {
    // console.log("connected") // debug
    Object.defineProperty(window, 'localStorage', {value: localStorageMock})
    window.localStorage.setItem('user', JSON.stringify({
        type: "Employee",
        email: "employee@test.tld",
        status: "connected",
    }))
}
