import { PrismaClient } from "@/lib/generated/prisma";
const prisma = new PrismaClient();

export async function GET(request, { params }) {
    const id = await params.id
    try {
        const users = await prisma.user.findFirst({
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            },
            where: {
                id: id,
            },
        })
        return new Response(JSON.stringify(users), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    catch (error) {
        console.error("Error fetching user:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
}

export async function PUT(request, { params }) {
    const id = await params.id
    const body = await request.json();
    try {
        if (body.password)
            body.password = await bcrypt.hash(body.password, 10)
        else
            delete body.password

        const user = await prisma.user.update({
            where: {
                id: id,
            },
            data: body,
        })
        return new Response(JSON.stringify(user), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
    catch (error) {
        console.error("Error updating user:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
}