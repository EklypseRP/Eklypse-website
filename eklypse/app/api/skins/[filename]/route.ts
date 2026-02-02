// eklypse/app/api/skins/[filename]/route.ts
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  const filePath = path.join(process.cwd(), "public", "uploads", "skins", filename);

  try {
    const fileBuffer = await fs.readFile(filePath);
    
    // On retourne le fichier avec le bon header MIME
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Erreur lors de la lecture du skin:", error);
    return NextResponse.json({ error: "Skin non trouvé" }, { status: 404 });
  }
}