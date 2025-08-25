import UserModel from "@/src/models/User.models";
import dbConnect from "@/libs/dbConect";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    if (!username || !username.trim()) {
        return new Response(JSON.stringify({
            success: false,
            message: 'Username is required',
        }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
    try {
        await dbConnect();
        const user = await UserModel.findOne({ username });
        if (!user) {
            return new Response(JSON.stringify({
                success: false,
                message: 'User not found',
            }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        return new Response(JSON.stringify({
            success: true,
            user: user,
            message: 'User found successfully',
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error("Database error:", error);
        return new Response(JSON.stringify({
            success: false,
            message: 'Internal server error',
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}