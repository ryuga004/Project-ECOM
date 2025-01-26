import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/hook";

export const LoggedRoute = () => {
    const User = useAppSelector((state) => state.user.user);
    return User && User.email ? <Outlet /> : <Navigate to="/login" replace />;
};

export const AdminRoute = () => {
    const User = useAppSelector((state) => state.user.user);
    return User && User.role === "admin" ? <Outlet /> : <Navigate to="/login" replace />;
};
