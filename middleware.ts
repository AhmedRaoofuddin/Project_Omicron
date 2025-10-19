import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Check if demo mode is enabled
const isDemoMode = process.env.DEV_DEMO_MODE === '1';

// Demo mode middleware (bypass Clerk)
function demoMiddleware(req: NextRequest) {
  // In demo mode, allow all routes
  return NextResponse.next();
}

// Use demo middleware if in demo mode, otherwise use Clerk
export default isDemoMode
  ? demoMiddleware
  : authMiddleware({
      publicRoutes: ['/']
    });
 
export const config = {
      matcher: ["/((?!.+\\.[\\w]+$|_next).*)","/","/(api|trpc)(.*)"],
};
   