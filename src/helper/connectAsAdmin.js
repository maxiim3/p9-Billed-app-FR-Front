import {localStorageMock} from "../__mocks__/localStorage.js";

export async function connectAsAdmin() {
    Object.defineProperty(window, 'localStorage', {value: localStorageMock})
    window.localStorage.setItem('user', JSON.stringify({type: "Admin"}))
}
