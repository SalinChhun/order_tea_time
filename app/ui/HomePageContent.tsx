'use client';
import "@/globals.css";
import {useEffect, useState} from 'react';
import {useSearchParams} from 'next/navigation';
import useUserMutation from "@/lib/hooks/useUserMutation";
import {Plus, Edit, Users, Coffee, Save, Trash2, User, ShoppingCart, Heart, Sparkles, Badge} from "lucide-react"
import {Dialog, DialogContent, DialogTitle} from "@radix-ui/react-dialog";
import {DialogHeader} from "next/dist/client/components/react-dev-overlay/internal/components/Dialog";
import {Avatar, AvatarFallback, AvatarImage} from "@radix-ui/react-avatar";
import {Label} from "@radix-ui/react-label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@radix-ui/react-select";
import CreateOrder from "@/app/ui/CreateOrder";
// import CreateOrder from "@/app/ui/CreateOrder";

interface TeamOrder {
    id: string
    member: string
    item: string
    sugar: string
    ice: string
    notes: string
}

export default function HomePageContent() {


    const [orders, setOrders] = useState<TeamOrder[]>([
        {id: "1", member: "Bong Channa", item: "Americano", sugar: "0%", ice: "Less Ice", notes: ""},
        {id: "2", member: "Bong Yuos", item: "Banana Milk", sugar: "", ice: "", notes: ""},
        {id: "3", member: "Bong Phath", item: "Americano", sugar: "0%", ice: "Normal Ice", notes: ""},
        {id: "4", member: "Bong Seyha", item: "Pocari Sweat", sugar: "", ice: "", notes: ""},
        {id: "5", member: "Vuthin", item: "Cafe Latte", sugar: "0%", ice: "Hot", notes: ""},
    ])

    const [editingOrder, setEditingOrder] = useState<TeamOrder | null>(null)
    const [isOrderOpen, setIsOrderOpen] = useState(false)
    const [showClearDialog, setShowClearDialog] = useState(false)
    const [orderToDelete, setOrderToDelete] = useState<string | null>(null)
    const [showProfileDialog, setShowProfileDialog] = useState(false)

    // User profile data
    const [userProfile, setUserProfile] = useState({
        name: "John Doe",
        username: "@johndoe",
        avatar: "",
    })

    const getSugarBadgeColor = (sugar: string) => {
        switch (sugar) {
            case "0%":
                return "bg-green-500"
            case "25%":
                return "bg-orange-400"
            case "50%":
                return "bg-orange-500"
            case "75%":
                return "bg-red-400"
            case "100%":
                return "bg-red-500"
            default:
                return "bg-gray-300"
        }
    }

    const getIceBadgeColor = (ice: string) => {
        switch (ice) {
            case "Less Ice":
                return "bg-blue-400"
            case "Normal Ice":
                return "bg-blue-600"
            case "Hot":
                return "bg-red-500"
            case "No Ice":
                return "bg-gray-400"
            default:
                return "bg-gray-300"
        }
    }

    const openEditDialog = (order: TeamOrder) => {
        setEditingOrder({...order})
    }

    const clearAllOrders = () => {
        setOrders([])
        setShowClearDialog(false)
    }

    const deleteOrder = (orderId: string) => {
        setOrders(orders.filter((order) => order.id !== orderId))
        setOrderToDelete(null)
    }

    const updateProfile = (field: keyof typeof userProfile, value: string) => {
        setUserProfile({...userProfile, [field]: value})
    }

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }


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
        // <div className="min-h-screen bg-gray-50">
        //     {/* Header with user info */}
        //     <header className="bg-white shadow-sm border-b">
        //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        //             <div className="flex items-center justify-between h-16">
        //                 <div className="flex items-center">
        //                     <h1 className="text-xl font-semibold text-gray-900">🍵 Teatime Menu</h1>
        //                 </div>
        //                 {user && (
        //                     <div className="flex items-center space-x-2">
        //                         <span className="text-sm text-gray-600">Welcome,</span>
        //                         <span className="text-sm font-medium text-gray-900">
        //                             {user.name || user.username}
        //                         </span>
        //                         <span className="text-xs text-gray-500">
        //                             (@{user.username})
        //                         </span>
        //                     </div>
        //                 )}
        //             </div>
        //         </div>
        //     </header>
        //
        //     {/* User info section */}
        //     {user && (
        //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        //             <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        //                 <div className="flex items-center justify-between">
        //                     <div>
        //                         <h3 className="text-lg font-medium text-blue-900">
        //                             Hello, {user.name || user.username}! 👋
        //                         </h3>
        //                         <p className="text-sm text-blue-700">
        //                             Username: @{user.username} •
        //                             Member since: {new Date(user.createdAt).toLocaleDateString()}
        //                         </p>
        //                         <div className="mt-2 text-xs text-blue-600 bg-blue-100 inline-block px-2 py-1 rounded">
        //                             Session ID: {sessionId}
        //                         </div>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     )}
        // </div>

        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-teal-600 text-white sticky top-0 z-10">
                {/* Mobile Header */}
                <div className="p-3 sm:hidden">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <Coffee className="w-5 h-5"/>
                            <h1 className="text-lg font-bold">Team Orders</h1>
                        </div>

                        {/* Profile and Orders Count Badges */}
                        <div className="flex items-center gap-3">
                            {/* Profile Badge */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowProfileDialog(true)}
                                    className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-white hover:bg-opacity-30 p-0 transition-colors"
                                >
                                    <svg className="w-5 h-5 text-white" width="24" height="24" viewBox="0 0 24 24"
                                         fill="none" xmlns="http://www.w3.org/2000/svg">
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
                                </button>
                                <div
                                    className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">•</span>
                                </div>
                            </div>

                            {/* Orders Count Badge */}
                            <div className="relative">
                                <div
                                    className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                    <svg
                                        className="w-5 h-5 text-white"
                                        fill="currentColor"
                                        version="1.1"
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 902.86 902.86"
                                    >
                                        <g>
                                            <g>
                                                <path
                                                    d="M671.504,577.829l110.485-432.609H902.86v-68H729.174L703.128,179.2L0,178.697l74.753,399.129h596.751V577.829z M685.766,247.188l-67.077,262.64H131.199L81.928,246.756L685.766,247.188z"/>
                                                <path
                                                    d="M578.418,825.641c59.961,0,108.743-48.783,108.743-108.744s-48.782-108.742-108.743-108.742H168.717 c-59.961,0-108.744,48.781-108.744,108.742s48.782,108.744,108.744,108.744c59.962,0,108.743-48.783,108.743-108.744 c0-14.4-2.821-28.152-7.927-40.742h208.069c-5.107,12.59-7.928,26.342-7.928,40.742 C469.675,776.858,518.457,825.641,578.418,825.641z M209.46,716.897c0,22.467-18.277,40.744-40.743,40.744 c-22.466,0-40.744-18.277-40.744-40.744c0-22.465,18.277-40.742,40.744-40.742C191.183,676.155,209.46,694.432,209.46,716.897z M619.162,716.897c0,22.467-18.277,40.744-40.743,40.744s-40.743-18.277-40.743-40.744c0-22.465,18.277-40.742,40.743-40.742 S619.162,694.432,619.162,716.897z"/>
                                            </g>
                                        </g>
                                    </svg>
                                </div>
                                <div
                                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-xs font-bold">{orders.length}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Teatime subtitle moved to bottom */}
                    <div className="flex justify-center">
                        <p className="text-teal-100 text-xs">
                            Teatime - {new Date().toLocaleDateString("en-US", {month: "short", year: "numeric"})}
                        </p>
                    </div>
                </div>

                {/* Desktop Header */}
                <div className="hidden sm:block p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Coffee className="w-6 h-6"/>
                            <div>
                                <h1 className="text-xl font-bold">Team Orders</h1>
                                <p className="text-teal-100 text-sm">
                                    Teatime - {new Date().toLocaleDateString("en-US", {month: "long", year: "numeric"})}
                                </p>
                            </div>
                        </div>

                        {/* Profile Section */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                {/* Orders Count Badge */}
                                <div className="relative">
                                    <div
                                        className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                                        <svg
                                            className="w-6 h-6 text-white"
                                            fill="currentColor"
                                            version="1.1"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 902.86 902.86"
                                        >
                                            <g>
                                                <g>
                                                    <path
                                                        d="M671.504,577.829l110.485-432.609H902.86v-68H729.174L703.128,179.2L0,178.697l74.753,399.129h596.751V577.829z M685.766,247.188l-67.077,262.64H131.199L81.928,246.756L685.766,247.188z"/>
                                                    <path
                                                        d="M578.418,825.641c59.961,0,108.743-48.783,108.743-108.744s-48.782-108.742-108.743-108.742H168.717 c-59.961,0-108.744,48.781-108.744,108.742s48.782,108.744,108.744,108.744c59.962,0,108.743-48.783,108.743-108.744 c0-14.4-2.821-28.152-7.927-40.742h208.069c-5.107,12.59-7.928,26.342-7.928,40.742 C469.675,776.858,518.457,825.641,578.418,825.641z M209.46,716.897c0,22.467-18.277,40.744-40.743,40.744 c-22.466,0-40.744-18.277-40.744-40.744c0-22.465,18.277-40.742,40.744-40.742C191.183,676.155,209.46,694.432,209.46,716.897z M619.162,716.897c0,22.467-18.277,40.744-40.743,40.744s-40.743-18.277-40.743-40.744c0-22.465,18.277-40.742,40.743-40.742 S619.162,694.432,619.162,716.897z"/>
                                                </g>
                                            </g>
                                        </svg>
                                    </div>
                                    <div
                                        className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-bold">{orders.length}</span>
                                    </div>
                                </div>

                                {/* Profile Badge */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowProfileDialog(true)}
                                        className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-white hover:bg-opacity-30 p-0 transition-colors"
                                    >
                                        <svg className="w-6 h-6 text-white" width="24" height="24" viewBox="0 0 24 24"
                                             fill="none" xmlns="http://www.w3.org/2000/svg">
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
                                    </button>
                                    <div
                                        className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-bold">•</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Orders Display */}
            <div className="p-4 space-y-3 pb-32">
                {orders.length === 0 ? (
                    <div className="text-center py-12">
                        <Coffee className="w-16 h-16 mx-auto text-gray-300 mb-4"/>
                        <p className="text-gray-500 text-lg">No orders yet</p>
                        <p className="text-gray-400">Tap the + button to add an order</p>
                    </div>
                ) : (
                    orders.map((order) => (
                        <div key={order.id} className="shadow-sm hover:shadow-md transition-shadow">
                            <div className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-900">{order.member || "Unnamed Member"}</h3>
                                        <p className="text-teal-600 font-medium">{order.item || "No item selected"}</p>
                                    </div>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => openEditDialog(order)}
                                            className="p-1 rounded-full text-gray-500 hover:text-teal-600 hover:bg-gray-100"
                                        >
                                            <Edit className="w-4 h-4"/>
                                        </button>
                                        <button
                                            onClick={() => setOrderToDelete(order.id)}
                                            className="p-1 rounded-full text-gray-500 hover:text-red-600 hover:bg-gray-100"
                                        >
                                            <Trash2 className="w-4 h-4"/>
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-2">
                                    {order.sugar && (
                                        <Badge
                                            className={`text-white ${getSugarBadgeColor(order.sugar)}`}>Sugar: {order.sugar}</Badge>
                                    )}
                                    {order.ice && <Badge
                                        className={`text-white ${getIceBadgeColor(order.ice)}`}>{order.ice}</Badge>}
                                </div>

                                {order.notes && (
                                    <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                        <span className="font-medium">Notes:</span> {order.notes}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Floating Action Buttons */}
            <div className="fixed bottom-24 right-6 flex flex-col gap-3">
                {/* Clear All Button */}
                {orders.length > 0 && (
                    <button
                        onClick={() => setShowClearDialog(true)}
                        className="rounded-full w-14 h-14 bg-red-500 hover:bg-red-600 shadow-lg flex items-center justify-center text-white"
                    >
                        <Trash2 className="w-6 h-6"/>
                    </button>
                )}

                {/* Add Button */}
                <button
                    onClick={() => setIsOrderOpen(true)}
                    className="rounded-full w-16 h-16 bg-teal-600 hover:bg-teal-700 shadow-lg flex items-center justify-center text-white"
                >
                    <Plus className="w-8 h-8"/>
                </button>
            </div>

            {/* Footer */}
            <footer className="bg-amber-900 text-white py-8 px-4">
                <div className="max-w-md mx-auto text-center">
                    <div className="mb-4 relative">
                        <div
                            className="w-20 h-20 mx-auto bg-amber-800 rounded-full flex items-center justify-center mb-2">
                            <Coffee className="w-10 h-10 text-amber-200"/>
                        </div>
                        <Sparkles className="absolute top-0 right-1/3 w-6 h-6 text-yellow-400"/>
                        <Heart className="absolute top-2 right-1/4 w-5 h-5 text-red-500"/>
                    </div>

                    <h2 className="text-2xl font-bold mb-4">Thank You</h2>

                    <p className="text-amber-100 mb-4 leading-relaxed">
                        We appreciate your visit and hope to serve you the perfect cup of coffee soon. May your day be
                        as wonderful
                        as your favorite brew!
                    </p>

                    <p className="text-amber-200 text-sm">
                        Made with <Heart className="inline w-4 h-4 text-red-400"/> for coffee lovers
                    </p>
                </div>
            </footer>

            {
                isOrderOpen && <CreateOrder show={isOrderOpen} onClose={() => setIsOrderOpen(false)}/>
            }

            {/* Profile Dialog */}
            <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
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
                                <AvatarImage src={userProfile.avatar || "/placeholder.svg"} alt={userProfile.name}/>
                                <AvatarFallback className="bg-teal-500 text-white text-lg">
                                    {getInitials(userProfile.name)}
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
                                value={userProfile.name}
                                onChange={(e) => updateProfile("name", e.target.value)}
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
                                value={userProfile.username}
                                onChange={(e) => updateProfile("username", e.target.value)}
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
                                value={userProfile.avatar}
                                onChange={(e) => updateProfile("avatar", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                            />
                        </div>

                        <button
                            onClick={() => setShowProfileDialog(false)}
                            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-md flex items-center justify-center"
                        >
                            <Save className="w-4 h-4 mr-2"/>
                            Save Profile
                        </button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Clear All Confirmation Dialog */}
            <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
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
                                onClick={() => setShowClearDialog(false)}
                                className="flex-1 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={clearAllOrders}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md"
                            >
                                Clear All
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Order Confirmation Dialog */}
            <Dialog open={!!orderToDelete} onOpenChange={() => setOrderToDelete(null)}>
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
                                onClick={() => setOrderToDelete(null)}
                                className="flex-1 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => orderToDelete && deleteOrder(orderToDelete)}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}