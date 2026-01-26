'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/login?success=AccountCreated');
      } else {
        setError(data.error || "Une erreur est survenue.");
      }
    } catch (err) {
      setError("Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    /* min-h-[calc(100vh-5rem)] retire les 80px (5rem) du Header pour un centrage parfait */
    <div className="flex flex-1 flex-col items-center justify-center min-h-[calc(100vh-5rem)] px-4">
      <div className="w-full max-w-md p-8 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold mb-2 text-white text-center">Créer un compte</h1>
        <p className="text-neutral-400 text-center mb-8 text-sm">Rejoignez l'aventure Eklypse</p>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1">Nom / Pseudo</label>
            <input 
              type="text" 
              required
              className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1">Email</label>
            <input 
              type="email" 
              required
              className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setFormData({...formData, email: e.target.value})} 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-400 mb-1">Mot de passe</label>
            <input 
              type="password" 
              required
              className="w-full p-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setFormData({...formData, password: e.target.value})} 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? "Création..." : "S'inscrire"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-500">
          Déjà un compte ?{' '}
          <Link href="/login" className="text-blue-400 hover:underline">Se connecter</Link>
        </p>
      </div>
    </div>
  );
}