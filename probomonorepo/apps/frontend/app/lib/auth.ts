import { console } from "inspector";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const NEXT_AUTH_CONFIG = {
  providers: [
    CredentialsProvider({
      name: "creadentials", //LEARN - what is this name ?
      credentials: {
        email: { label: "email", type: "email", placeholder: "email" },
        password: {
          label: "password",
          type: "pssword",
          placeholder: "password",
        },
      },
      async authorize(creadentials: any) {
        try {
          const response: any = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/signin`,
            {
              method: "POST",
              //because of not specify content type in headesr i was stuck here
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: creadentials.email,
                password: creadentials.password,
              }),
            }
          );

          if (!response.ok) {
            // console.log("response not ok");
            return null;
          }
          // console.log("response ok");
          const responseJson = await response.json();

          return {
            id: responseJson.userId,
            email: responseJson.email,
          };
        } catch (error) {
          console.log("error", error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    // async jwt({ token, user, account, profile, isNewUser }) {
    //   console.log(1, token, 2, user, 3, account, 4, profile, 5, isNewUser);
    //   return token;
    // },
    async session({ session, token, user }: any) {
      // console.log(1, session, 2, session.user);
      if (session && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
};
