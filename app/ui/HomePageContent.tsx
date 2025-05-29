'use client';
import {useEffect, useState} from 'react';
import {useSearchParams} from 'next/navigation';
import {Coffee, Edit, Plus, Save, Trash2} from "lucide-react"
import {Dialog, DialogContent, DialogTitle} from "@radix-ui/react-dialog";
import {DialogHeader} from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";
import {Avatar, AvatarFallback, AvatarImage} from "@radix-ui/react-avatar";
import CreateOrder from "@/app/ui/CreateOrder";
import useOrderMutation from "@/lib/hooks/use-order-mutation";
import {getIceText, getSugarText} from "@/utils/utils";

export default function HomePageContent() {

    const [isOrderOpen, setIsOrderOpen] = useState(false)

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

    // const {user, isLoading} = useUserMutation.useFetchUserByUsername(sessionId);

    const {orders, isLoading} = useOrderMutation.useFetchOrder();
    console.log('orders', orders);

    // Use React Query's loading state instead of local state
    if (isLoading && sessionId) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
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
    if (sessionId && !isLoading && !orders) {
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
        <>

            {/* Modern Header with Glassmorphism */}

            {/* Orders List */}
            <div className="px-4 py-6 space-y-4 pb-32">
                {orders.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <Coffee className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                        <p className="text-gray-500 mb-8">Start by adding your first order</p>
                        <button
                            onClick={() => setIsOrderOpen(true)}
                            className="inline-flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-teal-700 transition-colors shadow-lg"
                        >
                            <Plus className="w-5 h-5" />
                            Add Order
                        </button>
                    </div>
                ) : (
                    orders.map((order:any, index:number) => (
                        <div
                            key={order.id}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="p-5">
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <div
                                                className="w-8 h-8 bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg flex items-center justify-center">
                                                <span className="text-white text-sm font-bold">
                                                    {order?.user?.name?.charAt(0) || "U"}
                                                </span>
                                            </div>
                                            <h3 className="font-semibold text-gray-900">{order?.user?.name || "Unknown User"}</h3>
                                        </div>
                                        <p className="text-teal-600 font-medium text-lg">{order?.menuItem?.name || "No item"}</p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-1">
                                        <button
                                            className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-teal-100 hover:text-teal-600 transition-colors"
                                        >
                                            <Edit className="w-4 h-4"/>
                                        </button>
                                        <button
                                            className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-red-100 hover:text-red-600 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4"/>
                                        </button>
                                    </div>
                                </div>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {/* Sugar Level */}
                                    {order.sugarLevel && (
                                        <div
                                            className="px-3 py-1 text-sm rounded-full bg-amber-100 text-amber-700 border border-amber-200 flex items-center">
                                            🍯 {getSugarText(order.sugarLevel)}
                                        </div>
                                    )}

                                    {/* Ice Level */}
                                    {order.iceLevel && (
                                        <div
                                            className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700 border border-blue-200 flex items-center">
                                            🧊 {getIceText(order.iceLevel)}
                                        </div>
                                    )}
                                </div>


                                {/* Notes */}
                                {order.specialNotes && (
                                    <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                                        <p className="text-sm text-gray-600">
                                            <span
                                                className="font-medium text-gray-900">💭 Note:</span> {order.specialNotes}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Floating Action Buttons */}
            <div className="fixed bottom-6 right-4 flex flex-col gap-3 z-40">
                {/* Clear All Button */}
                {orders.length > 0 && (
                    <button
                        className="w-12 h-12 bg-red-500 hover:bg-red-600 shadow-lg rounded-2xl flex items-center justify-center text-white hover:scale-105 transition-all duration-200"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                )}

                {/* Add Button */}
                <button
                    onClick={() => setIsOrderOpen(true)}
                    className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-lg rounded-2xl flex items-center justify-center text-white hover:scale-105 transition-all duration-200 shadow-teal-500/25"
                >
                    <Plus className="w-6 h-6" />
                </button>
            </div>

            {/* Bottom Safe Area */}
            <div className="h-20"></div>

            {
                isOrderOpen && <CreateOrder show={isOrderOpen} onClose={() => setIsOrderOpen(false)}/>
            }

            {/* Profile Dialog */}
            <Dialog>
                <DialogContent className="sm:max-w-md mx-4">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <svg className="w-5 h-5" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            Profile Settings
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="flex justify-center">
                            <Avatar className="w-20 h-20">
                                <AvatarImage/>
                                <AvatarFallback className="bg-teal-500 text-white text-lg">
                                </AvatarFallback>
                            </Avatar>
                        </div>

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                placeholder="Enter your full name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                placeholder="@username"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-1">
                                Avatar URL (optional)
                            </label>
                            <input
                                id="avatar"
                                type="url"
                                placeholder="https://example.com/avatar.jpg"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                            />
                        </div>

                        <button
                            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-md flex items-center justify-center"
                        >
                            <Save className="w-4 h-4 mr-2"/>
                            Save Profile
                        </button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Clear All Confirmation Dialog */}
            <Dialog>
                <DialogContent className="sm:max-w-md mx-4">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                            <Trash2 className="w-5 h-5"/>
                            Clear All Orders
                        </DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-gray-600 mb-4">
                            Are you sure you want to clear all orders? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                className="flex-1 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md"
                            >
                                Clear All
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Order Confirmation Dialog */}
            <Dialog>
                <DialogContent className="sm:max-w-md mx-4">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                            <Trash2 className="w-5 h-5"/>
                            Delete Order
                        </DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p className="text-gray-600 mb-4">
                            Are you sure you want to delete this order? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                className="flex-1 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}