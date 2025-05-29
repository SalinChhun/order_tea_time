import {http} from "@/utils/http";

const ServiceId = {
    USER: '/api/orders',
}

const getOrders = async (): Promise<any> => {
    const result = await http.get(ServiceId.USER);
    return result.data
}

export const orderService = {
    getOrders,
}