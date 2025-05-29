'use client'
import {PropsWithChildren} from "react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            refetchOnWindowFocus: false
        }
    }
});

export default function HomeLayout({children}: PropsWithChildren) {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="home-container">
                {children}
            </div>
        </QueryClientProvider>
    );

};