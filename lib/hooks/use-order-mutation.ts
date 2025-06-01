import {useQuery} from "@tanstack/react-query";
import {orderService} from "@/services/order.service";

const useFetchOrder = () =>{

    const {data,  isLoading, isError} = useQuery({
        queryKey: ["orders"],
        queryFn: () => orderService.getOrders()
    });

    return {
        isLoading,
        isError,
        orders: data,
    }
}

const useFetchOrderCount = () =>{

    const {data,  isLoading, isError} = useQuery({
        queryKey: ["orders-count"],
        queryFn: () => orderService.getOrdersCount()
    });

    return {
        isLoading,
        isError,
        orders_count: data,
    }
}

export const useOrderMutation = {
    useFetchOrder,
    useFetchOrderCount
}

export default useOrderMutation;