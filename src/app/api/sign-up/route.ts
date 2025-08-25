import sendVerificationEmail from "@/src/helpers/sendVerificationEmail";
import dbConnect from "@/libs/dbConect";
import UserModel from "@/src/models/User.models";
import bcrypt from "bcryptjs";


export async function POST(request: Request) {
    try {
        await dbConnect();
        const { email, username, password } = await request.json();
        if (!email || !username || !password ) {
            return new Response(JSON.stringify({
                success: false,
                message: 'All fields are required',
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        
        /*if (password.length < 6) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Password must be at least 6 characters long',
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Username can only contain letters, numbers, and underscores',
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Invalid email format',
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }*/

        const existingUserVerifiedByUsername = await UserModel.findOne({ username, isVerified: true });
        if (existingUserVerifiedByUsername) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Username already exists',
            }), {
                status: 409,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const existingUserByEmail = await UserModel.findOne({ email });
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
        const hashedPassword = await bcrypt.hash(password, 10);

        if(existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return new Response(JSON.stringify({
                    success: false,
                    message: 'Email already exists',
                }), {
                    status: 409,
                    headers: { 'Content-Type': 'application/json' },
                });
            } else {
                // If the user exists but is not verified, update the OTP and send a new verification email
                existingUserByEmail.username = username; // Update username if needed
                existingUserByEmail.verifyCode = otp;
                existingUserByEmail.password = hashedPassword  // Update password if provided
                existingUserByEmail.verifyExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000); // Set expiry to 1 hour
                await existingUserByEmail.save();
                await sendVerificationEmail(existingUserByEmail.email, username, otp);
                return new Response(JSON.stringify({
                    success: true,
                    message: 'Verification email sent successfully. Please check your email.',
                }), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                });
            }
        } else {
            // If the user does not exist, create a new user
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new UserModel({
                email,
                username,
                password: hashedPassword,
                verifyCode: otp,
                verifyExpiry: new Date(Date.now() + 1 * 60 * 60 * 1000), // Set expiry to 1 hour
            });
            await newUser.save();
            await sendVerificationEmail(email, username, otp);
        }

        return new Response(JSON.stringify({
            success: true,
            message: 'Sign-up successful. Please check your email for verification.',
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Error in sign-up route:', error);
        return new Response(JSON.stringify({
            success: false,
            message: 'Internal server error',
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}