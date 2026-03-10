"use client"

import { Customer } from "@/types";
import { createAuthContext } from "./AuthContext";

const { Provider: CustomerAuthProvider, useAuth: useCustomerAuth } = createAuthContext<Customer>({
    me: "/auth/customer-auth/me",
    login: "/auth/customer-auth/login",
    logout: "/auth/customer-auth/logout",
    loginRedirect: "/dashboard",
});

export { CustomerAuthProvider, useCustomerAuth };