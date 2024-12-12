import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in",
  "/sign-up",
  "/",
  "/home",
]);

const isPublicApiRoute = createRouteMatcher(["/api/video"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  const currentUrl = new URL(req.url);
  const isApiRequest = currentUrl.pathname.startsWith("/api");

  // If the user is logged in and tries to access sign-in or sign-up, redirect to /home
  if (userId && isPublicRoute(req)) {
    if (
      currentUrl.pathname === "/sign-in" ||
      currentUrl.pathname === "/sign-up"
    ) {
      return NextResponse.redirect(new URL("/home", req.url));
    }
  }

  // If the user is not logged in:
  if (!userId) {
    // Redirect from protected routes to sign-in
    if (!isPublicRoute(req) && !isPublicApiRoute(req)) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    // For protected API routes, return a 401 Unauthorized response
    if (isApiRequest && !isPublicApiRoute(req)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  }

  // Proceed to the next middleware or route
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};