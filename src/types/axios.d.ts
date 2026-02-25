import "axios";

declare module "axios" {
    export interface AxiosRequestConfig {
        /**
         * Skip automatic redirect to login page on 401 errors
         * Useful for auth check endpoints where you don't want to redirect
         */
        skipAuthRedirect?: boolean;

        /**
         * Internal flag to prevent infinite retry loops
         * Set automatically by the interceptor
         */
        _retry?: boolean;
    }

    export interface AxiosResponse<T = any> {
        data: T;
        status: number;
        statusText: string;
        headers: any;
        config: AxiosRequestConfig;
        request?: any;
    }
}
