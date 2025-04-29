import { PrismaClient } from "@/lib/generated/prisma";
const prisma = new PrismaClient();

export async function GET(request, { params }) {
    const id = params.id
    try {
        const calls = await prisma.call.findMany({
            select: {
                id: true,
                interactionId: true,
                direction: true,
                duration: true,
                callAt: true,
                status: true,
            },
            where: {
                userId: id,
            },
        });

        return new Response(JSON.stringify(calls), {
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