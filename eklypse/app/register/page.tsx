'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus, Mail, Lock, User, AlertCircle } from 'lucide-react';

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
        setError(data.error || 'Une erreur est survenue.');
      }
    } catch {
      setError('Impossible de contacter le serveur.');
    } finally {
      setLoading(false);
    }
  };

  const fieldStyle: React.CSSProperties = {
    width: '100%',
    padding: '0.65rem 1rem 0.65rem 2.75rem',
    minHeight: 44,
    background: 'rgba(0,0,0,0.03)',
    border: '1px solid var(--border-base)',
    borderRadius: 'var(--radius-base)',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'border-color var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out)',
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = 'var(--brand-primary)';
    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.18)';
  };
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = 'var(--border-base)';
    e.currentTarget.style.boxShadow = 'none';
  };

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100dvh - 64px)',
      padding: 'clamp(2rem,5vw,4rem) 1rem',
      animation: 'fade-up var(--duration-slow) var(--ease-out) both',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 420,
        background: 'var(--surface-card)',
        backdropFilter: 'blur(20px)',
        border: '1px solid var(--border-base)',
        borderRadius: 'var(--radius-xl)',
        padding: 'clamp(2rem,5vw,3rem)',
        boxShadow: 'var(--shadow-raised)',
      }}>
        {/* Icon + heading */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: 56, height: 56,
            borderRadius: '50%',
            background: 'rgba(124,58,237,0.14)',
            border: '1px solid rgba(124,58,237,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.25rem',
          }}>
            <UserPlus size={24} strokeWidth={1.5} style={{ color: 'var(--brand-primary)' }} />
          </div>
          <h1 style={{
            fontFamily: 'var(--font-cinzel), serif',
            fontSize: 'clamp(1.3rem,3vw,1.65rem)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '0.06em',
            marginBottom: '0.35rem',
          }}>
            Créer un compte
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Rejoignez l'aventure Eklypse
          </p>
        </div>

        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 'var(--radius-base)',
            padding: '0.75rem 1rem',
            marginBottom: '1.25rem',
            color: '#F87171',
            fontSize: '0.875rem',
          }}>
            <AlertCircle size={14} strokeWidth={2} style={{ flexShrink: 0 }} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {([
            { label: 'Nom / Pseudo', name: 'name', type: 'text', icon: User, placeholder: 'Jean Dupont' },
            { label: 'Email', name: 'email', type: 'email', icon: Mail, placeholder: 'votre@email.com' },
            { label: 'Mot de passe', name: 'password', type: 'password', icon: Lock, placeholder: '••••••••' },
          ] as const).map(({ label, name, type, icon: Icon, placeholder }) => (
            <div key={name}>
              <label style={{
                display: 'block',
                fontSize: '0.75rem', fontWeight: 600,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: 'var(--text-muted)',
                marginBottom: '0.4rem',
              }}>
                {label}
              </label>
              <div style={{ position: 'relative' }}>
                <Icon size={14} strokeWidth={1.5} style={{
                  position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--text-muted)', pointerEvents: 'none',
                }} />
                <input
                  type={type}
                  required
                  placeholder={placeholder}
                  style={fieldStyle}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
                />
              </div>
            </div>
          ))}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '0.5rem',
              width: '100%',
              minHeight: 44,
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, var(--brand-primary), #5B21B6)',
              border: '1px solid rgba(124,58,237,0.4)',
              borderRadius: 'var(--radius-base)',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.875rem',
              letterSpacing: '0.04em',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'opacity var(--duration-fast) var(--ease-out)',
            }}
          >
            {loading ? 'Création...' : "S'inscrire"}
          </button>
        </form>

        <p style={{
          marginTop: '1.5rem',
          textAlign: 'center',
          fontSize: '0.875rem',
          color: 'var(--text-muted)',
        }}>
          Déjà un compte ?{' '}
          <Link href="/login" style={{ color: 'var(--brand-primary)', textDecoration: 'underline', textUnderlineOffset: 3 }}>
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
