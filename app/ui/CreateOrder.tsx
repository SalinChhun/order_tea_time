'use client';
import {Save, Users, X} from 'lucide-react';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@radix-ui/react-select";
import {useState, useEffect} from "react";
import {Spinner} from "react-bootstrap";
import useProductMutation from "@/lib/hooks/use-product-mutation";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {productService} from "@/services/product.service";
import toast from "react-hot-toast";
import {Product, UpdateProduct} from "@/type/product";

const menuItems = [
    "Americano", "Banana Milk", "Pocari Sweat", "Coca-cola", "Cafe Latte",
    "Macha Latte", "Chocolate", "Bird Nest", "Potato Chips",
];

const sugarLevels = ["0%", "25%", "50%", "75%", "100%"];
const iceOptions = ["Less Ice", "Normal Ice", "Hot", "No Ice"];

interface OrderData {
    member: string;
    item: string;
    sugar: string;
    ice: string;
    notes: string;
}

function CreateOrder({show, onClose, onSave}: {
    show: boolean;
    onClose?: () => void;
    onSave?: (orderData: OrderData) => void;
}) {

    const queryClient = useQueryClient();

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

    const {product_list, isLoading} = useProductMutation.useFetchProduct();


    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<string | null>(null);


    //create product
    const [addingProduct, setAddingProduct] = useState(false);
    const [newProduct, setNewProduct] = useState("");
    const [isProductLoading, setIsProductLoading] = useState(false);
    const [updateProductId, setUpdateProductId] = useState("");
    const [isUpdate, setIsUpdate] = useState(false);


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
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Team Member
                            </label>
                            <input
                                type="text"
                                placeholder="Enter team member name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                            />
                        </div>

                        {/* Item Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Item</label>
                            <div className="mb-4 relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Select Product</label>
                                <div
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 cursor-pointer"
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                >
                                    {selectedProduct
                                        ? product_list.find((p: any) => p.id === selectedProduct)?.name
                                        : "Select Product"}
                                </div>

                                {dropdownOpen && (
                                    <div
                                        className="absolute w-full mt-1 bg-white border border-gray-300 rounded-md shadow-md z-10 max-h-60 overflow-y-auto"
                                    >
                                        {product_list?.map((product: any) => (
                                            <div
                                                key={product.id}
                                                className="flex justify-between items-center p-2 hover:bg-gray-100 cursor-pointer"
                                                // onMouseEnter={() => setHoveredProduct(product.id)}
                                                // onMouseLeave={() => setHoveredProduct(null)}
                                                onClick={() => handleSelectProduct(product.id)}
                                            >
                                                <span>{product.name}</span>

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
                                                            console.log('product ', product)
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
                                                                    <Spinner animation="border" style={{
                                                                        width: 18,
                                                                        height: 18,
                                                                        marginRight: 5
                                                                    }} role="status">
                                                                    </Spinner> : "✔️"
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

                        {/* Sugar and Ice */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sugar Level</label>
                                <Select>
                                    <SelectTrigger
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white">
                                        <SelectValue placeholder="Sugar"/>
                                    </SelectTrigger>
                                    <SelectContent
                                        className="bg-white border border-gray-300 rounded-md shadow-lg z-[60]">
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
                                <Select>
                                    <SelectTrigger
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white">
                                        <SelectValue placeholder="Ice"/>
                                    </SelectTrigger>
                                    <SelectContent
                                        className="bg-white border border-gray-300 rounded-md shadow-lg z-[60]">
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
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
                            />
                        </div>

                        {/* Save Button */}
                        <button
                            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Save className="w-4 h-4"/>
                            Save Order
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CreateOrder;