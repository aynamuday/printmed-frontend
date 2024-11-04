import React from "react";
import AppContext from "./context/AppContext";
import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";

function ProtectedRoute() {
    const { user } = useContext(AppContext)

    return user ? <Outlet/> : < Navigate to='login' />
}

export default ProtectedRoute;