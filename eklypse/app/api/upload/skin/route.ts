import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) return NextResponse.json({ error: "Aucun fichier" }, { status: 400 });
    if (!file.type.includes("image/png")) return NextResponse.json({ error: "PNG uniquement" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${uuidv4()}.png`;
    // On cible le dossier public/uploads/skins
    const uploadDir = path.join(process.cwd(), "public", "uploads", "skins");

    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    // Retourne l'URL relative accessible par le navigateur
    return NextResponse.json({ 
      success: true, 
      url: `/uploads/skins/${filename}` 
    });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}