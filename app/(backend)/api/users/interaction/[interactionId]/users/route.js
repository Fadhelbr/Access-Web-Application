import { PrismaClient } from "@/lib/generated/prisma";
const prisma = new PrismaClient();
export async function GET(request, { params }) {
    const interactionId = await params.interactionId
    try {
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
            }
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
        })
    }
    catch (error) {
        console.error("Error fetching user by interaction id:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
}