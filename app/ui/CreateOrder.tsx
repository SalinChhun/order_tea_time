'use client';
import { Save, Users, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import { useState, useEffect } from "react";

const menuItems = [
    "Americano", "Banana Milk", "Pocari Sweat", "Coca-cola", "Cafe Latte",
    "Macha Latte", "Chocolate", "Bird Nest", "Potato Chips",
]

const sugarLevels = ["0%", "25%", "50%", "75%", "100%"]
const iceOptions = ["Less Ice", "Normal Ice", "Hot", "No Ice"]

interface OrderData {
    member: string;
    item: string;
    sugar: string;
    ice: string;
    notes: string;
}

function CreateOrder({ show, onClose, onSave }: {
    show: boolean;
    onClose?: () => void;
    onSave?: (orderData: OrderData) => void;
}) {
    const [orderData, setOrderData] = useState<OrderData>({
        member: "", item: "", sugar: "", ice: "", notes: ""
    });

    const updateOrderData = (field: keyof OrderData, value: string) => {
        setOrderData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        if (onSave && orderData.member && orderData.item) {
            onSave(orderData);
            setOrderData({ member: "", item: "", sugar: "", ice: "", notes: "" });
            if (onClose) onClose();
        }
    };

    const handleClose = () => {
        setOrderData({ member: "", item: "", sugar: "", ice: "", notes: "" });
        if (onClose) onClose();
    };

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (show) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [show]);

    if (!show) return null;

    return (
        <>
            {/* Backdrop - Transparent background */}
            <div
                className="bg-opacity-10 bg-red fixed inset-0 z-50 flex items-center justify-center p-4"
                onClick={handleClose}
            >
                {/* Modal Content */}
                <div
                    className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-gray-600" />
                            <h2 className="text-lg font-semibold text-gray-900">New Order</h2>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-4">
                        {/* Member Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Team Member
                            </label>
                            <input
                                type="text"
                                placeholder="Enter team member name"
                                value={orderData.member}
                                onChange={(e) => updateOrderData("member", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                            />
                        </div>

                        {/* Item Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Item</label>
                            <Select value={orderData.item} onValueChange={(value) => updateOrderData("item", value)}>
                                <SelectTrigger className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white">
                                    <SelectValue placeholder="Select item" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border border-gray-300 rounded-md shadow-lg z-[60]">
                                    {menuItems.map((item) => (
                                        <SelectItem
                                            key={item}
                                            value={item}
                                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            {item}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Sugar and Ice */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sugar Level</label>
                                <Select value={orderData.sugar} onValueChange={(value) => updateOrderData("sugar", value)}>
                                    <SelectTrigger className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white">
                                        <SelectValue placeholder="Sugar" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border border-gray-300 rounded-md shadow-lg z-[60]">
                                        {sugarLevels.map((level) => (
                                            <SelectItem
                                                key={level}
                                                value={level}
                                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                            >
                                                {level}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ice Preference</label>
                                <Select value={orderData.ice} onValueChange={(value) => updateOrderData("ice", value)}>
                                    <SelectTrigger className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white">
                                        <SelectValue placeholder="Ice" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border border-gray-300 rounded-md shadow-lg z-[60]">
                                        {iceOptions.map((option) => (
                                            <SelectItem
                                                key={option}
                                                value={option}
                                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                            >
                                                {option}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Notes */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Special Notes
                            </label>
                            <textarea
                                placeholder="Any special instructions..."
                                value={orderData.notes}
                                onChange={(e) => updateOrderData("notes", e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
                            />
                        </div>

                        {/* Save Button */}
                        <button
                            onClick={handleSave}
                            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            disabled={!orderData.member || !orderData.item}
                        >
                            <Save className="w-4 h-4" />
                            Save Order
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CreateOrder;