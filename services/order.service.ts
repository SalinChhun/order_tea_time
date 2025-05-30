import {http} from "@/utils/http";

const ServiceId = {
    ORDER: '/api/orders',
}

const createOrder = (requestBody: any) => {
    return http.post(ServiceId.ORDER,requestBody);
}


const getOrders = async (): Promise<any> => {
    const result = await http.get(ServiceId.ORDER);
    return result.data
}

const updateOrder = (orderId: any, requestBody: any) => {
    return http.put(ServiceId.ORDER + `/${orderId}`, requestBody);
}

const deleteOrder = (orderId: any) => {
    return http.delete(ServiceId.ORDER + `/${orderId}`);
}

const clearAllOrders = () => {
    return http.delete(ServiceId.ORDER);
}

export const orderService = {
    createOrder,
    getOrders,
    updateOrder,
    deleteOrder,
    clearAllOrders
}