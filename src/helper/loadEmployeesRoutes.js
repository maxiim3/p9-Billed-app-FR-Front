import router from "../app/Router.js";

/**
 * # Load Employees Routes
 * @description Load the Employees Routes by creating a root div and appending it to the body. It calls the router function and then the window.onNavigate function.
 * @param path
 * @return {Promise<void>}
 * @example
 * await loadEmployeesRoutes(ROUTES_PATH.Bills)
 * @requires router
 * @requires window.onNavigate
 */
export async function loadEmployeesRoutes(path) {
    const root = document.createElement("div")
    root.setAttribute("id", "root")
    document.body.append(root)

    router()
    window.onNavigate(path)
}
