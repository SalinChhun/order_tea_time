import React, {useState} from 'react';
import { Plus, ShoppingCart, Trash2 } from 'lucide-react';
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {orderService} from "@/services/order.service";
import toast from "react-hot-toast";

interface BottomNavigationProps {
    orders: any[];
    onAddOrder: () => void;
    onOrderDetails: () => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
                                                               orders,
                                                               onAddOrder,
                                                               onOrderDetails
                                                           }) => {
    const queryClient = useQueryClient();
    const [clearingAllOrders, setClearingAllOrders] = useState(false);

    const handleClearAllOrders = () => {
        const isConfirmed = window.confirm(
            `Are you sure you want to delete ALL ${orders.length} orders?\n\nThis action cannot be undone and will remove all current orders.`
        );

        if (isConfirmed) {
            const isDoubleConfirmed = window.confirm(
                "⚠️ FINAL CONFIRMATION ⚠️\n\nThis will permanently delete ALL orders. Are you absolutely sure?"
            );

            if (isDoubleConfirmed) {
                setClearingAllOrders(true);
                clearAllOrdersMutation.mutate();
            }
        }
    };

    const clearAllOrdersMutation = useMutation({
        mutationFn: () => orderService.clearAllOrders(),
        onError: (error, variables, context) => {
            toast.error(error?.message || 'Failed to clear all orders');
            setClearingAllOrders(false);
        },
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            setClearingAllOrders(false);
            toast.success("All orders cleared successfully");
        },
    });

    return (
        <>
            {/* Gradient overlay for depth */}
            <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/5 to-transparent pointer-events-none z-40" />

            {/* Main navigation */}
            <div className="fixed bottom-0 left-0 right-0 z-50">
                {/* Frosted glass background */}
                <div className="bg-white/80 backdrop-blur-2xl border-t border-white/20 shadow-2xl shadow-black/10">
                    <div className="px-6 py-4">
                        <div className="flex items-center justify-between max-w-sm mx-auto">
                            {/* Orders Count - Left */}
                            <div onClick={onOrderDetails} className="relative group">
                                <div className="w-12 h-12 bg-gradient-to-br from-gray-50 to-gray-100/80 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-gray-200/50 group-hover:scale-105 group-hover:shadow-lg transition-all duration-300 ease-out">
                                    <ShoppingCart className="w-5 h-5 text-gray-700"/>
                                </div>
                                {orders.length > 0 && (
                                    <>
                                        {/* Badge glow effect */}
                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500/20 rounded-full blur-sm animate-pulse" />
                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 border-2 border-white">
                                            <span className="text-white text-xs font-bold leading-none">
                                                {orders.length > 99 ? '99+' : orders.length}
                                            </span>
                                        </div>
                                    </>
                                )}

                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                                    {orders.length} {orders.length === 1 ? 'order' : 'orders'}
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                                </div>
                            </div>

                            {/* Add Button - Center */}
                            <div className="relative group">
                                <button
                                    className="relative w-14 h-14 bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-600 hover:from-teal-600 hover:via-teal-700 hover:to-emerald-700 shadow-xl shadow-teal-500/30 rounded-2xl flex items-center justify-center text-white transform hover:scale-110 active:scale-95 transition-all duration-300 ease-out border border-teal-400/20"
                                    onClick={onAddOrder}
                                >
                                    <Plus className="w-6 h-6 drop-shadow-sm"/>
                                </button>
                            </div>

                            {/* Clear All Button - Right */}
                            <div className="relative group">
                                {orders.length > 0 ? (
                                    <>
                                        <button
                                            onClick={handleClearAllOrders}
                                            disabled={clearingAllOrders}
                                            className={`relative w-12 h-12 rounded-2xl flex items-center justify-center text-white transform transition-all duration-300 ease-out border ${
                                                clearingAllOrders
                                                    ? 'bg-gradient-to-br from-red-400 to-red-500 cursor-not-allowed scale-95 border-red-300/50'
                                                    : 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:scale-105 active:scale-95 shadow-lg shadow-red-500/25 border-red-400/20'
                                            }`}
                                        >
                                            {clearingAllOrders ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                            ) : (
                                                <Trash2 className="w-5 h-5 drop-shadow-sm"/>
                                            )}

                                            {/* Shine effect */}
                                            {!clearingAllOrders && (
                                                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            )}
                                        </button>

                                        {/* Tooltip */}
                                        <div className="absolute bottom-full right-1/2 transform translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                                            {clearingAllOrders ? 'Clearing...' : `Clear all ${orders.length} orders`}
                                            <div className="absolute top-full right-1/2 transform translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                                        </div>
                                    </>
                                ) : (
                                    // Placeholder for consistent spacing
                                    <div className="w-12 h-12"></div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Safe area for devices with home indicator */}
                    <div className="h-safe-area-inset-bottom bg-white/60 backdrop-blur-2xl"></div>
                </div>
            </div>
        </>
    );
};

export default BottomNavigation;