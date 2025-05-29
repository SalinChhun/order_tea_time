export interface UpdateProduct {
    product_id: string;
    product: Product;
}

export interface Product {
    name: string;
    description: string;
    image: string;
    category: string;
    isActive: boolean;
}