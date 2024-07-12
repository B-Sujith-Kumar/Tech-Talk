import { authMiddleware } from "@clerk/nextjs";
import { pathToRegexp } from "path-to-regexp";

export default authMiddleware({
    publicRoutes: [
        "/",
        "/api/webhook/clerk",
        "/api/uploadthing",
        pathToRegexp("/post/:id")
    ],
    ignoredRoutes: [
        "/api/webhook/clerk",
        "/api/uploadthing"
    ],
});

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}