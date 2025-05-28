import { NextRequest } from "next/server";
import {UserService} from "@/app/service/user-service";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ username: string }> }
) {
    try {
        const username = (await params).username;

        if (!username) {
            return Response.json(
                { error: "Username parameter is required" },
                { status: 400 }
            );
        }

        const user = await UserService.getUserByUsername(username);

        if (!user) {
            return Response.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return Response.json(user, { status: 200 });
    } catch (error) {
        console.error("GET /api/users/[username] error:", error);

        if (error instanceof Error) {
            return Response.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return Response.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}