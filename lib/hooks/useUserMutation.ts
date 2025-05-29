import {useQuery} from "@tanstack/react-query";
import {userService} from "@/services/user.service";

const useFetchUserByUsername = (username: any) =>{

    const {data,  isLoading, isError} = useQuery({
        queryKey: ["users"],
        queryFn: () => userService.getUserByUsername(username)
    });

    return {
        isLoading,
        isError,
        user: data,
    }
}

export const useUserMutation = {
    useFetchUserByUsername,
}

export default useUserMutation;