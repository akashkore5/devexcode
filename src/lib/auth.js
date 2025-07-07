import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import bcrypt from 'bcrypt';
import { sendWelcomeEmail } from './email';

export async function getAuthOptions({ db, mongoClient }) {
  if (!mongoClient) {
    console.error('getAuthOptions: No MongoClient instance provided');
    throw new Error('MongoClient instance is required for MongoDBAdapter');
  }

  

  return {
    adapter: MongoDBAdapter(mongoClient),
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        authorization: {
          params: {
            access_type: 'offline',
            response_type: 'code',
          },
        },
      }),
      CredentialsProvider({
        name: 'Credentials',
        credentials: {
          email: { label: 'Email', type: 'email' },
          password: { label: 'Password', type: 'password' },
        },
        async authorize(credentials) {
          
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Email and password are required');
          }

          try {
            const user = await db.collection('users').findOne(
              { email: credentials.email },
              { projection: { password: 1, email: 1, name: 1 } }
            );

            if (!user || !user.password) {
              throw new Error('Invalid email or password');
            }

            const isMatch = await bcrypt.compare(credentials.password, user.password);
            if (!isMatch) {
              throw new Error('Invalid email or password');
            }

            
            return {
              id: user._id.toString(),
              email: user.email,
              name: user.name,
            };
          } catch (error) {
            console.error('CredentialsProvider: Authorization error:', error.message);
            throw error;
          }
        },
      }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
      strategy: 'jwt',
      maxAge: 7 * 24 * 60 * 60,
      updateAge: 24 * 60 * 60,
    },
    callbacks: {
      async jwt({ token, user, account }) {
        if (user) {
          token.email = user.email;
          token.name = user.name;
          token.id = user.id;
        }
        if (account?.provider === 'google') {
          token.googleId = account.providerAccountId;
        }
        return token;
      },
      async session({ session, token }) {
        if (token.email) {
          session.user = {
            id: token.id,
            email: token.email,
            name: token.name,
            googleId: token.googleId,
          };
        }
        return session;
      },
    },
    events: {
      async createUser({ user }) {
        
        try {
          await sendWelcomeEmail(user.email, user.name || user.email.split('@')[0]);
          
        } catch (error) {
          console.error('createUser: Failed to send welcome email:', error.message);
          // Do not throw error to avoid blocking user creation
        }
      },
    },
    pages: {
      signIn: '/',
      error: '/auth/error',
    },
    debug: process.env.NODE_ENV === 'development',
    cookies: {
      sessionToken: {
        name: `next-auth.session-token`,
        options: {
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          secure: process.env.NODE_ENV === 'production',
        },
      },
    },
    jwt: {
      maxAge: 60 * 60 * 24 * 7,
    },
  };
}