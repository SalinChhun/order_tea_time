import React from 'react';
import { X, ShoppingCart, Package } from 'lucide-react';
import useOrderMutation from "@/lib/hooks/use-order-mutation";
import { getIceText, getSugarText } from "@/utils/utils";
import Image from "next/image";

function ShippingCart({ show, onClose }: { show: boolean; onClose?: () => void }) {
    if (!show) return null;

    const handleClose = () => {
        if (onClose) onClose();
    };

    const { orders_count, isLoading } = useOrderMutation.useFetchOrderCount();

    // Handle loading state
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                </div>
            </div>
        );
    }

    // Use fetched data or fallback to empty array
    const orderData = orders_count?.data || [];

    // Calculate total items
    const totalItems = orderData.reduce((sum: number, item: any) => sum + item.total, 0);

    // Categorize items based on ItemCategory enum
    const getBeverageItems = () => {
        const beverageCategories = ['COFFEE', 'TEA', 'MILK_TEA', 'SPECIALTY_DRINK'];
        return orderData.filter((item: any) => beverageCategories.includes(item.category));
    };

    const getNonBeverageItems = () => {
        const beverageCategories = ['COFFEE', 'TEA', 'MILK_TEA', 'SPECIALTY_DRINK'];
        return orderData.filter((item: any) => !beverageCategories.includes(item.category));
    };

    // Transform details to create separate entries for each sugar/ice combination
    const transformOrderData = (items: typeof orderData) => {
        return items.flatMap((item: any) =>
            item.details.map((detail: any) => ({
                item: item.item,
                category: item.category,
                image: item.image,
                total: detail.count,
                sugar: detail.sugar || '',
                ice: detail.ice || '',
            }))
        );
    };

    const renderOrderItem = (item: any, index: any) => (
        <div
            key={index}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
        >
            <div className="flex-1">
                <div className="flex items-center gap-3">
                    {
                        item?.image ?
                            <Image
                                width={40}
                                height={40}
                                src={item?.image}
                                alt={item?.item}
                                className="w-10 h-10 object-cover rounded-md"
                            />
                            :
                            <Package className="w-10 h-10 text-gray-600" />
                    }

                    <div>
                        <h3 className="font-medium text-gray-900">{item?.item}</h3>
                        <div className="flex gap-4 mt-1">
                            {item?.sugar && (
                                <span className="text-sm text-gray-600">
                                    <span className="font-medium">Sugar:</span> {getSugarText(item?.sugar)}
                                </span>
                            )}
                            {item?.ice && (
                                <span className="text-sm text-gray-600">
                                    <span className="font-medium">Ice:</span> {getIceText(item?.ice)}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900">×{item?.total}</div>
                    <div className="text-sm text-gray-500">items</div>
                </div>
            </div>
        </div>
    );

    const beverageItems = transformOrderData(getBeverageItems());
    const nonBeverageItems = transformOrderData(getNonBeverageItems());

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
                onClick={handleClose}
            >
                {/* Modal Content */}
                <div
                    className="bg-white w-full h-full flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
                        <div className="flex items-center gap-2">
                            <ShoppingCart className="w-5 h-5 text-gray-600" />
                            <h2 className="text-lg font-semibold text-gray-900">Shipping Cart</h2>
                            <span className="bg-teal-100 text-teal-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                                {totalItems} items
                            </span>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Body - Scrollable content */}
                    <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                        {/* Beverage Items */}
                        {beverageItems.length > 0 && (
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                                    <h3 className="text-lg font-semibold text-gray-800">Beverages</h3>
                                    <span className="text-sm text-gray-500">({beverageItems.length} types)</span>
                                </div>
                                <div className="space-y-3">
                                    {beverageItems.map((item: any, index: any) =>
                                        renderOrderItem(item, `beverage-${index}`)
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Non-Beverage Items */}
                        {nonBeverageItems.length > 0 && (
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                    <h3 className="text-lg font-semibold text-gray-800">Food & Others</h3>
                                    <span className="text-sm text-gray-500">({nonBeverageItems.length} types)</span>
                                </div>
                                <div className="space-y-3">
                                    {nonBeverageItems.map((item: any, index: any) =>
                                        renderOrderItem(item, `food-${index}`)
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Summary Section */}
                        <div className="mt-8 p-4 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg border border-teal-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">Order Summary</h3>
                                    <p className="text-sm text-gray-600 mt-1">Ready for shipping</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-teal-600">{totalItems}</div>
                                    <div className="text-sm text-gray-600">Total Items</div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {/*<div className="flex gap-3 pt-4">
                            <button
                                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-3 px-4 rounded-md font-medium transition-colors"
                                onClick={() => {
                                    console.log('Confirm shipping');
                                }}
                            >
                                Confirm Shipping
                            </button>
                            <button
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium transition-colors"
                                onClick={handleClose}
                            >
                                Close
                            </button>
                        </div>*/}
                    </div>
                </div>
            </div>
        </>
    );
}

export default ShippingCart;