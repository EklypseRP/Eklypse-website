import { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { getDb } from "@/lib/mongodb"; // On importe la nouvelle fonction

const GUILD_ID = process.env.DISCORD_GUILD_ID;
const ROLE_MEMBER = "1462127752818856210";
const ROLE_RECRUITER = "1463113069793120376";
const ROLE_ADMIN = "1462183804696396030";

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: "https://discord.com/api/oauth2/authorize?scope=identify+email+guilds.members.read",
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }: any) {
      try {
        const memberRes = await fetch(
          `https://discord.com/api/users/@me/guilds/${GUILD_ID}/member`,
          { headers: { Authorization: `Bearer ${account.access_token}` } }
        );

        if (!memberRes.ok) return "/unauthorized"; 

        const memberData = await memberRes.json();
        const roles = memberData.roles || [];

        if (!roles.includes(ROLE_MEMBER)) return "/unauthorized";

        // APPEL DYNAMIQUE : On récupère la DB configurée
        const db = await getDb();
        
        await db.collection("users").updateOne(
          { email: user.email },
          { 
            $set: { 
              discordId: profile.id,
              name: user.name,
              image: user.image,
              lastLogin: new Date()
            } 
          },
          { upsert: true }
        );

        return true;
      } catch (e) { 
        return "/unauthorized"; 
      }
    },
    async jwt({ token, account, profile }: any) {
      if (account && profile) {
        token.discordId = profile.id;
        const memberRes = await fetch(
          `https://discord.com/api/users/@me/guilds/${GUILD_ID}/member`,
          { headers: { Authorization: `Bearer ${account.access_token}` } }
        );
        if (memberRes.ok) {
          const memberData = await memberRes.json();
          const roles = memberData.roles || [];
          token.roles = roles;
          token.isAdmin = roles.includes(ROLE_ADMIN);
          token.isRecruiter = roles.includes(ROLE_RECRUITER) || roles.includes(ROLE_ADMIN);
        }
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token && session.user) {
        session.user.discordId = token.discordId;
        session.user.isAdmin = token.isAdmin;
        session.user.isRecruiter = token.isRecruiter;
      }
      return session;
    },
  },
  pages: { signIn: '/login', error: '/unauthorized' },
  session: { strategy: "jwt" },
};