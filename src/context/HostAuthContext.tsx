"use client"

import { Host } from "@/types";
import { createAuthContext } from "./AuthContext";

const { Provider: HostAuthProvider, useAuth: useHostAuth } = createAuthContext<Host>({
    me: "/host/host-auth/me",
    login: "/host/host-auth/login",
    logout: "/host/host-auth/logout",
    loginRedirect: "/hosting",
});

export { HostAuthProvider, useHostAuth };