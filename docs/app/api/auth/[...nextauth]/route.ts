// import NextAuth, { type NextAuthOptions } from "next-auth";
// import CredentialsProvider from 'next-auth/providers/credentials';
// import GoogleProvider from 'next-auth/providers/google';
// //import mysql from 'mysql2/promise';
// import {connectDB} from '@/config/db';
// import bcrypt from 'bcrypt';


// const authOptions: NextAuthOptions = {
//   providers: [
//     // Google OAuth
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID as string,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
//     }),
//     CredentialsProvider({
//       name: 'Credentials',
//       credentials: {
//         email: { label: 'Email', type: 'text' },
//         password: { label: 'Password', type: 'password' },
//       },
//       async authorize(credentials) {
//         if (!credentials) return null;
//         const { email, password } = credentials as { email?: string; password?: string };
//         if (!email || !password) return null;

//         // If demo env vars are defined, validate against them first
//         const demoEmail = process.env.NEXTAUTH_DEMO_EMAIL;
//         const demoPass = process.env.NEXTAUTH_DEMO_PASSWORD;
//         if (demoEmail && demoPass) {
//           if (email === demoEmail && password === demoPass) {
//             return { id: '1', name: demoEmail.split('@')[0], email };
//           }
//           return null;
//         }

//         // Otherwise validate against MySQL `users` table.
//         // Requires these env vars: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT (optional)
//         try {
//           const db = await connectDB();
//           const [rows] = await db.execute(
//             'SELECT id, email, password_hash, name FROM users WHERE email = ? LIMIT 1',
//             [email]
//           );

//           const userRow = Array.isArray(rows) && (rows as any[])[0];
//           if (!userRow) return null;

//           const match = await bcrypt.compare(password, userRow.password_hash);
//           if (!match) {
//             console.log('authorize: password mismatch for', email);
//             return null;
//           }

//           return { id: String(userRow.id), email: userRow.email, name: userRow.name };
//         } catch (err) {
//           console.error('Auth DB error', err);
//           return null;
//         }
//       },
//     }),
//   ],
//   session: { strategy: 'jwt' },
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.user = user;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (token && (token as any).user) {
//         // Ensure session.user includes DB id when possible
//         (session as any).user = (token as any).user;
//         try {
//           const email = (token as any).user.email;
//           if (email) {
//             const db = await connectDB();
//             const [rows] = await db.execute('SELECT id FROM users WHERE email = ? LIMIT 1', [email]);
//             const userRow = Array.isArray(rows) && (rows as any[])[0];
//             if (userRow) {
//               (session as any).user.id = userRow.id;
//             }
//           }
//         } catch (err) {
//           console.error('session callback DB lookup error', err);
//         }
//       }
//       return session;
//     },
//     // Upsert OAuth users into `users` table so they exist in our DB
//     async signIn({ user, account, profile }) {
//       try {
//         if (account && account.provider !== 'credentials') {
//           const db = await connectDB();
//           const email = (user as any).email;
//           const name = (user as any).name || null;
//           if (email) {
//             await db.execute(
//               'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE name = VALUES(name)',
//               [email, '', name]
//             );
//           }
//         }
//       } catch (err) {
//         console.error('signIn upsert error', err);
//       }
//       return true;
//     },
//   },
//   pages: {
//     signIn: '/login',
//   },
// };

// const handler = NextAuth(authOptions as any);

// export { handler as GET, handler as POST };



import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "@/config/db";
import bcrypt from "bcrypt";

export const runtime = "nodejs"; // 🔥 REQUIRED

const providers = [];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

providers.push(
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "text" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null;

      try {
        const db = await connectDB();
        const [rows] = await db.execute(
          "SELECT id, email, password_hash, name FROM users WHERE email = ? LIMIT 1",
          [credentials.email]
        );

        const user = (rows as any[])[0];
        if (!user) return null;

        const match = await bcrypt.compare(credentials.password, user.password_hash);
        if (!match) return null;

        return { id: String(user.id), email: user.email, name: user.name };
      } catch (err) {
        console.error("Auth error:", err);
        return null;
      }
    },
  })
);

export const authOptions: NextAuthOptions = {
  providers,
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },
    async session({ session, token }) {
      if (token?.user) session.user = token.user as any;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
