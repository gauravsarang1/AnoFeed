import { NextAuthOptions } from "next-auth";
import bcrypt from "bcryptjs";
import dbConnect from "@/src/lib/dbConect";
import UserModel from "@/src/models/User.models";
import  CredentialsProvider  from "next-auth/providers/credentials";



export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "  Enter your email" },
                password: { label: "Password", type: "password", placeholder: "  Enter your password" }
            },
            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.email },
                            { username: credentials.username }
                        ]
                    });
                    if (!user) {
                        throw new Error("No user found with the provided credentials");
                    }
                    if(!user.isVerified) {
                        throw new Error("Please verify your email before logging in");
                    }
                    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
                    if (!isPasswordValid) {
                        throw new Error("Invalid password");
                    }
                    return user;
                } catch (error: any) {
                    throw new Error(`Error fetching user from database, ${error}`);
                }
            }
        })
    ],
    callbacks: {
        async jwt({token, user}) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.username = user.username;
                token.isVerified = user.isVerified;
            }
            return token;
        },
        async session({session, token}) {
            if (token) {
                session.user.id = token.id;
                session.user.email = token.email;
                session.user.username = token.username;
                session.user.isVerified = token.isVerified;
            }
            return session
        }
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "sign-in",
    },
}