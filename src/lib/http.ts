import axios, {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from "axios";

const API_HOST = process.env.NEXT_PUBLIC_API_URL;

// Track if a token refresh is in progress
let isRefreshing = false;
// Queue of requests waiting for token refresh
let failedRequestsQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: Error) => void;
}> = [];

/**
 * Process queued requests after successful token refresh
 */
const processQueue = (error: Error | null) => {
    failedRequestsQueue.forEach((promise) => {
        if (error) {
            promise.reject(error);
        } else {
            promise.resolve("");
        }
    });
    failedRequestsQueue = [];
};

/**
 * Axios instance with JWT authentication and token refresh
 * Uses HTTP-only cookies for secure token storage
 */
const axiosJWTInstance: AxiosInstance = axios.create({
    baseURL: API_HOST,
    timeout: 10000, // 10 seconds timeout
    withCredentials: true, // Send cookies with requests
    headers: {
        "Content-Type": "application/json",
    },
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
            // Check if this request should skip auth redirect
            const skipRedirect = originalRequest.skipAuthRedirect === true;

            if (isRefreshing) {
                // If refresh is already in progress, queue this request
                return new Promise((resolve, reject) => {
                    failedRequestsQueue.push({
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
            isRefreshing = true;

            try {
                // Attempt to refresh the token
                await axios.get(`${API_HOST}auth/customer/refresh`, {
                    withCredentials: true,
                    timeout: 5000,
                });

                // Token refresh successful - process queued requests
                processQueue(null);
                isRefreshing = false;

                // Retry the original request
                return axiosJWTInstance(originalRequest);
            } catch (refreshError) {
                // Token refresh failed
                processQueue(new Error("Token refresh failed"));
                isRefreshing = false;

                console.error("[Token Refresh Failed]", refreshError);

                // Redirect to login unless skipRedirect is true
                if (!skipRedirect && typeof window !== "undefined") {
                    // Clear any stored auth data
                    localStorage.clear();
                    sessionStorage.clear();

                    // Redirect to login page
                    window.location.href = "/login";
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
    baseURL: API_HOST,
    timeout: 10000,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
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
