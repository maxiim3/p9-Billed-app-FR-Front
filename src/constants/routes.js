import LoginUI from "../views/LoginUI.js"
import BillsUI from "../views/BillsUI.js"
import NewBillUI from "../views/NewBillUI.js"
import DashboardUI from "../views/DashboardUI.js"

// Define the paths for each route
export const ROUTES_PATH = {
  Login: '/',
  Bills: '#employee/bills',
  NewBill : '#employee/bill/new',
  Dashboard: '#admin/dashboard'
}
/**
 * A function that maps pathnames to UI components.
 * If the pathname is unrecognized, it defaults to the LoginUI.
 * @param {Object} options - The options for the UI components
 * @param {string} options.pathname - The current path
 * @param {Object} options.data - The data to pass to the UI component
 * @param {Error} options.error - Any errors to pass to the UI component
 * @param {boolean} options.loading - Whether the UI component should show a loading state
 * @returns {JSX.Element} The UI component associated with the path
 */
export const ROUTES = ({ pathname, data, error, loading }) => {
  switch (pathname) {
    case ROUTES_PATH['Login']:
      return LoginUI({ data, error, loading })
    case ROUTES_PATH['Bills']:
      return BillsUI({ data, error, loading })
    case ROUTES_PATH['NewBill']:
      return NewBillUI()
    case ROUTES_PATH['Dashboard']:
      return DashboardUI({ data, error, loading })
    default:
      return LoginUI({ data, error, loading })
  }
}

