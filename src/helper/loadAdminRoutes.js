import router from "../app/Router.js";
import {connectAsAdmin} from "./connectAsAdmin.js";

export async function loadAdminRoutes(path) {
    await connectAsAdmin()
    const root = document.createElement("div")
    root.setAttribute("id", "root")
    document.body.append(root)

    router()
    window.onNavigate(path)
}
