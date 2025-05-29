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

export const useOrderMutation = {
    useFetchOrder,
}

export default useOrderMutation;