import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; 

export async function GET() {
  try {
    // 1. RÉCUPÉRATION DE LA SESSION AVEC LA CONFIG CENTRALISÉE
    const session: any = await getServerSession(authOptions);

    // 2. VÉRIFICATION DES PERMISSIONS
    if (!session || !session.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    // On vérifie le rôle de recruteur (synchronisé avec les rôles Discord)
    if (!session.user.isRecruiter) {
      return NextResponse.json({ error: "Permissions insuffisantes" }, { status: 403 });
    }

    // 3. CONNEXION À LA BASE DE DONNÉES
    const client = await clientPromise;
    const db = client.db("Eklypse"); 

    // 4. RÉCUPÉRATION DES DONNÉES
    // Récupère les documents avec les champs discordId, email, et lore
    const candidatures = await db
      .collection("candid")
      .find({})
      .sort({ submittedAt: -1, updatedAt: -1 }) 
      .toArray();

    // 5. RÉPONSE
    return NextResponse.json(candidatures);

  } catch (error) {
    console.error("[API_ADMIN_CANDIDATURES_GET] :", error);
    return NextResponse.json(
      { error: "Erreur technique lors de la récupération du Codex." }, 
      { status: 500 }
    );
  }
}