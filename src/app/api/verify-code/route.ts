import dbConnect from "@/libs/dbConect";
import UserModel from "@/src/models/User.models";
import { is } from 'zod/locales';

export async function POST(request: Request) {
    const { email, code } = await request.json();
    if (!email.trim() || !code.trim()) {
        return new Response(JSON.stringify({
            success: false,
            message: 'Email and verification code are required',
        }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
    try {
        await dbConnect();
        const verifiedUser = await UserModel.findOne({
            email,
            isVerified: true,
        })

        if(verifiedUser) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Email is already verified',
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const user = await UserModel.findOne({
            email,
            verifyCode: code,
            verifyExpiry: { $gt: new Date() } // Check if the code is still valid
        });


        if (!user) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Invalid verification code or email',
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        return new Response(JSON.stringify({
            success: true,
            message: 'Email verified successfully',
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