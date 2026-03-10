"use client"

import { Customer } from "@/types";
import { createAuthContext } from "./AuthContext";

const { Provider: CustomerAuthProvider, useAuth: useCustomerAuth } = createAuthContext<Customer>({
    me: "/user/profile",
    login: "/auth/customer/login",
    logout: "/auth/customer/logout",
    loginRedirect: "/dashboard",
});

export { CustomerAuthProvider, useCustomerAuth };