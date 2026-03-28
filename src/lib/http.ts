import axios, {
    AxiosError,
    AxiosInstance,
    CreateAxiosDefaults,
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from "axios";

const API_HOST = process.env.NEXT_PUBLIC_API_URL;

type AuthScope = "customer" | "host";

type AuthRouteConfig = {
    refreshEndpoint: string;
    loginRedirect: string;
};

type RefreshState = {
    isRefreshing: boolean;
    failedRequestsQueue: Array<{
        resolve: () => void;
        reject: (error: Error) => void;
    }>;
};

const AUTH_ROUTES: Record<AuthScope, AuthRouteConfig> = {
    customer: {
        refreshEndpoint: "/auth/customer/refresh",
        loginRedirect: "/customer/login",
    },
    host: {
        refreshEndpoint: "/auth/host/refresh",
        loginRedirect: "/hosting/login",
    },
};

const refreshStateByScope: Record<AuthScope, RefreshState> = {
    customer: { isRefreshing: false, failedRequestsQueue: [] },
    host: { isRefreshing: false, failedRequestsQueue: [] },
};

function getApiUrl(path: string) {
    const base = API_HOST ?? "";
    const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${normalizedBase}${normalizedPath}`;
}

function resolveAuthScopeFromPath(): AuthScope {
    if (typeof window === "undefined") return "customer";
    const path = window.location.pathname.toLowerCase();
    if (path.startsWith("/hosting")) {
        return "host";
    }
    return "customer";
}

function getBaseAxiosConfig(): CreateAxiosDefaults {
    return {
        baseURL: API_HOST,
        timeout: 10000,
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
        },
    };
}

/**
 * Process queued requests after successful token refresh
 */
const processQueue = (scope: AuthScope, error: Error | null) => {
    const state = refreshStateByScope[scope];
    state.failedRequestsQueue.forEach((promise) => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve();
        }
    });
    state.failedRequestsQueue = [];
};

/**
 * Axios instance with JWT authentication and token refresh
 * Uses HTTP-only cookies for secure token storage
 */
const axiosJWTInstance: AxiosInstance = axios.create({
    ...getBaseAxiosConfig(),
});

/**
 * Request Interceptor
 * Logs outgoing requests in development
 */
axiosJWTInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Log request in development
        if (process.env.NODE_ENV === "development") {
            console.log(
                `[Request] ${config.method?.toUpperCase()} ${config.url}`,
            );
        }

        // You can add custom headers here if needed
        // For example, if using Authorization header instead of cookies:
        // const token = localStorage.getItem('accessToken');
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }

        return config;
    },
    (error: AxiosError) => {
        console.error("[Request Error]", error.message);
        return Promise.reject(error);
    },
);

/**
 * Response Interceptor
 * Handles token refresh on 401 errors
 */
axiosJWTInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        // Log successful response in development
        if (process.env.NODE_ENV === "development") {
            console.log(
                `[Response] ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`,
            );
        }
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & {
            _retry?: boolean;
        };

        // Log error in development
        if (process.env.NODE_ENV === "development") {
            console.error(
                `[Response Error] ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url} - ${error.response?.status}`,
                error.response?.data,
            );
        }

        // Handle 401 Unauthorized - Token expired
        if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest._retry
        ) {
            const authScope = resolveAuthScopeFromPath();
            const authRoute = AUTH_ROUTES[authScope];
            const refreshState = refreshStateByScope[authScope];

            // Check if this request should skip auth redirect
            const skipRedirect = originalRequest.skipAuthRedirect === true;

            if (refreshState.isRefreshing) {
                // If refresh is already in progress, queue this request
                return new Promise((resolve, reject) => {
                    refreshState.failedRequestsQueue.push({
                        resolve: () => {
                            resolve(axiosJWTInstance(originalRequest));
                        },
                        reject: (err: Error) => {
                            reject(err);
                        },
                    });
                });
            }

            originalRequest._retry = true;
            refreshState.isRefreshing = true;

            try {
                // Attempt to refresh the token
                await axios.get(getApiUrl(authRoute.refreshEndpoint), {
                    withCredentials: true,
                    timeout: 5000,
                });

                // Token refresh successful - process queued requests
                processQueue(authScope, null);
                refreshState.isRefreshing = false;

                // Retry the original request
                return axiosJWTInstance(originalRequest);
            } catch (refreshError) {
                // Token refresh failed
                processQueue(authScope, new Error("Token refresh failed"));
                refreshState.isRefreshing = false;

                console.error("[Token Refresh Failed]", refreshError);

                // Redirect to login unless skipRedirect is true
                if (!skipRedirect && typeof window !== "undefined") {
                    // Clear any stored auth data
                    localStorage.clear();
                    sessionStorage.clear();

                    // Redirect to login page
                    window.location.href = authRoute.loginRedirect;
                }

                return Promise.reject(refreshError);
            }
        }

        // Handle other error status codes
        if (error.response) {
            switch (error.response.status) {
                case 403:
                    console.error(
                        "[Forbidden] You don't have permission to access this resource",
                    );
                    break;
                case 404:
                    console.error(
                        "[Not Found] The requested resource was not found",
                    );
                    break;
                case 500:
                    console.error(
                        "[Server Error] Internal server error occurred",
                    );
                    break;
                case 503:
                    console.error(
                        "[Service Unavailable] The server is temporarily unavailable",
                    );
                    break;
            }
        } else if (error.request) {
            // Request was made but no response received
            console.error("[Network Error] No response received from server");
        } else {
            // Something happened in setting up the request
            console.error("[Request Setup Error]", error.message);
        }

        return Promise.reject(error);
    },
);

/**
 * Basic axios instance without JWT authentication
 * Use for public endpoints (login, register, etc.)
 */
const axiosInstance: AxiosInstance = axios.create({
    ...getBaseAxiosConfig(),
});

/**
 * Request Interceptor for basic instance
 */
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        if (process.env.NODE_ENV === "development") {
            console.log(
                `[Public Request] ${config.method?.toUpperCase()} ${config.url}`,
            );
        }
        return config;
    },
    (error: AxiosError) => {
        console.error("[Public Request Error]", error.message);
        return Promise.reject(error);
    },
);

/**
 * Response Interceptor for basic instance
 */
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
        if (process.env.NODE_ENV === "development") {
            console.log(
                `[Public Response] ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`,
            );
        }
        return response;
    },
    (error: AxiosError) => {
        if (process.env.NODE_ENV === "development") {
            console.error(
                `[Public Response Error]`,
                error.response?.status,
                error.response?.data,
            );
        }
        return Promise.reject(error);
    },
);

export { axiosJWTInstance, axiosInstance };
