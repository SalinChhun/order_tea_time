import axios from "axios";

export const http = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

http.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const response = error?.response
        const data = response?.data
        if(!response){
            return Promise.reject(error);
        } else if (response.status >= 400) {
            const errorMessage = (data && data?.message) || response.statusText || data?.status?.message;

            return Promise.reject({
                message: errorMessage,
                status: response.status
            });
        }
    },
);
