import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id?: string;
            email?: string;
            username?: string;
            isVerified?: boolean;
            isAcceptMessage?: boolean;
        } & NextAuth.DefaultSession["user"];
    }
    interface User {
        id?: string;
        email?: string;
        username?: string;
        isVerified?: boolean;
        isAcceptMessage?: boolean;
    }
    interface Token {
        id?: string;
        email?: string;
        username?: string;
        isVerified?: boolean;
        isAcceptMessage?: boolean;
    }
}