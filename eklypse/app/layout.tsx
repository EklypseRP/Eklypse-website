import type { Metadata } from "next";
import { Geist, Geist_Mono, Cinzel } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AuthProvider from "./components/AuthProvider";
import ThemeProvider from "./components/ThemeProvider";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://eklypse.xyz'),
  alternates: { canonical: '/' },
  title: {
    default: "Eklypse | Serveur Minecraft RP Médiéval-Fantasy",
    template: "%s | Eklypse",
  },
  description: "Rejoignez Eklypse, un serveur Minecraft RP Médiéval-Fantasy immersif. Découvrez un lore riche, choisissez votre destinée, et entrez dans la légende avant qu'elle ne s'éteigne.",
  keywords: ["Minecraft", "Serveur Minecraft", "RP", "Médiéval", "Fantasy", "RP", "Roleplay", "Eklypse", "Serveur Francophone", "Survie", "FR"],
  authors: [{ name: "Équipe Eklypse" }],
  creator: "Eklypse",
  publisher: "Eklypse",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://eklypse.xyz",
    title: "Eklypse | Serveur Minecraft RP",
    description: "Un Serveur Minecraft RP Médiéval-Fantasy. Entrez dans la légende... avant qu'elle ne s'éteigne.",
    siteName: "Eklypse",
    images: [{ url: "/Eklypse.png", width: 1200, height: 630, alt: "Logo du Serveur Eklypse" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eklypse | Serveur Minecraft RP",
    description: "Un Serveur Minecraft RP Médiéval-Fantasy inédit. Rejoignez la légende !",
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

/* Inline script injected before React hydration — prevents flash of wrong theme */
const themeScript = `
(function(){
  try {
    var t = localStorage.getItem('eklypse-theme');
    if (t === 'light') document.documentElement.classList.add('light-theme');
  } catch(e){}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable} antialiased min-h-screen flex flex-col`}>
        <Script id="theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: themeScript }} />
        <AuthProvider>
          <ThemeProvider>
            <a href="#main-content" className="skip-link">
              Aller au contenu principal
            </a>
            <Header />
            <main id="main-content" className="flex-grow">
              {children}
            </main>
            <Footer />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
