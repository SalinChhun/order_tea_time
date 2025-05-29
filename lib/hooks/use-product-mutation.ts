import {useQuery} from "@tanstack/react-query";
import {productService} from "@/services/product.service";

const useFetchProduct = () =>{

    const {data,  isLoading, isError} = useQuery({
        queryKey: ["products"],
        queryFn: () => productService.getProducts()
    });

    return {
        isLoading,
        isError,
        product_list: data,
    }
}

export const useProductMutation = {
    useFetchProduct,
}

export default useProductMutation;