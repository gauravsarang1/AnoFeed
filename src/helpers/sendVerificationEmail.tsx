import VerificationEmail from '../../email/VerificationEmail';
import resend from '../../libs/resend';
import { ApiResponse } from '../types/ApiResponse';


export default async function sendVerificationEmail(
    email: string,
    username: string,
    otp: string
):Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'Verification Code',
            react: <VerificationEmail username={username} otp={otp} />,
        })
        return {
            success: true,
            message: 'Verification email sent successfully.',
            isAcceptMessage: true,
        };
    } catch (error) {
        console.error('Error sending verification email:', error);
        return {
            success: false,
            message: 'Failed to send verification email.',
        }
    }
}