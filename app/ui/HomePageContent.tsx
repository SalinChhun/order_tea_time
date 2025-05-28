'use client';

import {useEffect, useState} from 'react';
import {useSearchParams} from 'next/navigation';

interface TelegramUser {
    id: string;
    firstName: string;
    lastName?: string;
    username?: string;
    chatId: string;
}

interface SessionData {
    success: boolean;
    user: TelegramUser;
    sessionId: string;
}

export default function HomePageContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session');

    const [user, setUser] = useState<TelegramUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (sessionId) {
            console.log(`Fetching session data for session ID: ${sessionId}`);
            // Simulate fetching session data (replace with actual API call)
            // Example:
            // fetch(`/api/session?sessionId=${sessionId}`)
            //   .then(res => res.json())
            //   .then(data => {
            //     setUser(data.user);
            //     setLoading(false);
            //   })
            //   .catch(() => {
            //     setError('Failed to fetch session data.');
            //     setLoading(false);
            //   });
            setLoading(false); // Remove this when adding actual fetch logic
        } else {
            setLoading(false);
            setError('No session found. Please start from Telegram bot.');
        }
    }, [sessionId]);

    if (loading) {
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
                  {user.firstName} {user.lastName}
                </span>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-2xl font-bold mb-6">Our Menu</h2>

                    {/* Sample menu items */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <MenuItemCard
                            name="Green Tea"
                            price="$3.50"
                            description="Premium green tea with antioxidants"
                            image="🍵"
                        />
                        <MenuItemCard
                            name="Earl Grey"
                            price="$4.00"
                            description="Classic black tea with bergamot"
                            image="☕"
                        />
                        <MenuItemCard
                            name="Bubble Tea"
                            price="$5.50"
                            description="Taiwan-style milk tea with tapioca pearls"
                            image="🧋"
                        />
                    </div>

                    {/* Order button */}
                    <div className="mt-8 text-center">
                        <button
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition duration-200">
                            Complete Order
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

function MenuItemCard({name, price, description, image}: {
    name: string;
    price: string;
    description: string;
    image: string
}) {
    return (
        <div className="border rounded-lg p-4 hover:shadow-md transition duration-200">
            <div className="text-4xl mb-3">{image}</div>
            <h3 className="font-semibold text-lg mb-2">{name}</h3>
            <p className="text-gray-600 text-sm mb-3">{description}</p>
            <div className="flex items-center justify-between">
                <span className="font-bold text-blue-600">{price}</span>
                <button
                    className="bg-blue-100 hover:bg-blue-200 text-blue-600 px-3 py-1 rounded text-sm transition duration-200">
                    Add to Cart
                </button>
            </div>
        </div>
    );
}