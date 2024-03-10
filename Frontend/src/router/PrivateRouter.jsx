import { useLocation, Navigate } from "react-router-dom"

export const PrivateRouter = ({ children }) => {

    const { state } = useLocation();    

    return state?.logged ? children : <Navigate to="/login" />;
}