import UserModel from "@/src/models/User.models";
import dbConnect from "@/src/lib/dbConect";

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { userId, isAcceptMessages } = await request.json();
        if (!userId) {
            return new Response(JSON.stringify({
                success: false,
                message: 'User ID is required',
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return new Response(JSON.stringify({
                success: false,
                message: 'User not found',
            }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        user.isAcceptMessages = isAcceptMessages; // Assuming this field is used to accept messages
        await user.save();

        return new Response(JSON.stringify({
            success: true,
            message: isAcceptMessages ? 'You will now receive messages' : 'You will no longer receive messages',
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