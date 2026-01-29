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
    const db = client.db("Eklypse");

    // 2. MISE À JOUR DE LA CANDIDATURE
    // On utilise session.user.name qui contient le pseudo Discord (ex: capu0410)
    await db.collection("candid").updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status: status,
          refusalReason: status === 'refuse' ? reason : null,
          reviewedAt: new Date(),
          reviewedBy: session.user.discordId, //
          reviewedByName: session.user.name || "Recruteur Inconnu" 
        } 
      }
    );

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Erreur API Action:", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}