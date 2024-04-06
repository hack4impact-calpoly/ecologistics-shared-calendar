import { authMiddleware } from "@clerk/nextjs";
export default authMiddleware({
    publicRoutes: [
        "/",
        "/login",
        "/signup",
        "/confirmation-page",
        "/forgot_password",
    ],
});

export const config = {
    matcher: [],
};
