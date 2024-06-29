import { authMiddleware } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

interface UserMetadata {
    role: string;
}

export default authMiddleware({
    async afterAuth(auth, req: NextRequest) {
        // Define public routes
        const publicRoutes = [
            "/",
            "/login",
            "/signup",
            "/forgot-password",
            "/api/s3-upload/route",
            "/api/test",
            "/api/users/eventRoutes",
            "/api/s3-upload/test",
            "/publicCalendar",
            "/eventDetails",
        ];

        // Define route-specific permissions
        const routePermissions: { [key: string]: string[] } = {
            "/admin": ["admin"],
            "/adminEvents": ["admin"],
            "/eventBar": ["admin", "approved"],
            "/calendar": ["admin", "approved"],
            "/confirmation-page": ["pending"],
            "/adminAccounts": ["admin"],
            "/declined": ["declined"],
        };

        // Check if the current route is public
        const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname);

        // Check if the user is authenticated
        if (!auth.userId && !isPublicRoute) {
            // Redirect unauthenticated users to sign-in page
            const url = new URL("/", req.url);
            return NextResponse.redirect(url);
        }

        // Check if the user has access to the current route
        const requiredRoles = routePermissions[req.nextUrl.pathname];
        const metadata = auth?.sessionClaims?.public_metadata as UserMetadata;
        const role = metadata?.role || "pending";
        if (requiredRoles && !requiredRoles.includes(role)) {
            // Redirect users without the required role to a forbidden page or homepage
            const url = new URL("/", req.url);
            return NextResponse.redirect(url);
        }

        // Allow access to the requested route
        return NextResponse.next();
    },
});

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
