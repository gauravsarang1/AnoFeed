export { default } from "next-auth/middleware"
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const config = { matcher: ["/dashboard/:path*", "/sign-in", "/sign-up"] }

export async function middleware(request: NextRequest) {
    const token = await getToken({req: request});
    const url = request.nextUrl

    if (!token) {
        if (url.pathname.startsWith("/dashboard")) {
            url.pathname = "/sign-in";
            return NextResponse.redirect(new URL("/sign-in", request.url));
        }
    } else {
        if (url.pathname === "/auth/sign-in" || url.pathname === "/auth/sign-up") {
            url.pathname = "/dashboard";
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
    }

    return NextResponse.next();
}