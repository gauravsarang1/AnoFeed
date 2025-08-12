import UserModel from "@/src/models/User.models";
import dbConnect from "@/src/lib/dbConect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/options";

export async function GET(request: Request) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Unauthorized',
            }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const user = await UserModel.aggregate([
            { $match: { username: session.user.username } },
            { $unwind: "$Messages" },
            {
                $project: {
                    _id: 0,
                    content: "$Messages.content",
                    createdAt: "$Messages.createdAt",
                }
            },
            { $sort: { "createdAt": -1 } } // Sort messages by creation date, newest first
        ])

        return new Response(JSON.stringify({
            success: true,
            messages: user[0]?.Messages || [],
            message: 'Messages retrieved successfully',
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error("Error processing request:", error);
        return new Response(JSON.stringify({
            success: false,
            message: 'Internal server error',
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}