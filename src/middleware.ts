import { authMiddleware } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

interface UserMetadata {
    role: string;
    organization: string;
}

export default authMiddleware({
    async afterAuth(auth, req: NextRequest) {
        // Define public routes
        const publicRoutes = ["/", "/login", "/signup", "/forgot-password","/calendar"];

        // Define route-specific permissions
        const routePermissions: { [key: string]: string[] } = {
            "/admin": ["admin"],
            "/eventDetails": ["admin", "user"],
            "/eventBar": ["admin", "user"],
            // "/calendar": ["admin", "user"],
            "/confirmation-page": ["pending"],
        };

        // Check if the current route is public
        const isPublicRoute = publicRoutes.includes(req.nextUrl.pathname);

        // Check if the user is authenticated
        if (!auth.userId && !isPublicRoute) {
            // Redirect unauthenticated users to sign-in page
            const url = new URL("/login", req.url);
            return NextResponse.redirect(url);
        }

        // Check if the user has access to the current route
        const requiredRoles = routePermissions[req.nextUrl.pathname];
        const metadata = auth?.sessionClaims?.unsafe_metadata as UserMetadata;
        const role = metadata?.role;
        if (requiredRoles && !requiredRoles.includes(role)) {
            // Redirect users without the required role to a forbidden page or homepage
            const url = new URL("/login", req.url);
            return NextResponse.redirect(url);
        }

        // Allow access to the requested route
        return NextResponse.next();
    },
});

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
