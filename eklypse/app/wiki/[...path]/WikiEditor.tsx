'use client';

import React, { useState, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Save, X, Loader2 } from 'lucide-react';

interface WikiEditorProps {
  slug: string;
  initialContent: string;
  onClose: () => void;
  onSaved: (newContent: string) => void;
}

const WikiEditor: React.FC<WikiEditorProps> = ({ slug, initialContent, onClose, onSaved }) => {
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'tiptap-editor',
        style: 'min-height: 420px; outline: none; padding: 0;',
      },
    },
  });

  const handleSave = useCallback(async () => {
    if (!editor) return;
    setSaving(true);
    setError(null);
    try {
      // Export as plain text/markdown (StarterKit text)
      const content = editor.getText() ? (editor.storage as any)?.markdown?.getMarkdown?.() ?? editor.getText() : '';
      const res = await fetch(`/api/wiki/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Erreur serveur');
      }
      setSuccess(true);
      onSaved(content);
      setTimeout(() => setSuccess(false), 2000);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }, [editor, slug, onSaved]);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 'var(--z-toast)' as any,
      background: 'rgba(5,2,13,0.9)',
      backdropFilter: 'blur(12px)',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Toolbar */}
      <div style={{
        padding: '0.875rem 1.5rem',
        borderBottom: '1px solid var(--border-base)',
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        background: 'rgba(14,7,30,0.95)',
        flexShrink: 0,
      }}>
        <span style={{
          fontFamily: 'var(--font-cinzel), serif',
          fontSize: '0.85rem', fontWeight: 700,
          color: 'var(--text-muted)',
          letterSpacing: '0.08em', textTransform: 'uppercase',
          flex: 1,
        }}>
          Édition — <span style={{ color: 'var(--brand-gold)' }}>{slug}</span>
        </span>

        {error && (
          <span style={{ fontSize: '0.82rem', color: '#EF4444', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            ⚠ {error}
          </span>
        )}

        {success && (
          <span style={{ fontSize: '0.82rem', color: '#22c55e' }}>✓ Sauvegardé</span>
        )}

        {/* Format buttons */}
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {[
            { label: 'B',   action: () => editor?.chain().focus().toggleBold().run(),   title: 'Gras' },
            { label: 'I',   action: () => editor?.chain().focus().toggleItalic().run(), title: 'Italique' },
            { label: 'H2',  action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(), title: 'Titre 2' },
            { label: '• ',  action: () => editor?.chain().focus().toggleBulletList().run(), title: 'Liste' },
          ].map((btn) => (
            <button
              key={btn.label}
              onClick={btn.action}
              title={btn.title}
              aria-label={btn.title}
              style={{
                width: 32, height: 32,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(124,58,237,0.1)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-secondary)',
                fontSize: '0.78rem', fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          aria-label="Sauvegarder"
          style={{
            display: 'flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.5rem 1.1rem', minHeight: 36,
            background: 'linear-gradient(135deg, var(--brand-primary), #5B21B6)',
            border: '1px solid rgba(124,58,237,0.5)',
            borderRadius: 'var(--radius-sm)',
            color: '#fff', fontWeight: 700, fontSize: '0.82rem',
            cursor: saving ? 'wait' : 'pointer',
            opacity: saving ? 0.75 : 1,
          }}
        >
          {saving
            ? <Loader2 size={14} strokeWidth={2} style={{ animation: 'spin 1s linear infinite' }} />
            : <Save size={14} strokeWidth={2} />}
          {saving ? 'Sauvegarde…' : 'Sauvegarder'}
        </button>

        <button
          onClick={onClose}
          aria-label="Fermer l'éditeur"
          style={{
            width: 36, height: 36,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: 'var(--radius-sm)',
            color: '#EF4444', cursor: 'pointer',
          }}
        >
          <X size={16} strokeWidth={2} />
        </button>
      </div>

      {/* Editor area */}
      <div style={{
        flex: 1, overflowY: 'auto',
        padding: 'clamp(1.5rem, 4vw, 3rem) clamp(1rem, 5vw, 5rem)',
      }}>
        <div style={{
          maxWidth: 860, margin: '0 auto',
          background: 'var(--surface-card)',
          border: '1px solid var(--border-base)',
          borderRadius: 'var(--radius-lg)',
          padding: 'clamp(1.5rem, 3vw, 2.5rem)',
          minHeight: 480,
        }}>
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
};

export default WikiEditor;
