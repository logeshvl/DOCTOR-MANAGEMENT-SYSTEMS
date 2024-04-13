import { Navigate } from "react-router-dom";
import { CookiesStorage } from "./utils/storage";

const PrivateRoute = ({ children }) => {
    let authUser = CookiesStorage.getItem("token");
    if (!authUser) {
        // not logged in so redirect to login page with the return url
        return <Navigate to="/login" />
    }

    // authorized so return child components
    return children;
}
export default PrivateRoute;