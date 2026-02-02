import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import clientPromise from "@/lib/mongodb";
import CandidatureClient from "./CandidatureClient";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CandidaturePage() {
  const session: any = await getServerSession();

  // 1. Vérification session
  if (!session || !session.user?.email) {
    redirect('/login');
  }

  // 2. Vérification DB (C'est ça qui manquait pour le kick immédiat)
  const client = await clientPromise;
  const db = client.db("Website");
  const userInDb = await db.collection("users").findOne({ 
    email: session.user.email 
  });

  if (!userInDb) {
    redirect('/login');
  }

  // Si tout est OK, on affiche le design client
  return <CandidatureClient user={session.user} />;
}