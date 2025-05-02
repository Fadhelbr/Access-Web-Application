import { PrismaClient } from "@/lib/generated/prisma";
const prisma = new PrismaClient();

export async function GET(request, { params }) {
    try {
        const interactionId = await params.interactionId;
        const userId = await prisma.user.findFirst({
            select: {
                id: true,
            },
            where: {
                Call: {
                    some: {
                        interactionId: interactionId,
                    }
                }
            },
        })

        if (!userId) {
            return new Response(JSON.stringify({ error: "No user found" }), {
                status: 404,
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }

        return new Response(JSON.stringify(userId), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
}

// http://localhost:3000/api/users/interaction/123/users