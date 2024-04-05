import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from 'bcrypt';
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import NextAuth from "next-auth"


const prisma = new PrismaClient().$extends(withAccelerate())


const handler = NextAuth({
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/',
        signOut: '/'
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        }),

        // Updated to use Prisma //
        CredentialsProvider({
            name: 'Sign in',
            credentials: {
                email: {},
                password: {}
            },
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials.password) {
                    return null
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                })

                if (!user) {
                    throw new Error("No user found");
                }

                const passwordCorrect = await compare(credentials.password, user.password);

                if (passwordCorrect) {
                    return {
                        id: user.id + '',
                        email: user.email,
                        name: user.firstName + ' ' + user.lastName
                    };
                }
                return null;
            }
        })
    ],
    callbacks: {
        session: ({ session, token }) => {
            console.log('Session Callback', { session, token })
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    randomKey: token.randomKey

                }
            }
        },
        jwt: ({ token, user }) => {
            console.log('JWT Callback', { token, user })
            if (user) {
                const u = user as unknown as any
                return {
                    ...token,
                    id: u.id,
                    randomKey: u.randomKey
                }
            }
            return token
        }
    },

})

export const authOptions = handler;

export { handler as GET, handler as POST }

