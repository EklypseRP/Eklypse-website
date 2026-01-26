import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    
    // 1. Vérifier si l'utilisateur est connecté
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const data = await req.json();
    const client = await clientPromise;
    const db = client.db("Eklypse");

    // 2. LA MÉTHODE "COMME POUR LES USERS" : 
    // On va chercher l'utilisateur dans la collection "users" par son email
    // pour récupérer son discordId qui y est déjà bien enregistré.
    const userInDb = await db.collection("users").findOne({ 
      email: session.user.email 
    });

    if (!userInDb || !userInDb.discordId) {
      console.error("Impossible de trouver le discordId pour cet utilisateur en base.");
      return NextResponse.json({ error: "Profil utilisateur incomplet" }, { status: 400 });
    }

    // 3. Insertion dans la collection "candid"
    // On utilise l'ID que l'on vient de récupérer directement en base de données
    const result = await db.collection("candid").insertOne({
      ...data,
      userEmail: session.user.email,
      userName: session.user.name,
      discordId: userInDb.discordId, // Utilisation de l'ID provenant de la collection "users"
      submittedAt: new Date(),
      status: "en_attente"
    });

    console.log("Candidature enregistrée avec succès pour :", userInDb.discordId);

    return NextResponse.json({ success: true, id: result.insertedId });
  } catch (e) {
    console.error("Erreur lors de l'envoi de la candidature:", e);
    return NextResponse.json({ error: "Erreur lors de l'envoi" }, { status: 500 });
  }
}