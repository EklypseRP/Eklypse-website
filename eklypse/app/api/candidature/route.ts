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

    const { id, rpName, age, lore, isFinalSubmit, skinUrl } = await req.json();

    // --- SÉCURITÉS & VALIDATIONS ---
    const cleanRpName = String(rpName).replace(/[0-9]/g, '').trim();
    const numericAge = parseInt(age);
    
    if (isFinalSubmit) {
      if (cleanRpName.length < 2) {
        return NextResponse.json({ error: "Nom RP invalide." }, { status: 400 });
      }
      if (isNaN(numericAge) || numericAge < 16) {
        return NextResponse.json({ error: "Âge invalide (Min. 16 ans)." }, { status: 400 });
      }
      // Vérification Lore vide (on vérifie si l'objet lore existe et n'est pas juste un paragraphe vide)
      if (!lore || (lore.content && lore.content.length === 0)) {
        return NextResponse.json({ error: "Le récit ne peut pas être vide." }, { status: 400 });
      }
    }

    const client = await clientPromise;
    const db = client.db("Eklypse");

    const userInDb = await db.collection("users").findOne({ 
      email: session.user.email 
    });

    if (!userInDb || !userInDb.discordId) {
      return NextResponse.json({ error: "Profil Discord non lié." }, { status: 400 });
    }

    // Vérification des candidatures en attente
    const searchFilter: any = { 
      discordId: userInDb.discordId,
      status: "en_attente"
    };
    if (id) {
      searchFilter._id = { $ne: new ObjectId(id) };
    }
    const pendingCandid = await db.collection("candid").findOne(searchFilter);

    if (isFinalSubmit && pendingCandid) {
      return NextResponse.json(
        { error: "Vous avez déjà une candidature en cours d'examen." }, 
        { status: 403 }
      );
    }

    // --- PRÉPARATION DU DOCUMENT ---
    const candidDocument: any = {
      rpName: cleanRpName.substring(0, 100),
      age: numericAge,
      lore: lore, 
      skinUrl: skinUrl || null,
      userEmail: session.user.email,
      userName: session.user.name,
      userImage: session.user.image,
      discordId: userInDb.discordId,
      status: isFinalSubmit ? "en_attente" : "brouillon",
      updatedAt: new Date(),
    };

    if (isFinalSubmit) {
      candidDocument.submittedAt = new Date();
      
      // LOGIQUE : Récupérer l'ancien motif si on modifie une candidature refusée
      if (id) {
        const existingCandid = await db.collection("candid").findOne({ 
          _id: new ObjectId(id),
          discordId: userInDb.discordId 
        });

        if (existingCandid && existingCandid.status === "refuse") {
          // On archive l'ancien motif dans 'lastRefusalReason'
          candidDocument.lastRefusalReason = existingCandid.refusalReason;
        }
      }

      candidDocument.refusalReason = null; 
      candidDocument.reviewedByName = null; 
      candidDocument.reviewedAt = null;
    }

    // --- ENREGISTREMENT ---
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