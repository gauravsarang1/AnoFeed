import UserModel from "@/src/models/User.models";
import dbConnect from "@/libs/dbConect";
import { Message } from "@/src/models/User.models";

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { username, content } = await request.json();
        if (!username || !content) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Username and message are required',
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const user = await UserModel.findOne({username});
        if (!user) {
            return new Response(JSON.stringify({
                success: false,
                message: 'User not found',
            }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        if (!user.isAcceptMessages) {
            return new Response(JSON.stringify({
                success: false,
                message: 'User has disabled message reception',
            }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const newMessage = {content, createdAt: new Date()};
        user.Messages.push(newMessage as Message);
        await user.save();

        return new Response(JSON.stringify({
            success: true,
            message: 'Message sent successfully',
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