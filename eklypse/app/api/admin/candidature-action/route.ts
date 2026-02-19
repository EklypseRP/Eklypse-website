import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; 
import { ObjectId } from "mongodb";

export async function POST(req: Request) {
  try {
    const session: any = await getServerSession(authOptions);

    // 1. VÉRIFICATION DES DROITS RECRUTEUR
    if (!session || !session.user?.isRecruiter) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const { id, status, reason } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("Website");

    // 2. RÉCUPÉRATION DE LA CANDIDATURE
    // Nécessaire pour obtenir l'ID Discord du joueur et pouvoir le mentionner
    const candidature = await db.collection("candid").findOne({ _id: new ObjectId(id) });
    
    if (!candidature) {
      return NextResponse.json({ error: "Candidature introuvable" }, { status: 404 });
    }

    // 3. MISE À JOUR DE LA CANDIDATURE
    await db.collection("candid").updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status: status,
          refusalReason: status === 'refuse' ? reason : null,
          reviewedAt: new Date(),
          reviewedBy: session.user.discordId,
          reviewedByName: session.user.name || "Recruteur Inconnu" 
        } 
      }
    );

    // 4. ENVOI DU MESSAGE DISCORD
    // Note : On suppose que l'ID Discord du joueur est stocké dans le champ `discordId` de la candidature
    const applicantDiscordId = candidature.discordId; 
    const botToken = process.env.DISCORD_BOT_TOKEN; 

    // On n'envoie le message que si la candidature passe à un statut finalisé (validé ou refusé)
    if (botToken && applicantDiscordId && (status === 'valide' || status === 'refuse')) {
      const channelId = "1474101725366456382";
      const siteUrl = process.env.NEXTAUTH_URL || "https://eklypse.xyz/"; // Lien vers ton site
      
      const message = `Salut <@${applicantDiscordId}> ! Ta candidature a été traitée par notre équipe de recrutement. Rends-toi vite sur le site d'Eklypse pour découvrir la réponse : ${siteUrl}\nSi tu as la moindre question suite à cette décision, n'hésite pas à ouvrir un ticket recrutement !`;

      // Requête HTTP vers l'API de Discord
      await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
        method: "POST",
        headers: {
          "Authorization": `Bot ${botToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: message,
        }),
      }).catch((err) => console.error("Erreur lors de l'envoi du message Discord:", err));
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Erreur API Action:", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}