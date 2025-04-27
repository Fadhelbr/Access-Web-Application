import { PrismaClient } from "@/lib/generated/prisma";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function GET(request) {
    try {
        const users = await prisma.user.findMany();
        return new Response(JSON.stringify(users), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
}

export async function POST(request) {
    const body = await request.json();
    try {
        body.password = await bcrypt.hash(body.password, 10);
        const user = await prisma.user.create({
            data: body,
        });
        return new Response(JSON.stringify(user), {
            status: 201,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("Error creating user:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
}