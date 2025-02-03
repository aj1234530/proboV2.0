// import { NextRequest, NextResponse } from "next/server";

// export function GET(req: NextRequest, args: any) {
//   console.log(args.params.authRoutes); //return an array of params
//   return NextResponse.json({
//     message: "asdas",
//   });
// }
import NextAuth from "next-auth";
import { NEXT_AUTH_CONFIG } from "../../../lib/auth";
const handler = NextAuth(NEXT_AUTH_CONFIG);
export { handler as GET, handler as POST };

//steps
//1. give next auth access to all the routes
//2. handler  boiler plate and export as get and post
