import React from 'react';
import { Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';


interface ProtectedRouteProps {
    children: React.ReactNode;
    roles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Decode JWT to get user role
    const payload = jwtDecode(token);

    //console.log(payload);
    // @ts-ignore
    const userRole: any = payload['role'];

    if (!roles.includes(userRole)) {
        // If the user's role is not in the allowed roles, redirect to an unauthorized page
        return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;