import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";

export async function GET() {
  try {
    // 1. Récupérer la session de l'utilisateur qui fait la requête
    const session: any = await getServerSession();

    // 2. Sécurité : Vérifier si l'utilisateur est connecté ET s'il est recruteur/admin
    if (!session || !session.user || !session.user.isRecruiter) {
      return NextResponse.json(
        { error: "Accès refusé. Droits de recruteur requis." },
        { status: 401 }
      );
    }

    // 3. Connexion à la base de données
    const client = await clientPromise;
    const db = client.db("Eklypse");

    // 4. Récupération des candidatures
    // On les trie par 'submittedAt' en descendant (-1) pour avoir les plus récentes en haut
    const candidatures = await db
      .collection("candid")
      .find({})
      .sort({ submittedAt: -1 }) 
      .toArray();

    // 5. Retourner les données en JSON
    return NextResponse.json(candidatures);

  } catch (error) {
    console.error("Erreur API Admin Candidatures:", error);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la récupération des données." },
      { status: 500 }
    );
  }
}