import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("Eklypse");
    
    // On récupère la candidature existante (brouillon ou soumise)
    const candidature = await db.collection("candid").findOne({ 
      userEmail: session.user.email 
    });

    return NextResponse.json(candidature || { status: 'none' });
  } catch (e) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { rpName, age, motivations, isFinalSubmit } = await req.json();
    const client = await clientPromise;
    const db = client.db("Eklypse");

    // Récupération du discordId de l'utilisateur
    const userInDb = await db.collection("users").findOne({ 
      email: session.user.email 
    });

    if (!userInDb || !userInDb.discordId) {
      return NextResponse.json({ error: "Profil utilisateur incomplet" }, { status: 400 });
    }

    // Vérification : si une candidature est déjà "en_attente", on bloque toute modification
    const existingCandid = await db.collection("candid").findOne({ userEmail: session.user.email });
    if (existingCandid && existingCandid.status === "en_attente") {
      return NextResponse.json({ error: "Candidature verrouillée car en cours de review" }, { status: 403 });
    }

    const updateData: any = {
      rpName,
      age,
      motivations,
      userEmail: session.user.email,
      userName: session.user.name,
      discordId: userInDb.discordId,
      updatedAt: new Date(),
    };

    // Si c'est un envoi final, on change le statut et on fixe la date de soumission
    if (isFinalSubmit) {
      updateData.status = "en_attente";
      updateData.submittedAt = new Date();
    } else {
      updateData.status = "brouillon";
    }

    const result = await db.collection("candid").updateOne(
      { userEmail: session.user.email },
      { $set: updateData },
      { upsert: true }
    );

    return NextResponse.json({ 
      success: true, 
      status: updateData.status,
      id: result.upsertedId || existingCandid?._id 
    });
  } catch (e) {
    console.error("Erreur candidature:", e);
    return NextResponse.json({ error: "Erreur lors de l'enregistrement" }, { status: 500 });
  }
}