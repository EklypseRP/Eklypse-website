import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header"; // Import du Header
import Footer from "./components/Footer"; // Import du Footer
import AuthProvider from "./components/AuthProvider"; // Import du wrapper de session

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://eklypse.xyz'),
  alternates: {
    canonical: '/',
  },
  title: {
    default: "Eklypse | Serveur Minecraft MMORPG Médiéval-Fantasy",
    template: "%s | Eklypse",
  },
  description: "Rejoignez Eklypse, un serveur Minecraft MMORPG Médiéval-Fantasy immersif. Découvrez un lore riche, choisissez votre destinée, et entrez dans la légende avant qu'elle ne s'éteigne.",
  keywords: ["Minecraft", "Serveur Minecraft", "MMORPG", "Médiéval", "Fantasy", "RP", "Roleplay", "Eklypse", "Serveur Francophone", "Survie", "FR"],
  authors: [{ name: "Équipe Eklypse" }],
  creator: "Eklypse",
  publisher: "Eklypse",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://eklypse.xyz",
    title: "Eklypse | Serveur Minecraft MMORPG",
    description: "Un Serveur Minecraft MMORPG Médiéval-Fantasy. Entrez dans la légende... avant qu'elle ne s'éteigne.",
    siteName: "Eklypse",
    images: [{
      url: "/Eklypse.png",
      width: 1200,
      height: 630,
      alt: "Logo du Serveur Eklypse"
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eklypse | Serveur Minecraft MMORPG",
    description: "Un Serveur Minecraft MMORPG Médiéval-Fantasy inédit. Rejoignez la légende !",
    images: ["/Eklypse.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <AuthProvider>
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}