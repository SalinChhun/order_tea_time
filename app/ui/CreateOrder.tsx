'use client';
import {Save, Users, X} from 'lucide-react';
import {useEffect, useState} from "react";
import useProductMutation from "@/lib/hooks/use-product-mutation";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {productService} from "@/services/product.service";
import toast from "react-hot-toast";
import {Product, UpdateProduct} from "@/type/product";
import {iceOptions, sugarLevels} from "@/type/suar-ice-preference";
import {getIceText, getSugarText} from "@/utils/utils";
import {orderService} from "@/services/order.service";
import useUserMutation from "@/lib/hooks/use-user-mutation";
import Image from "next/image";

function CreateOrder({sessionId, show, onClose, editOrder}: {
    sessionId: string | null;
    show: boolean;
    onClose?: () => void;
    editOrder?: any;
}) {

    const queryClient = useQueryClient();
    const baseUrl = `${process.env.NEXT_PUBLIC_BASE_PATH}`;
    const handleClose = () => {
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

    const { user, isLoading: isUserLoading } = useUserMutation.useFetchUserByUsername(sessionId);
    const { product_list, isLoading: isFetchProductLoading } = useProductMutation.useFetchProduct();


    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

    // Team member input states
    const [useCustomTeamName, setUseCustomTeamName] = useState(false);
    const [teamMemberName, setTeamMemberName] = useState("");


    //Create product data state
    const [addingProduct, setAddingProduct] = useState(false);
    const [newProduct, setNewProduct] = useState("");
    const [isProductLoading, setIsProductLoading] = useState(false);
    const [updateProductId, setUpdateProductId] = useState("");
    const [isUpdate, setIsUpdate] = useState(false);

    // Sugar and Ice dropdown data state
    const [sugarDropdownOpen, setSugarDropdownOpen] = useState(false);
    const [iceDropdownOpen, setIceDropdownOpen] = useState(false);
    const [selectedSugar, setSelectedSugar] = useState<string | null>(null);
    const [selectedIce, setSelectedIce] = useState<string | null>(null);

    const selectedProductCategory = selectedProduct
        ? product_list?.find((p: any) => p.id === selectedProduct)?.category
        : null;

    // Reset sugar and ice when selecting a non-coffee product
    useEffect(() => {
        if (selectedProductCategory && selectedProductCategory !== 'COFFEE') {
            setSelectedSugar(null);
            setSelectedIce(null);
        }
    }, [selectedProductCategory]);

    // Order data state
    const [isCreateOrderLoading, setIsCreateOrderLoading] = useState(false);
    const [specialNote, setSpecialNote] = useState("");


    // Edit mode data state
    const [isEditMode, setIsEditMode] = useState(false);
    // Initialize form with edit data
    useEffect(() => {
        if (editOrder) {
            setIsEditMode(true);
            setSelectedProduct(editOrder.menuItemId || editOrder.menuItem?.id);
            setSelectedSugar(editOrder.sugarLevel);
            setSelectedIce(editOrder.iceLevel);
            setSpecialNote(editOrder.specialNotes || '');

            // Handle custom team name
            if (editOrder.userDisplay && editOrder.userDisplay !== editOrder.user?.name) {
                setUseCustomTeamName(true);
                setTeamMemberName(editOrder.userDisplay);
            } else {
                setUseCustomTeamName(false);
                setTeamMemberName('');
            }
        } else {
            setIsEditMode(false);
            // Reset form for new order
            setSelectedProduct(null);
            setSelectedSugar(null);
            setSelectedIce(null);
            setSpecialNote('');
            setUseCustomTeamName(false);
            setTeamMemberName('');
        }
    }, [editOrder]);

    // TODO: func
    const handleSelectProduct = (productId: string) => {
        setSelectedProduct(productId);
        setDropdownOpen(false); // Close dropdown after selection
    };

    const handleAddNewProduct = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const product:Product = {
            name: newProduct,
            description: '',
            image: '',
            category: 'COFFEE',
            isActive: true

        }

        if (!newProduct.trim()) {
            toast.error("Season name cannot be empty");
            return;
        }
        if (isUpdate) {
            setIsProductLoading(true);
            updateProductMutation.mutate({product_id: updateProductId, product: product});
        } else {
            setIsProductLoading(true);
            createProductMutation.mutate(product);
        }
    };

    const handleUpdateProduct = (productId: string, productName: string) => {
        setUpdateProductId(productId);
        setIsUpdate(true);
        setAddingProduct(true);
        setNewProduct(productName);
    };

    const handleDeleteProduct = (productId: any) => {
        console.log('product id', productId);
        if (window.confirm("Are you sure you want to delete this season?")) {
            deleteProductMutation.mutate(productId);
        }
    };

    const handleSelectSugar = (sugar: string) => {
        setSelectedSugar(sugar);
        setSugarDropdownOpen(false);
    };

    const handleSelectIce = (ice: string) => {
        setSelectedIce(ice);
        setIceDropdownOpen(false);
    };


    const handleSaveOrder = () => {

        setIsCreateOrderLoading(true);

        if (!selectedProduct) {
            toast.error("Please select a product");
            setIsCreateOrderLoading(false);
            return;
        }
        // Only validate sugar and ice for coffee products
        if (selectedProductCategory === 'COFFEE') {
            if (!selectedSugar) {
                toast.error("Please select sugar level");
                setIsCreateOrderLoading(false);
                return;
            }
            if (!selectedIce) {
                toast.error("Please select ice preference");
                setIsCreateOrderLoading(false);
                return;
            }
        }

        const order: any = {
            userId: user?.id,
            menuItemId: selectedProduct,
            sugarLevel: selectedProductCategory === 'COFFEE' ? selectedSugar : null,
            iceLevel: selectedProductCategory === 'COFFEE' ? selectedIce : null,
            userDisplay: (useCustomTeamName && teamMemberName?.trim() !== '') ? teamMemberName : user?.name,
            specialNotes: specialNote
        };
        if (isEditMode && editOrder) {
            // Update existing order
            updateOrderMutation.mutate({
                orderId: editOrder.id,
                orderData: order
            });
        } else {
            // Create new order
            createOrderMutation.mutate(order);
        }

    }


    // TODO: mutation
    const createProductMutation = useMutation({
        mutationFn: (req: any) => productService.createProduct(req),
        onError: (error, variables, context) => {
            toast.error(error?.message)
            setIsProductLoading(false);
        },
        onSuccess: (data, variables, context) => {
            setAddingProduct(false);
            setNewProduct("");
            queryClient.invalidateQueries({ queryKey: ['products'] })
            setIsProductLoading(false);
            toast.success("Create Product Successfully");
        },
    })

    const updateProductMutation = useMutation({
        mutationFn: (req: UpdateProduct) => productService.updateProduct(req.product_id, req.product),
        onError: (error, variables, context) => {
            toast.error(error?.message)
            setIsProductLoading(false);
        },
        onSuccess: (data, variables, context) => {
            setAddingProduct(false);
            setNewProduct("");
            queryClient.invalidateQueries({ queryKey: ['products'] })
            setIsProductLoading(false);
            toast.success("Update Product Successfully");
        },
    })

    const deleteProductMutation = useMutation({
        mutationFn: (req: any) => productService.deleteProduct(req),
        onError: (error, variables, context) => {
            toast.error(error?.message)
            setIsProductLoading(false);
        },
        onSuccess: (data, variables, context) => {
            queryClient.invalidateQueries({ queryKey: ['products'] })
            toast.success("Delete Product Successfully");
        },
    })


    const createOrderMutation = useMutation({
        mutationFn: (req: any) => orderService.createOrder(req),
        onError: (error, variables, context) => {
            toast.error(error?.message)
            setIsCreateOrderLoading(false);
        },
        onSuccess: (data, variables, context) => {
            setAddingProduct(false);
            setNewProduct("");
            handleClose();
            queryClient.invalidateQueries({ queryKey: ['orders'] })
            setIsCreateOrderLoading(false);
            toast.success("Create Order Successfully");
        },
    })

    const updateOrderMutation = useMutation({
        mutationFn: (req: { orderId: string; orderData: any }) =>
            orderService.updateOrder(req.orderId, req.orderData),
        onError: (error, variables, context) => {
            toast.error(error?.message || 'Failed to update order');
            setIsCreateOrderLoading(false);
        },
        onSuccess: (data, variables, context) => {
            handleClose();
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            setIsCreateOrderLoading(false);
            toast.success("Order updated successfully");
        },
    });

    //TODO: handle sessionId and loading state
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        if (!sessionId) {
            setError('No session found. Please start from Telegram bot.');
        } else {
            setError(null);
        }
    }, [sessionId]);

    if (isUserLoading || isFetchProductLoading) {
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

    return (
        <>
            {/* Backdrop - Full screen */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
                onClick={handleClose}
            >
                {/* Modal Content - Full width and height */}
                <div
                    className="bg-white w-full h-full flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-gray-600"/>
                            <h2 className="text-lg font-semibold text-gray-900">New Order</h2>
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500"/>
                        </button>
                    </div>

                    {/* Body - Scrollable content */}
                    <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                        {/* Member Name */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                <input
                                    type="checkbox"
                                    checked={useCustomTeamName}
                                    onChange={(e) => setUseCustomTeamName(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                />
                                Enter custom team member name
                            </label>

                            {useCustomTeamName && (
                                <input
                                    type="text"
                                    value={teamMemberName}
                                    onChange={(e) => setTeamMemberName(e.target.value)}
                                    placeholder="Enter team member name"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                                />
                            )}

                            {!useCustomTeamName && (
                                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md">
                                    <span className="text-gray-600 font-mono text-sm tracking-wider">
                                        ••••••••
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Item Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Item</label>
                            <div className="mb-4 relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Select Product</label>
                                <div
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 cursor-pointer flex justify-between items-center"
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                >
                                    <span className={selectedProduct ? "text-gray-900" : "text-gray-500"}>
                                        {selectedProduct
                                            ? product_list.find((p: any) => p.id === selectedProduct)?.name
                                            : "Select Product"}
                                    </span>
                                    <svg
                                        className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M19 9l-7 7-7-7"/>
                                    </svg>
                                </div>

                                {dropdownOpen && (
                                    <div
                                        className="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-md z-10 max-h-60 overflow-y-auto"
                                    >
                                        {product_list?.map((product: any) => (
                                            <div
                                                key={product.id}
                                                className="flex items-center gap-3 p-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => handleSelectProduct(product.id)}
                                            >
                                                {/* Product Image */}
                                                <Image
                                                    src={product.image || `${baseUrl}/icons/fast-food.svg`}
                                                    alt={product.name}
                                                    className="w-10 h-10 object-cover rounded-md"
                                                />
                                                <span className="flex-1">{product.name}</span>
                                                <div className="flex items-center gap-2">
                                                    {/* Edit Button */}
                                                    <button
                                                        type="button"
                                                        className="text-blue-500 hover:text-blue-700"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleUpdateProduct(product.id, product.name);
                                                        }}
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-4 w-4 text-blue-600"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                            />
                                                        </svg>
                                                    </button>
                                                    {/* Delete Button */}
                                                    <button
                                                        type="button"
                                                        className="text-red-500 hover:text-red-700"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteProduct(product?.id);
                                                        }}
                                                    >
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-4 w-4 text-red-600"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {/* Add New Product Input */}
                                        {addingProduct ? (
                                            <div className="flex items-center gap-2 p-2 border-t">
                                                <input
                                                    type="text"
                                                    value={newProduct}
                                                    onChange={(e) => setNewProduct(e.target.value)}
                                                    placeholder="Enter new product"
                                                    className="w-full border px-2 py-1 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                />
                                                <button
                                                    type="button"
                                                    className="bg-[#121b40] hover:bg-[#283C8CFF] rounded-md p-[7px] ks-txt-white"
                                                    disabled={isProductLoading}
                                                    onClick={handleAddNewProduct}
                                                >
                                                        <span className="text-white">
                                                            {
                                                                isProductLoading ?
                                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-400"></div>
                                                                    : "✔️"
                                                            }
                                                        </span>
                                                </button>
                                                <button
                                                    className="bg-[#501414FF] hover:text-green-700 rounded-md p-[7px]"
                                                    onClick={() => setAddingProduct(false)}
                                                >
                                                    <span className="text-red-900">❌</span>
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setAddingProduct(true)}
                                                className="w-full text-left px-3 py-2 text-blue-600 hover:bg-gray-100"
                                            >
                                                + Add New
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sugar and Ice - Conditionally Rendered */}
                        {selectedProductCategory === 'COFFEE' && (
                            <div className="grid grid-cols-2 gap-3">
                                {/* Sugar Level Dropdown */}
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Sugar Level</label>
                                    <div
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white cursor-pointer flex justify-between items-center"
                                        onClick={() => setSugarDropdownOpen(!sugarDropdownOpen)}
                                    >
                                        <span className={selectedSugar ? "text-gray-900" : "text-gray-500"}>
                                            {getSugarText(selectedSugar) || "Sugar"}
                                        </span>
                                        <svg
                                            className={`w-4 h-4 text-gray-400 transition-transform ${sugarDropdownOpen ? 'rotate-180' : ''}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M19 9l-7 7-7-7"/>
                                        </svg>
                                    </div>
                                    {sugarDropdownOpen && (
                                        <div
                                            className="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-[60] max-h-60 overflow-y-auto">
                                            {sugarLevels.map((level) => (
                                                <div
                                                    key={level}
                                                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                                    onClick={() => handleSelectSugar(level)}
                                                >
                                                    {getSugarText(level)}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Ice Preference Dropdown */}
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ice Preference</label>
                                    <div
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white cursor-pointer flex justify-between items-center"
                                        onClick={() => setIceDropdownOpen(!iceDropdownOpen)}
                                    >
                                        <span className={selectedIce ? "text-gray-900" : "text-gray-500"}>
                                            {getIceText(selectedIce) || "Ice"}
                                        </span>
                                        <svg
                                            className={`w-4 h-4 text-gray-400 transition-transform ${iceDropdownOpen ? 'rotate-180' : ''}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M19 9l-7 7-7-7"/>
                                        </svg>
                                    </div>
                                    {iceDropdownOpen && (
                                        <div
                                            className="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-[60] max-h-60 overflow-y-auto">
                                            {iceOptions.map((option) => (
                                                <div
                                                    key={option}
                                                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                                    onClick={() => handleSelectIce(option)}
                                                >
                                                    {getIceText(option)}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Notes */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Special Notes
                            </label>
                            <textarea
                                placeholder="Any special instructions..."
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
                                onChange={(e) => setSpecialNote(e.target.value)}
                            />
                        </div>

                        {/* Save Button */}
                        <button
                            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            onClick={handleSaveOrder}
                            disabled={isCreateOrderLoading}
                        >
                            {
                                isCreateOrderLoading ?
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    :
                                    <>
                                        <Save className="w-4 h-4"/>
                                        Save Order
                                    </>
                            }

                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CreateOrder;