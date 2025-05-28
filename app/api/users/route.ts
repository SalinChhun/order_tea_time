import {prisma} from "@/lib/prisma";
import {NextRequest} from "next/server";
import {UserService} from "@/app/service/user-service";


export async function POST(request: Request) {

    try {
        const {username, name} = await request.json()

        const user = await prisma.user.create({
            data: {
                username,
                name,
            },
        })

        return new Response(JSON.stringify(user), {
            status: 201,
            headers: {'Content-Type': 'application/json'}
        });
    } catch (error) {
        if (error instanceof Error) {
            return Response.json({error: error.message}, {status: 500})
        }
    }

}

export async function GET(request: NextRequest) {
    try {
        const users = await UserService.getAllUsers();

        return Response.json(users, { status: 200 });
    } catch (error) {
        console.error("GET /api/users error:", error);

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

export async function PUT(request: Request) {
    try {
        const {id, username, name} = await request.json()

        const user = await prisma.user.update({
            where: {id},
            data: {
                username,
                name,
            },
        })

        return new Response(JSON.stringify(user), {
            status: 200,
            headers: {'Content-Type': 'application/json'}
        });
    } catch (error) {
        if (error instanceof Error) {
            return Response.json({error: error.message}, {status: 500})
        }
    }
}

export async function DELETE(request: Request) {
    try {
        const {id} = await request.json()

        const user = await prisma.user.delete({
            where: {id},
        })

        return new Response(JSON.stringify(user), {
            status: 200,
            headers: {'Content-Type': 'application/json'}
        });
    } catch (error) {
        if (error instanceof Error) {
            return Response.json({error: error.message}, {status: 500})
        }
    }
}
