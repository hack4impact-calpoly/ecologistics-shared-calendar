import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
    publicRoutes: [
        "/signup",
        "/login",
        "/confirmation_page",
        "/forgot_password",
    ],
    afterAuth(auth, req, evt) {
        const userRole = auth.user?.unsafeMetadata?.role;
        console.log(userRole);
        const protectedRoutes = {
            admin: ["/admin"],
            user: ["/calendar", "/eventDetails", "/eventBar"],
        };

        if (!auth.userId && !auth.isPublicRoute) {
            // Redirect unauthenticated users to the login page
            const loginUrl = new URL("/login", req.url);
            return NextResponse.redirect(loginUrl.href);
        }

        // Allow access to public routes for unauthenticated users
        if (auth.isPublicRoute) {
            return NextResponse.next();
        }

        if (userRole === "admin" && !protectedRoutes.admin.includes(req.url)) {
            // Redirect admin users to admin routes only
            const adminUrl = new URL("/admin", req.url);
            return NextResponse.redirect(adminUrl.href);
        } else if (
            userRole === "user" &&
            !protectedRoutes.user.includes(req.url)
        ) {
            // Redirect user to specific routes for users only
            const calendarUrl = new URL("/calendar", req.url);
            return NextResponse.redirect(calendarUrl.href);
        } else {
            // Allow access to routes based on role
            return NextResponse.next();
        }
    },
});

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
