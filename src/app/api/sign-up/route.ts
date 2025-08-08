import sendVerificationEmail from "@/src/helpers/sendVerificationEmail";
import dbConnect from "@/src/lib/dbConect";


export async function POST(request: Request) {
    try {
        await dbConnect();
        const { email, username, password, otp } = await request.json();
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