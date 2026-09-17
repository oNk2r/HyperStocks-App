import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
    const sessionCookie = getSessionCookie(request);
    const { pathname } = request.nextUrl;

    const isAuthRoute =
        pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

    // Unauthenticated user attempting to access protected route -> redirect to /sign-in
    if (!sessionCookie && !isAuthRoute) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // Authenticated user attempting to access auth page -> redirect to dashboard
    if (sessionCookie && isAuthRoute) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|assets).*)",
    ],
};
