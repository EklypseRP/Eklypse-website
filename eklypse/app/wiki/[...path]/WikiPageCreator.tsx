'use client';

import React, { useState } from 'react';
import { X, Loader2, FilePlus } from 'lucide-react';

interface WikiPageCreatorProps {
  slug: string;
  pathSegments: string[];
  onClose: () => void;
  onCreated: () => void;
}

const TYPES = [
  { value: 'file', label: 'Article' },
  { value: 'folder', label: 'Catégorie' },
] as const;

export default function WikiPageCreator({ slug, pathSegments, onClose, onCreated }: WikiPageCreatorProps) {
  const [title, setTitle] = useState('');
  const [icon, setIcon] = useState('📄');
  const [type, setType] = useState<'file' | 'folder'>('file');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parentSlug = slug;

  const handleCreate = async () => {
    if (!title.trim()) { setError('Le titre est requis.'); return; }
    setSaving(true);
    setError(null);

    const childSlug = `${parentSlug}/${title.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '')}`;

    try {
      const res = await fetch(`/api/wiki/${childSlug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          icon,
          type,
          description: description.trim() || undefined,
          parentSlug,
          content: '',
          order: 0,
          isPublished: true,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Erreur serveur');
      }
      onCreated();
    } catch (e: any) {
      setError(e.message);
      setSaving(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 'var(--z-toast)' as any,
      background: 'rgba(5,2,13,0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem',
    }}>
      <div style={{
        width: '100%', maxWidth: 480,
        background: 'var(--surface-card)',
        border: '1px solid var(--border-base)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.75rem',
        animation: 'fade-up var(--duration-base) var(--ease-out) both',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <FilePlus size={16} strokeWidth={2} style={{ color: 'var(--brand-primary)' }} />
            <span style={{
              fontFamily: 'var(--font-cinzel), serif',
              fontSize: '0.9rem', fontWeight: 700,
              color: 'var(--text-primary)',
              letterSpacing: '0.06em',
            }}>
              Nouvelle page
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            style={{
              width: 32, height: 32,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-muted)', cursor: 'pointer',
            }}
          >
            <X size={14} strokeWidth={2} />
          </button>
        </div>

        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Sous <code style={{ color: 'var(--brand-gold)', background: 'rgba(201,168,76,0.08)', padding: '0.1rem 0.35rem', borderRadius: 4 }}>{parentSlug}</code>
        </p>

        {/* Type selector */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
          {TYPES.map(t => (
            <button
              key={t.value}
              onClick={() => setType(t.value)}
              style={{
                flex: 1, padding: '0.5rem',
                minHeight: 44,
                background: type === t.value ? 'rgba(124,58,237,0.15)' : 'transparent',
                border: `1px solid ${type === t.value ? 'var(--brand-primary)' : 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-sm)',
                color: type === t.value ? 'var(--text-primary)' : 'var(--text-muted)',
                fontSize: '0.82rem', fontWeight: type === t.value ? 600 : 400,
                cursor: 'pointer',
                transition: 'all var(--duration-fast) var(--ease-out)',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Icon + Title */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <input
            type="text"
            value={icon}
            onChange={e => setIcon(e.target.value)}
            maxLength={2}
            aria-label="Icône (emoji)"
            style={{
              width: 52, flexShrink: 0,
              height: 44, textAlign: 'center', fontSize: '1.25rem',
              background: 'var(--surface-raised)',
              border: '1px solid var(--border-base)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
              outline: 'none',
            }}
          />
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Titre de la page"
            aria-label="Titre"
            autoFocus
            style={{
              flex: 1,
              height: 44, padding: '0 0.875rem',
              background: 'var(--surface-raised)',
              border: '1px solid var(--border-base)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-primary)',
              fontSize: '0.9rem',
              outline: 'none',
            }}
          />
        </div>

        {/* Description */}
        <input
          type="text"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Description courte (optionnel)"
          aria-label="Description"
          style={{
            width: '100%',
            height: 44, padding: '0 0.875rem',
            background: 'var(--surface-raised)',
            border: '1px solid var(--border-base)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-primary)',
            fontSize: '0.875rem',
            outline: 'none',
            marginBottom: '1.25rem',
            boxSizing: 'border-box',
          }}
        />

        {error && (
          <p style={{ fontSize: '0.8rem', color: '#EF4444', marginBottom: '1rem' }}>⚠ {error}</p>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '0.5rem 1rem', minHeight: 40,
              background: 'transparent',
              border: '1px solid var(--border-base)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--text-secondary)',
              fontSize: '0.82rem', cursor: 'pointer',
            }}
          >
            Annuler
          </button>
          <button
            onClick={handleCreate}
            disabled={saving}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.5rem 1.25rem', minHeight: 40,
              background: 'linear-gradient(135deg, var(--brand-primary), #5B21B6)',
              border: '1px solid rgba(124,58,237,0.4)',
              borderRadius: 'var(--radius-sm)',
              color: '#fff', fontSize: '0.82rem', fontWeight: 600,
              cursor: saving ? 'wait' : 'pointer',
              opacity: saving ? 0.75 : 1,
            }}
          >
            {saving
              ? <Loader2 size={13} strokeWidth={2} style={{ animation: 'spin 1s linear infinite' }} />
              : <FilePlus size={13} strokeWidth={2} />}
            {saving ? 'Création…' : 'Créer'}
          </button>
        </div>
      </div>
    </div>
  );
}
