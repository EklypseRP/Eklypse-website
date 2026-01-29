import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const session: any = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("Eklypse");
    
    const userInDb = await db.collection("users").findOne({ 
      email: session.user.email 
    });

    if (!userInDb || !userInDb.discordId) {
      return NextResponse.json({ exists: false, history: [] });
    }

    const history = await db.collection("candid")
      .find({ discordId: userInDb.discordId })
      .sort({ submittedAt: -1, updatedAt: -1 })
      .toArray();

    return NextResponse.json({ 
      exists: history.length > 0, 
      history: history 
    });
  } catch (e) {
    console.error("Erreur GET candidature:", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session: any = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id, rpName, age, lore, isFinalSubmit } = await req.json();

    const numericAge = parseInt(age);
    if (isNaN(numericAge) || numericAge < 16) {
      return NextResponse.json({ error: "Âge invalide (Min. 16 ans)." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("Eklypse");

    const userInDb = await db.collection("users").findOne({ 
      email: session.user.email 
    });

    if (!userInDb || !userInDb.discordId) {
      return NextResponse.json({ error: "Profil Discord non lié." }, { status: 400 });
    }

    // --- CORRECTION DE L'ERREUR TYPESCRIPT ICI ---
    // On construit le filtre dynamiquement pour éviter le "null" dans $ne
    const searchFilter: any = { 
      discordId: userInDb.discordId,
      status: "en_attente"
    };

    if (id) {
      searchFilter._id = { $ne: new ObjectId(id) };
    }

    const pendingCandid = await db.collection("candid").findOne(searchFilter);
    // ----------------------------------------------

    if (isFinalSubmit && pendingCandid) {
      return NextResponse.json(
        { error: "Vous avez déjà une candidature en cours d'examen." }, 
        { status: 403 }
      );
    }

    const candidDocument: any = {
      rpName: String(rpName).substring(0, 100),
      age: numericAge,
      lore: lore, 
      userEmail: session.user.email,
      userName: session.user.name,
      userImage: session.user.image,
      discordId: userInDb.discordId,
      status: isFinalSubmit ? "en_attente" : "brouillon",
      updatedAt: new Date(),
    };

    if (isFinalSubmit) {
      candidDocument.submittedAt = new Date();
      candidDocument.refusalReason = null; 
      candidDocument.reviewedByName = null; 
      candidDocument.reviewedAt = null;
    }

    if (id) {
      await db.collection("candid").updateOne(
        { _id: new ObjectId(id), discordId: userInDb.discordId },
        { $set: candidDocument }
      );
    } else {
      if (isFinalSubmit) {
        await db.collection("candid").insertOne(candidDocument);
      } else {
        await db.collection("candid").updateOne(
          { discordId: userInDb.discordId, status: "brouillon" },
          { $set: candidDocument },
          { upsert: true }
        );
      }
    }

    return NextResponse.json({ 
      success: true, 
      status: candidDocument.status 
    });

  } catch (e) {
    console.error("Erreur POST candidature:", e);
    return NextResponse.json({ error: "Échec de l'enregistrement." }, { status: 500 });
  }
}