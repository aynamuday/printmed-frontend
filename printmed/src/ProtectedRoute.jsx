import React, { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import AppContext from "./context/AppContext";

function ProtectedRoute() {
    const { user } = useContext(AppContext)

    return user ? <Outlet/> : < Navigate to='login' />
}

export default ProtectedRoute;