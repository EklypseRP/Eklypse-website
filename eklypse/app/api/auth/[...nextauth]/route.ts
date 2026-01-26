import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import clientPromise from "@/lib/mongodb";

const GUILD_ID = process.env.DISCORD_GUILD_ID;
const ROLE_MEMBER = "1462127752818856210";
const ROLE_RECRUITER = "1463113069793120376";
const ROLE_ADMIN = "1462183804696396030";

const handler = NextAuth({
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
        // 1. On vérifie si l'utilisateur est sur le Discord
        const memberRes = await fetch(
          `https://discord.com/api/users/@me/guilds/${GUILD_ID}/member`,
          { headers: { Authorization: `Bearer ${account.access_token}` } }
        );
        if (!memberRes.ok) return false;

        const memberData = await memberRes.json();
        const roles = memberData.roles || [];

        // 2. On vérifie s'il a le rôle de base
        if (!roles.includes(ROLE_MEMBER)) return false;

        // 3. Sync avec MongoDB : On enregistre ou on met à jour
        const client = await clientPromise;
        const db = client.db("Eklypse");
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
        console.error("Erreur lors du signIn:", e);
        return false; 
      }
    },

    async jwt({ token, account, profile }: any) {
      // On injecte les rôles et l'ID Discord dans le JWT au moment du login
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
      try {
        const client = await clientPromise;
        const db = client.db("Eklypse");

        // VÉRIFICATION DE L'EXISTENCE EN DB
        const userExists = await db.collection("users").findOne({ email: session.user?.email });

        // SI LE COMPTE N'EXISTE PLUS DANS LA DB :
        // On renvoie uniquement la date d'expiration. Sans l'objet "user", 
        // le frontend comprendra que personne n'est connecté.
        if (!userExists) {
          return { expires: session.expires }; 
        }

        // SI TOUT EST OK : On remplit la session avec les infos du token
        if (token && session.user) {
          session.user.discordId = token.discordId;
          session.user.roles = token.roles;
          session.user.isAdmin = token.isAdmin;
          session.user.isRecruiter = token.isRecruiter;
        }
        
        return session;
      } catch (e) {
        // En cas d'erreur DB (ex: timeout), on renvoie la session par défaut pour ne pas crash
        return session;
      }
    },
  },
  pages: {
    signIn: '/login',
  },
  // Optionnel : Forcer le rafraîchissement de la session plus souvent
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };