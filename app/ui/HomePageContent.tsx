'use client';

import {useEffect, useState} from 'react';
import {useSearchParams} from 'next/navigation';
import useUserMutation from "@/lib/hooks/useUserMutation";

export default function HomePageContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!sessionId) {
            setError('No session found. Please start from Telegram bot.');
        } else {
            setError(null);
        }
    }, [sessionId]);

    const {user, isLoading} = useUserMutation.useFetchUserByUsername(sessionId);
    console.log('user -> ', user);

    // Use React Query's loading state instead of local state
    if (isLoading && sessionId) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p>Loading your session...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-6">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-xl font-semibold mb-2">Session Error</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <p className="text-sm text-gray-500">
                        Please go back to the Telegram bot and click the "កម្មង់ | Order" button again.
                    </p>
                </div>
            </div>
        );
    }

    // Show error if session exists but no user found
    if (sessionId && !isLoading && !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-6">
                    <div className="text-orange-500 text-6xl mb-4">👤</div>
                    <h2 className="text-xl font-semibold mb-2">User Not Found</h2>
                    <p className="text-gray-600 mb-4">
                        Could not find user with session ID: {sessionId}
                    </p>
                    <p className="text-sm text-gray-500">
                        Please try again from the Telegram bot.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header with user info */}
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-semibold text-gray-900">🍵 Teatime Menu</h1>
                        </div>
                        {user && (
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">Welcome,</span>
                                <span className="text-sm font-medium text-gray-900">
                                    {user.name || user.username}
                                </span>
                                <span className="text-xs text-gray-500">
                                    (@{user.username})
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* User info section */}
            {user && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-medium text-blue-900">
                                    Hello, {user.name || user.username}! 👋
                                </h3>
                                <p className="text-sm text-blue-700">
                                    Username: @{user.username} •
                                    Member since: {new Date(user.createdAt).toLocaleDateString()}
                                </p>
                                <div className="mt-2 text-xs text-blue-600 bg-blue-100 inline-block px-2 py-1 rounded">
                                    Session ID: {sessionId}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}