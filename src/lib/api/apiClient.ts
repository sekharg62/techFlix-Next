import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from "axios";

// Determine base API URL from environment variable or default relative path
const getBaseURL = (): string => {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BASE_URL || "";
  }
  return process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_BASE_URL || "http://localhost:3000";
};

const apiClient: AxiosInstance = axios.create({
  baseURL: getBaseURL(),
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError<{ message?: string; success?: boolean }>) => {
    const customError = {
      status: error.response?.status,
      message: error.response?.data?.message || error.message || "An unexpected error occurred",
      data: error.response?.data,
    };
    return Promise.reject(customError);
  }
);

export default apiClient;
