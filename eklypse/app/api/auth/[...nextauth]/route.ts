import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// Force dynamic so Turbopack compiles and serves this route immediately
// instead of lazily — prevents CLIENT_FETCH_ERROR on first page load.
export const dynamic = 'force-dynamic';

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
