import dbConnect from "@/libs/dbConect";
import UserModel from "@/src/models/User.models";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { email, password } = await request.json();
        if (!email || !password) {
            return new Response(JSON.stringify({
                success: false,
                message: 'All fields are required',
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        const notVerifiedUser = await UserModel.findOne({ email, isVerified: false });
        if (notVerifiedUser) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Email not verified. Please verify your email before signing in.',
            }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        const existingUser = await UserModel.findOne({ email, isVerified: true });
        if (!existingUser) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Invalid email or user not verified',
            }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Invalid password',
            }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        return new Response(JSON.stringify({
            success: true,
            message: 'Sign-in successful',
            user: {
                id: existingUser._id,
                email: existingUser.email,
                username: existingUser.username,
            },
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error during sign-in:', error);
        return new Response(JSON.stringify({
            success: false,
            message: 'Internal server error',
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}