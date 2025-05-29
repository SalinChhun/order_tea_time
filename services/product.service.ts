import {http} from "@/utils/http";

const ServiceId = {
    PRODUCT: '/api/menu-items',
}

const createProduct = (requestBody: any) => {
    return http.post(ServiceId.PRODUCT,requestBody);
}

const getProducts = async (): Promise<any> => {
    const result = await http.get(ServiceId.PRODUCT);
    return result.data
}

const updateProduct = (productId: any, requestBody: any) => {
    return http.put(ServiceId.PRODUCT + `/${productId}`, requestBody);
}

const deleteProduct = (productId: any) => {
    return http.delete(ServiceId.PRODUCT + `/${productId}`);
}

export const productService = {
    createProduct,
    getProducts,
    updateProduct,
    deleteProduct
}