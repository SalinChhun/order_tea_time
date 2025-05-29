'use client'
import {PropsWithChildren, useEffect} from "react";
import "@/globals.css";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import toast, {Toaster, useToasterStore} from "react-hot-toast";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            refetchOnWindowFocus: false
        }
    }
});

export default function HomeLayout({children}: PropsWithChildren) {
    const {toasts} = useToasterStore();
    useEffect(() => {
        toasts
            .filter((t) => t.visible) // Only consider visible toasts
            .filter((_, i) => i >= 1) // Is toast index over limit
            .forEach((t) => toast.dismiss(t.id)); // Dismiss – Use toast.remove(t.id) removal without animation
    }, [toasts]);
    return (
        <>
            <Toaster
                position="top-right"
                reverseOrder={false}
                containerStyle={{
                    zIndex: 99999
                }}
                toastOptions={{
                    style: {
                        pointerEvents: 'none'
                    }
                }}/>
            <QueryClientProvider client={queryClient}>
                <div className="home-container">
                    {children}
                </div>
            </QueryClientProvider>
        </>
    );

};