import {http} from "@/utils/http";

const ServiceId = {
    USER: '/api/users',
}

const getUserByUsername = async (username: any): Promise<any> => {
    const result = await http.get(ServiceId.USER + `/${username}`);
    return result.data
}

export const userService = {
    getUserByUsername,
}