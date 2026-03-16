"use client"

import { Host } from "@/types";
import { createAuthContext } from "./AuthContext";

const { Provider: HostAuthProvider, useAuth: useHostAuth } = createAuthContext<Host>({
    me: "/host/profile",
    login: "/auth/host/login",
    logout: "/auth/host/logout",
    logoutRedirect: "/hosting/login",
    loginRedirect: "/hosting",
});

export { HostAuthProvider, useHostAuth };