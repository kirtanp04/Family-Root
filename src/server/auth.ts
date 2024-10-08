import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import Google from "next-auth/providers/google";
import { env } from "~/env";

import { User } from "~/app/login/DataObject";
import { db } from "./db";
import { Crypt } from "~/Common/Crypt";
import Credentials from "next-auth/providers/credentials";



declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name: string;
      email: string;

      provider: "GOOGLE" | "CREDENTIAL";
      profileImg: string;
      isEmailVerified: boolean;
      createdAt: Date;
    } & DefaultSession["user"];
  }
  interface Session {
    error?: string;
  }

}

export const authOptions: NextAuthOptions = {
  callbacks: {
    session: async ({ session }) => {

      const isUser = await db.user.findUnique({
        where: {
          email: session.user.email,

        }
      })

      if (isUser !== null) {
        session.user = {
          id: isUser.id,
          name: isUser.name,
          email: isUser.email,
          provider: isUser.provider,
          profileImg: isUser.profileImg || "",
          isEmailVerified: isUser.isEmailVerified,
          createdAt: isUser.createdAt,
        }
      } else {
        session.error = "Server error:While setting session, no such user found";
      }

      return session;
    },
    async signIn(params) {
      try {
        let returnVal: boolean = true;
        if (params.account !== null) {
          if (params.account.provider === "google") {
            if (params.profile?.email !== undefined) {
              const _user = new User();
              _user.name = params.profile.name!;
              _user.email = params.profile.email;
              _user.password = params.user.id;
              _user.provider = "GOOGLE";
              _user.isEmailVerified = true;
              _user.profileImg = params.user.image ?? "";
              _user.createdAt = new Date();

              const isUser = await db.user.findUnique({
                where: {
                  email: _user.email,
                  // provider: _user.provider
                }
              })

              if (isUser !== null && isUser.provider === "CREDENTIAL") {
                returnVal = false
                throw new Error("Error: Email id already used as credential provider");
              }

              if (isUser === null) {
                await db.user.create({
                  data: {
                    email: _user.email,
                    name: _user.name,
                    password: (await Crypt.hashValue(_user.password)).data!,
                    createdAt: _user.createdAt,
                    isEmailVerified: _user.isEmailVerified,
                    profileImg: _user.profileImg,
                    provider: _user.provider
                  }
                })
                returnVal = true
              }

            } else {
              returnVal = false;
              throw new Error("Error: Getting Email id undefine");
            }
          }
        } else {
          returnVal = false
          throw new Error("Getting account value null")
        }

        return returnVal;
      } catch (error: any) {
        throw new Error(error.message || "Session error");

      }
    },
    async redirect({ url, baseUrl }) {
      if (url) {
      }
      return baseUrl;
    },
  },

  providers: [
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      id: 'credentials',
      name: 'Credentials',
      type: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {

        try {

          const { email, password } = credentials as any

          if (email === "" || password === "") {
            throw new Error("Getting credentials value null")

          }

          const user = await db.user.findUnique({
            where: {
              email: email,
              provider: 'CREDENTIAL'
            }
          })

          if (user === null) {
            throw new Error("No such account found. Create new account.")
          }

          if (user.isEmailVerified === false) {
            throw new Error("Your email is not verified. Please verify to active your account")
          }

          const ispassVerify = await Crypt.compareHash(user.password, password)


          if (ispassVerify.error !== "") {
            throw new Error("Invalid password. Make sure you add correct password.")
          }

          return user
        } catch (error: any) {
          throw new Error(error.message || "Login failed.");
        }
      },
    })
  ],
  secret: env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: '/error'
  },
  session: {
    strategy: 'jwt',
  },
};

export const getServerAuthSession = () => getServerSession(authOptions);
