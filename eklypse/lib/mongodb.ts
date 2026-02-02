import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI as string;
const dbName = process.env.MONGODB_DB || "Eklypse"; // Valeur par défaut si non définie

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error('Veuillez ajouter votre MONGODB_URI à .env.local');
}

if (process.env.NODE_ENV === 'development') {
  if (!(global as any)._mongoClientPromise) {
    client = new MongoClient(uri);
    (global as any)._mongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._mongoClientPromise;
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

/**
 * Utilise cette fonction partout pour obtenir la base de données
 * sans jamais écrire son nom en dur dans les autres fichiers.
 */
export async function getDb() {
  const client = await clientPromise;
  return client.db(dbName);
}

export default clientPromise;