import {Coffee, ShoppingCart, User} from "lucide-react";
import {useState} from "react";

export default function Navbar({user, orders}: {
    user?: any;
    orders?: any;
}) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const toggleProfileDropdown = () => {
        setIsProfileOpen(!isProfileOpen);
    };

    return (
        <div className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-gray-200/50">
            <div className="px-4 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo & Title */}
                    <div className="flex items-center gap-3">
                        <div
                            className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Coffee className="w-5 h-5 text-white"/>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">Team Orders</h1>
                            <p className="text-xs text-gray-500">
                                {new Date().toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric"
                                })}
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                        {/* Orders Count */}
                        <div className="relative">
                            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                                <ShoppingCart className="w-5 h-5 text-gray-600"/>
                            </div>
                            {orders.length > 0 && (
                                <div
                                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow-sm">
                                    <span className="text-white text-xs font-bold">{orders.length}</span>
                                </div>
                            )}
                        </div>

                        {/* Profile Button/Image with Dropdown */}
                        <div className="relative">
                            {user?.image ? (
                                <button onClick={toggleProfileDropdown}>
                                    <img
                                        src={user.image}
                                        alt={user?.name || "User"}
                                        className="w-10 h-10 rounded-xl object-cover"
                                    />
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                </button>
                            ) : (
                                <button
                                    className="relative w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center hover:bg-teal-200 transition-colors"
                                    onClick={toggleProfileDropdown}
                                >
                                    <User className="w-5 h-5 text-teal-600" />
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                </button>
                            )}

                            {/* Dropdown Menu */}
                            {isProfileOpen && (
                                <div
                                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                    <div className="py-2">
                                        <div className="px-4 py-2 border-b border-gray-200">
                                            <div
                                                className="text-sm text-gray-900 font-medium">{user?.name || "User"}</div>
                                            <div
                                                className="text-xs text-gray-500">{user?.username || "No username"}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}