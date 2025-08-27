import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { NextAuthOptions } from 'next-auth'

const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                // This is a demo implementation. In production, validate against your database
                if (credentials?.email && credentials?.password) {
                    // Demo users for testing
                    const demoUsers = [
                        { id: '1', email: 'demo@example.com', password: 'demo123', name: 'Demo User' },
                        { id: '2', email: 'user@dashboard.com', password: 'user123', name: 'Dashboard User' }
                    ]

                    const user = demoUsers.find(
                        u => u.email === credentials.email && u.password === credentials.password
                    )

                    if (user) {
                        return {
                            id: user.id,
                            email: user.email,
                            name: user.name,
                        }
                    }
                }
                return null
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        })
    ],
    pages: {
        signIn: '/auth/signin',
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (token && session.user) {
                (session.user as any).id = token.id as string
            }
            return session
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
