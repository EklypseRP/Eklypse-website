'use client';

import { useState, useCallback, useRef, useEffect, useLayoutEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import { Extension } from '@tiptap/core';
import SkinViewer3D from '../components/SkinViewer3D';
// @ts-ignore
import { FontSize } from 'tiptap-extension-font-size';
// @ts-ignore
import { lineHeight } from 'tiptap-extension-line-height';
import debounce from 'lodash.debounce';
import { FileText, X, Upload, AlertTriangle, ChevronLeft, Scroll } from 'lucide-react';

/* ── Tiptap extension: exit heading on Enter ── */
const HeadingExitOnEnter = Extension.create({
  name: 'HeadingExitOnEnter',
  addKeyboardShortcuts() {
    return {
      Enter: () => {
        if (this.editor.isActive('heading')) {
          return this.editor.chain().focus().splitBlock().setParagraph().run();
        }
        return false;
      },
    };
  },
});

/* ── Skin dimensions badge ── */
const SkinDimensions = ({ url }: { url: string | null | undefined }) => {
  const [dims, setDims] = useState<string | null>(null);
  useEffect(() => {
    if (!url) { setDims(null); return; }
    const img = new window.Image();
    img.onload = () => setDims(`${img.naturalWidth}x${img.naturalHeight}`);
    img.src = url;
  }, [url]);
  if (!dims) return null;
  return (
    <div style={{
      padding: '0.25rem 0.75rem',
      background: 'rgba(0,0,0,0.4)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-sm)',
      fontSize: '0.72rem', fontWeight: 700,
      letterSpacing: '0.1em', textTransform: 'uppercase',
      color: 'var(--text-muted)',
    }}>
      {dims}
    </div>
  );
};

/* ── Status badge ── */
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; bg: string; border: string; color: string }> = {
    en_attente: { label: 'En attente', bg: 'rgba(201,168,76,0.12)', border: 'rgba(201,168,76,0.3)', color: 'var(--brand-gold)' },
    accepte:    { label: 'Acceptée',   bg: 'rgba(6,182,212,0.12)',  border: 'rgba(6,182,212,0.3)',  color: 'var(--brand-teal)' },
    refuse:     { label: 'Refusée',    bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)',  color: '#F87171' },
  };
  const s = config[status] ?? { label: status, bg: 'rgba(124,58,237,0.12)', border: 'rgba(124,58,237,0.3)', color: 'var(--brand-primary)' };
  return (
    <span style={{
      display: 'inline-block',
      padding: '0.2rem 0.7rem',
      background: s.bg, border: `1px solid ${s.border}`,
      borderRadius: 'var(--radius-sm)',
      color: s.color,
      fontSize: '0.72rem', fontWeight: 700,
      letterSpacing: '0.08em', textTransform: 'uppercase',
    }}>
      {s.label}
    </span>
  );
}

/* ── Toolbar button ── */
const ToolbarButton = ({
  onClick, isActive, children, title,
}: {
  onClick: () => void; isActive: boolean; children: React.ReactNode; title: string;
}) => (
  <button
    type="button"
    onMouseDown={(e) => { e.preventDefault(); onClick(); }}
    title={title}
    style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minWidth: 40, height: 36, padding: '0 0.625rem',
      background: isActive ? 'rgba(124,58,237,0.3)' : 'rgba(124,58,237,0.06)',
      border: `1px solid ${isActive ? 'rgba(124,58,237,0.5)' : 'var(--border-subtle)'}`,
      borderRadius: 'var(--radius-sm)',
      color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
      cursor: 'pointer',
      transition: 'background var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out)',
      fontSize: '0.875rem',
    }}
  >
    {children}
  </button>
);

/* ── Toolbar (MenuBar) ── */
const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 10,
      display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem',
      padding: '0.75rem 1rem',
      background: 'rgba(255,255,255,0.98)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-base) var(--radius-base) 0 0',
    }}>
      {/* Format */}
      <div style={{ display: 'flex', gap: '0.25rem', paddingRight: '0.625rem', borderRight: '1px solid var(--border-subtle)' }}>
        <ToolbarButton title="Gras" onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')}>
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton title="Italique" onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')}>
          <em style={{ fontFamily: 'serif' }}>I</em>
        </ToolbarButton>
        <ToolbarButton title="Souligné" onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')}>
          <span style={{ textDecoration: 'underline' }}>U</span>
        </ToolbarButton>
      </div>

      {/* Font size */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingRight: '0.625rem', borderRight: '1px solid var(--border-subtle)' }}>
        <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', fontWeight: 700 }}>Taille</span>
        <select
          style={{
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-secondary)',
            fontSize: '0.75rem',
            padding: '0.2rem 0.4rem',
            outline: 'none',
            cursor: 'pointer',
          }}
          onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}
        >
          <option value="14px">14px</option>
          <option value="16px">16px</option>
          <option value="18px">18px</option>
          <option value="22px">22px</option>
        </select>
      </div>

      {/* Block types */}
      <div style={{ display: 'flex', gap: '0.25rem' }}>
        <ToolbarButton title="Titre" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })}>
          <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase' }}>H2</span>
        </ToolbarButton>
        <ToolbarButton title="Liste" onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')}>
          <span>• —</span>
        </ToolbarButton>
      </div>
    </div>
  );
};

/* ── Shared input style helpers ── */
const inputBase: React.CSSProperties = {
  width: '100%',
  padding: '0.65rem 1rem',
  minHeight: 44,
  background: 'rgba(0,0,0,0.03)',
  border: '1px solid var(--border-base)',
  borderRadius: 'var(--radius-base)',
  color: 'var(--text-primary)',
  fontSize: '0.9rem',
  outline: 'none',
  transition: 'border-color var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out)',
};

const onFocusInput = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.currentTarget.style.borderColor = 'var(--brand-primary)';
  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(109,40,217,0.15)';
};
const onBlurInput = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  e.currentTarget.style.borderColor = 'var(--border-base)';
  e.currentTarget.style.boxShadow = 'none';
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.75rem', fontWeight: 700,
  letterSpacing: '0.1em', textTransform: 'uppercase',
  color: 'var(--text-muted)',
  marginBottom: '0.4rem',
};

/* ─────────────────────────────────────────────
   Main component
   ───────────────────────────────────────────── */
export default function CandidatureForm() {
  const [view, setView] = useState<'history' | 'form' | 'details'>('history');
  const [history, setHistory] = useState<any[]>([]);
  const [draft, setDraft] = useState<any | null>(null);
  const [selectedCandid, setSelectedCandid] = useState<any | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentRefusalReason, setCurrentRefusalReason] = useState<string | null>(null);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  const [formData, setFormData] = useState({
    rpName: '',
    age: '',
    taille: '',
    race: 'Humain',
    physique: '',
    mental: '',
    mcPseudo: '',
    skinUrl: '',
    skinUrls: [] as string[],
  });

  const [isHighResSkin, setIsHighResSkin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const physiqueRef = useRef<HTMLTextAreaElement>(null);
  const mentalRef = useRef<HTMLTextAreaElement>(null);

  const viewRef = useRef(view);
  const editingIdRef = useRef(editingId);
  const formDataRef = useRef(formData);
  const isEditorLoadingRef = useRef(false);

  useEffect(() => {
    viewRef.current = view;
    editingIdRef.current = editingId;
    formDataRef.current = formData;
  }, [view, editingId, formData]);

  const fetchCandidatures = async () => {
    try {
      const savedDraft = localStorage.getItem('eklypse_candidature_draft');
      if (savedDraft) setDraft(JSON.parse(savedDraft));
      const res = await fetch('/api/candidature');
      if (res.ok) {
        const data = await res.json();
        setHistory(data.history || []);
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchCandidatures(); }, []);

  useEffect(() => {
    const currentSkins = formData.skinUrls?.length ? formData.skinUrls : (formData.skinUrl ? [formData.skinUrl] : []);
    if (!currentSkins.length) { setIsHighResSkin(false); return; }
    let hasHighRes = false;
    let loaded = 0;
    currentSkins.forEach(url => {
      const img = new window.Image();
      img.onload = () => {
        if (img.width === 512 && img.height === 512) hasHighRes = true;
        loaded++;
        if (loaded === currentSkins.length) setIsHighResSkin(hasHighRes);
      };
      img.src = url;
    });
  }, [formData.skinUrls, formData.skinUrl]);

  useLayoutEffect(() => {
    if (view === 'form') {
      const adjust = (ref: React.RefObject<HTMLTextAreaElement | null>) => {
        if (ref.current) {
          ref.current.style.height = 'auto';
          ref.current.style.height = `${ref.current.scrollHeight}px`;
        }
      };
      setTimeout(() => { adjust(physiqueRef); adjust(mentalRef); }, 0);
    }
  }, [view, formData.physique, formData.mental]);

  const saveToLocal = useCallback(
    debounce((currentData: typeof formData, loreJson: any) => {
      if (viewRef.current !== 'form' || editingIdRef.current) return;
      const draftData = { ...currentData, lore: loreJson, timestamp: Date.now() };
      localStorage.setItem('eklypse_candidature_draft', JSON.stringify(draftData));
      setDraft(draftData);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 1500);
    }, 2000),
    [],
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2] } }),
      TextStyle, FontSize, lineHeight, Underline, HeadingExitOnEnter,
    ],
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'tiptap-editor focus:outline-none p-8',
      },
    },
    onTransaction: () => { setUpdateTrigger(prev => prev + 1); },
    onUpdate: ({ editor }) => {
      if (isEditorLoadingRef.current) return;
      if (viewRef.current === 'form' && !editingIdRef.current) {
        setSaveStatus('saving');
        saveToLocal(formDataRef.current, editor.getJSON());
      }
    },
  });

  const safeSetContent = (content: any, isClear = false) => {
    if (!editor) return;
    isEditorLoadingRef.current = true;
    if (isClear) editor.commands.clearContent();
    else editor.commands.setContent(content || '');
    setTimeout(() => { isEditorLoadingRef.current = false; }, 100);
  };

  const checkImageDimensions = (file: File): Promise<{ width: number; height: number }> =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new window.Image();
        img.onload = () => resolve({ width: img.width, height: img.height });
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const currentSkins = formData.skinUrls?.length ? formData.skinUrls : (formData.skinUrl ? [formData.skinUrl] : []);
    if (currentSkins.length + files.length > 8) {
      alert('Vous ne pouvez uploader que 8 skins maximum.');
      e.target.value = '';
      return;
    }
    setIsUploading(true);
    const newUrls: string[] = [];
    for (const file of files) {
      const dims = await checkImageDimensions(file);
      if (dims.width > 512 || dims.height > 512) {
        alert(`Format invalide pour ${file.name} : ${dims.width}x${dims.height}. Maximum : 512x512.`);
        continue;
      }
      const data = new FormData();
      data.append('file', file);
      try {
        const res = await fetch('/api/upload/skin', { method: 'POST', body: data });
        const result = await res.json();
        if (result.success) newUrls.push(result.url);
      } catch { alert(`Erreur upload pour ${file.name}`); }
    }
    if (newUrls.length > 0) {
      const updatedSkinUrls = [...currentSkins, ...newUrls];
      const newFormData = { ...formData, skinUrls: updatedSkinUrls, skinUrl: updatedSkinUrls[0] };
      setFormData(newFormData);
      if (view === 'form' && !editingId) saveToLocal(newFormData, editor?.getJSON());
    }
    setIsUploading(false);
    e.target.value = '';
  };

  const removeSkin = (idx: number) => {
    const currentSkins = formData.skinUrls?.length ? formData.skinUrls : (formData.skinUrl ? [formData.skinUrl] : []);
    const updated = currentSkins.filter((_, i) => i !== idx);
    const newFormData = { ...formData, skinUrls: updated, skinUrl: updated[0] || '' };
    setFormData(newFormData);
    if (view === 'form' && !editingId) saveToLocal(newFormData, editor?.getJSON());
  };

  const handleEditApplication = (c: any) => {
    setEditingId(c._id || 'edit_mode');
    setCurrentRefusalReason(c.refusalReason || null);
    setFormData({
      rpName: c.rpName || '', age: c.age?.toString() || '', taille: c.taille || '',
      race: c.race || 'Humain', physique: c.physique || '', mental: c.mental || '',
      mcPseudo: c.mcPseudo || '', skinUrl: c.skinUrl || '',
      skinUrls: c.skinUrls || (c.skinUrl ? [c.skinUrl] : []),
    });
    safeSetContent(c.lore);
    setView('form');
  };

  const handleResumeDraft = () => {
    if (!draft) return;
    setEditingId(null);
    setCurrentRefusalReason(null);
    setFormData({
      rpName: draft.rpName || '', age: draft.age || '', taille: draft.taille || '',
      race: draft.race || 'Humain', physique: draft.physique || '', mental: draft.mental || '',
      mcPseudo: draft.mcPseudo || '', skinUrl: draft.skinUrl || '',
      skinUrls: draft.skinUrls || (draft.skinUrl ? [draft.skinUrl] : []),
    });
    safeSetContent(draft.lore);
    setView('form');
  };

  const handleDeleteDraft = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Supprimer le brouillon ?')) {
      localStorage.removeItem('eklypse_candidature_draft');
      setDraft(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let finalValue = value;
    if (name === 'age' || name === 'taille') finalValue = value.replace(/[^0-9]/g, '');
    else if (name === 'rpName') finalValue = value.replace(/[0-9]/g, '');

    if (e.target.tagName === 'TEXTAREA') {
      const t = e.target as HTMLTextAreaElement;
      t.style.height = 'auto';
      t.style.height = `${t.scrollHeight}px`;
    }

    const newFormData = { ...formData, [name]: finalValue };
    setFormData(newFormData);
    if (view === 'form' && !editingId) {
      setSaveStatus('saving');
      saveToLocal(newFormData, editor?.getJSON());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editor || loading) return;
    if (parseInt(formData.age) < 18) return alert('Âge minimum requis : 18 ans.');
    if (!formData.taille.trim()) return alert('La taille est obligatoire (en chiffres uniquement).');
    if (!formData.race.trim()) return alert('La race est obligatoire.');
    if (!formData.physique.trim()) return alert('La description physique est obligatoire.');
    if (!formData.mental.trim()) return alert('La description mentale est obligatoire.');
    if (editor.getText().trim().length === 0) return alert('Le récit (Lore) ne peut pas être vide.');
    const currentSkins = formData.skinUrls?.length ? formData.skinUrls : (formData.skinUrl ? [formData.skinUrl] : []);
    if (!currentSkins.length) return alert('L\'apparence physique (Skin) est obligatoire (minimum 1).');
    if (currentSkins.length > 8) return alert('Vous ne pouvez pas envoyer plus de 8 skins.');
    if (!formData.mcPseudo) return alert('Le pseudo Minecraft est requis.');

    setLoading(true);
    try {
      const response = await fetch('/api/candidature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, lore: editor.getJSON(), isFinalSubmit: true, id: editingId }),
      });
      if (response.ok) {
        localStorage.removeItem('eklypse_candidature_draft');
        setDraft(null);
        setEditingId(null);
        await fetchCandidatures();
        setView('history');
      }
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  /* ── Loading state ── */
  if (loading) {
    return (
      <div style={{
        padding: '5rem',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.75rem',
        fontWeight: 700,
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        animation: 'pulse 2s ease-in-out infinite',
      }}>
        Consultation du Codex...
      </div>
    );
  }

  const currentSkins = formData.skinUrls?.length ? formData.skinUrls : (formData.skinUrl ? [formData.skinUrl] : []);
  const hasPending = history.some(c => c.status === 'en_attente');

  return (
    <div key={view + (editingId || 'new') + (selectedCandid?._id || 'none')}
      style={{ animation: 'fade-up var(--duration-slow) var(--ease-out) both', width: '100%' }}
    >

      {/* ─── HISTORY VIEW ─── */}
      {view === 'history' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

          {/* Draft banner */}
          {draft && (
            <div
              onClick={handleResumeDraft}
              style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '1rem 1.25rem',
                background: 'rgba(201,168,76,0.06)',
                border: '1px solid rgba(201,168,76,0.25)',
                borderRadius: 'var(--radius-base)',
                cursor: 'pointer',
                transition: 'background var(--duration-fast) var(--ease-out)',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.06)'; }}
            >
              <FileText size={18} strokeWidth={1.5} style={{ color: 'var(--brand-gold)', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--brand-gold)', marginBottom: '0.15rem' }}>
                  Brouillon en cours
                </span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  "{draft.rpName || 'Sans nom'}"
                </span>
              </div>
              <button
                onClick={handleDeleteDraft}
                style={{
                  width: 32, height: 32, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'transparent', border: 'none',
                  color: 'var(--text-muted)', cursor: 'pointer',
                  borderRadius: 'var(--radius-sm)',
                  transition: 'color var(--duration-fast) var(--ease-out)',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#F87171'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                <X size={14} strokeWidth={2} />
              </button>
            </div>
          )}

          {/* New application button */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={() => {
                setEditingId(null);
                setCurrentRefusalReason(null);
                setFormData({ rpName: '', age: '', taille: '', race: 'Humain', physique: '', mental: '', mcPseudo: '', skinUrl: '', skinUrls: [] });
                safeSetContent(null, true);
                setView('form');
              }}
              disabled={hasPending}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.625rem',
                padding: '0.875rem 2.5rem',
                minHeight: 52,
                background: hasPending ? 'rgba(124,58,237,0.15)' : 'linear-gradient(135deg, var(--brand-primary), #5B21B6)',
                border: '1px solid rgba(124,58,237,0.4)',
                borderRadius: 'var(--radius-lg)',
                color: hasPending ? 'var(--text-muted)' : '#fff',
                fontFamily: 'var(--font-cinzel), serif',
                fontWeight: 700,
                fontSize: '0.875rem',
                letterSpacing: '0.08em',
                cursor: hasPending ? 'not-allowed' : 'pointer',
                opacity: hasPending ? 0.6 : 1,
                transition: 'opacity var(--duration-fast) var(--ease-out)',
              }}
            >
              <Scroll size={16} strokeWidth={1.5} />
              {hasPending ? 'Étude en cours...' : 'Sceller un nouveau Récit'}
            </button>
          </div>

          {/* Archives list */}
          <div>
            <h3 style={{
              fontSize: '0.72rem', fontWeight: 700,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: 'var(--text-muted)',
              marginBottom: '1rem',
              paddingLeft: '0.5rem',
              borderLeft: '2px solid var(--brand-primary)',
            }}>
              Archives d'Eklypse
            </h3>

            {history.length === 0 && !draft ? (
              <div style={{
                padding: '3rem',
                border: '1px dashed var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                textAlign: 'center',
                color: 'var(--text-muted)',
                fontSize: '0.875rem',
              }}>
                Aucune trace dans les archives
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {history.map((c) => (
                  <div
                    key={c._id}
                    onClick={() => {
                      if (c.status !== 'refuse') {
                        setSelectedCandid(c);
                        safeSetContent(c.lore);
                        setView('details');
                      }
                    }}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
                      padding: '1rem 1.25rem',
                      background: 'rgba(124,58,237,0.04)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-base)',
                      cursor: c.status === 'refuse' ? 'default' : 'pointer',
                      transition: 'background var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out)',
                    }}
                    onMouseEnter={e => {
                      if (c.status !== 'refuse') {
                        e.currentTarget.style.background = 'rgba(124,58,237,0.08)';
                        e.currentTarget.style.borderColor = 'var(--border-base)';
                      }
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(124,58,237,0.04)';
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <h4 style={{
                        fontFamily: 'var(--font-cinzel), serif',
                        fontSize: '1rem', fontWeight: 700,
                        color: 'var(--text-primary)',
                        marginBottom: '0.2rem',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {c.rpName}
                      </h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Soumis le {new Date(c.submittedAt || c.updatedAt).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                      {c.status === 'refuse' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleEditApplication(c); }}
                          style={{
                            padding: '0.35rem 0.875rem', minHeight: 32,
                            background: 'rgba(239,68,68,0.12)',
                            border: '1px solid rgba(239,68,68,0.3)',
                            borderRadius: 'var(--radius-sm)',
                            color: '#F87171',
                            fontSize: '0.75rem', fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'background var(--duration-fast) var(--ease-out)',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)'; }}
                        >
                          Corriger
                        </button>
                      )}
                      <StatusBadge status={c.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── DETAILS VIEW ─── */}
      {view === 'details' && selectedCandid && (
        <div>
          {/* Header row */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
            marginBottom: '1.75rem', paddingBottom: '1.25rem',
            borderBottom: '1px solid var(--border-subtle)',
          }}>
            <button
              onClick={() => setView('history')}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                background: 'none', border: 'none',
                color: 'var(--text-muted)', fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'color var(--duration-fast) var(--ease-out)',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; }}
            >
              <ChevronLeft size={14} strokeWidth={2} />
              Revenir aux Archives
            </button>
            <StatusBadge status={selectedCandid.status} />
          </div>

          {/* Refusal reason */}
          {selectedCandid.status === 'refuse' && selectedCandid.refusalReason && (
            <div style={{
              display: 'flex', gap: '0.75rem',
              padding: '1rem 1.25rem',
              background: 'rgba(239,68,68,0.06)',
              border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: 'var(--radius-base)',
              marginBottom: '1.5rem',
            }}>
              <AlertTriangle size={16} strokeWidth={1.5} style={{ color: '#F87171', flexShrink: 0, marginTop: 2 }} />
              <div>
                <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#F87171', marginBottom: '0.3rem' }}>
                  Motif du rejet
                </span>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.6 }}>
                  "{selectedCandid.refusalReason}"
                </p>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            {/* Main content */}
            <div style={{
              flex: '1 1 400px',
              background: 'rgba(0,0,0,0.3)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem',
            }}>
              <div style={{ marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={labelStyle}>Identité RP</span>
                <h2 style={{
                  fontFamily: 'var(--font-cinzel), serif',
                  fontSize: 'clamp(1.5rem,3vw,2.25rem)',
                  fontWeight: 900,
                  color: 'var(--text-primary)',
                  marginBottom: '0.75rem',
                }}>
                  {selectedCandid.rpName}
                </h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {[
                    `${selectedCandid.age} ans`,
                    `Race : ${selectedCandid.race || 'Non spécifiée'}`,
                    `Taille : ${selectedCandid.taille || 'Non spécifiée'}`,
                  ].map(label => (
                    <span key={label} style={{
                      padding: '0.2rem 0.75rem',
                      background: 'rgba(124,58,237,0.12)',
                      border: '1px solid rgba(124,58,237,0.25)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem', fontWeight: 700,
                      color: 'var(--text-primary)',
                    }}>
                      {label}
                    </span>
                  ))}
                </div>
              </div>

              {[
                { label: 'Description Physique', value: selectedCandid.physique },
                { label: 'Description Mentale', value: selectedCandid.mental },
              ].map(({ label, value }) => (
                <div key={label} style={{ marginBottom: '1.5rem' }}>
                  <span style={labelStyle}>{label}</span>
                  <p style={{
                    fontSize: '0.9rem', color: 'var(--text-secondary)',
                    lineHeight: 1.7, fontStyle: 'italic',
                    borderLeft: '2px solid rgba(124,58,237,0.3)',
                    paddingLeft: '0.875rem',
                  }}>
                    {value}
                  </p>
                </div>
              ))}

              <div>
                <span style={{ ...labelStyle, marginBottom: '0.75rem' }}>Récit & Lore</span>
                <div style={{ maxHeight: 600, overflowY: 'auto' }}>
                  <EditorContent editor={editor} className="tiptap-editor pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Skin panel */}
            <div style={{
              flex: '0 0 220px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
              position: 'sticky', top: 80,
            }}>
              <span style={labelStyle}>Skin(s) 3D</span>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', maxHeight: 600, overflowY: 'auto', paddingRight: 4 }}>
                {(selectedCandid.skinUrls?.length ? selectedCandid.skinUrls : (selectedCandid.skinUrl ? [selectedCandid.skinUrl] : [])).map((url: string, i: number) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                    <SkinViewer3D skinUrl={url} width={200} height={280} />
                    <SkinDimensions url={url} />
                  </div>
                ))}
              </div>
              <div style={{
                padding: '0.625rem 1rem',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-base)',
                textAlign: 'center', width: '100%',
              }}>
                <span style={{ display: 'block', ...labelStyle, marginBottom: '0.2rem' }}>Pseudo Minecraft</span>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                  {selectedCandid.mcPseudo || 'Inconnu'}
                </span>
              </div>
              {selectedCandid.status === 'refuse' && (
                <button
                  onClick={() => handleEditApplication(selectedCandid)}
                  style={{
                    width: '100%', minHeight: 44,
                    padding: '0.75rem',
                    background: 'linear-gradient(135deg, var(--brand-primary), #5B21B6)',
                    border: '1px solid rgba(124,58,237,0.4)',
                    borderRadius: 'var(--radius-base)',
                    color: '#fff', fontWeight: 700, fontSize: '0.875rem',
                    cursor: 'pointer',
                  }}
                >
                  Réécrire le Récit
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── FORM VIEW ─── */}
      {view === 'form' && (
        <div>
          {/* Form header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: '2rem', flexWrap: 'wrap', gap: '0.75rem',
          }}>
            <button
              onClick={() => setView('history')}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                background: 'none', border: 'none',
                color: 'var(--text-muted)', fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'color var(--duration-fast) var(--ease-out)',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; }}
            >
              <ChevronLeft size={14} strokeWidth={2} />
              Abandonner
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: saveStatus === 'saving' ? 'var(--brand-gold)' : saveStatus === 'saved' ? '#22C55E' : 'var(--border-base)',
              }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.06em' }}>
                {saveStatus === 'saving' ? 'Sauvegarde...' : saveStatus === 'saved' ? 'Brouillon à jour' : 'Prêt'}
              </span>
            </div>
          </div>

          {/* Refusal context */}
          {editingId && currentRefusalReason && (
            <div style={{
              display: 'flex', gap: '0.75rem',
              padding: '1rem 1.25rem',
              background: 'rgba(201,168,76,0.06)',
              border: '1px solid rgba(201,168,76,0.25)',
              borderRadius: 'var(--radius-base)',
              marginBottom: '2rem',
            }}>
              <AlertTriangle size={16} strokeWidth={1.5} style={{ color: 'var(--brand-gold)', flexShrink: 0, marginTop: 2 }} />
              <div>
                <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--brand-gold)', marginBottom: '0.3rem' }}>
                  Raison du refus
                </span>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.6 }}>
                  "{currentRefusalReason}"
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Identity fields */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              {([
                { name: 'rpName', label: 'Nom RP', type: 'text', placeholder: 'Jean Dupont' },
                { name: 'age', label: 'Âge (18+)', type: 'text', placeholder: '24' },
                { name: 'taille', label: 'Taille (cm)', type: 'text', placeholder: '180' },
              ] as const).map(({ name, label, type, placeholder }) => (
                <div key={name}>
                  <label style={labelStyle}>{label}</label>
                  <input
                    name={name}
                    type={type}
                    value={formData[name]}
                    onChange={handleInputChange}
                    required
                    autoComplete="off"
                    placeholder={placeholder}
                    style={inputBase}
                    onFocus={onFocusInput}
                    onBlur={onBlurInput}
                  />
                </div>
              ))}
              <div>
                <label style={labelStyle}>Race</label>
                <select
                  name="race"
                  value={formData.race}
                  onChange={handleInputChange}
                  required
                  style={{ ...inputBase, cursor: 'pointer' }}
                  onFocus={onFocusInput}
                  onBlur={onBlurInput}
                >
                  <option value="Humain">Humain</option>
                  <option value="Elfe">Elfe</option>
                  <option value="Nain">Nain</option>
                  <option value="Autre">Autre</option>
                </select>
                {formData.race === 'Autre' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem' }}>
                    <AlertTriangle size={12} strokeWidth={2} style={{ color: 'var(--brand-gold)' }} />
                    <span style={{ fontSize: '0.75rem', color: 'var(--brand-gold)', fontWeight: 600 }}>
                      Nécessite un ticket
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Text descriptions */}
            {([
              { name: 'physique', ref: physiqueRef, label: 'Description Physique', placeholder: 'Apparence, style vestimentaire, signes distinctifs...' },
              { name: 'mental', ref: mentalRef, label: 'Description Mentale', placeholder: 'Caractère, tempérament, psychologie, peurs...' },
            ] as const).map(({ name, ref, label, placeholder }) => (
              <div key={name}>
                <label style={labelStyle}>{label} <span style={{ color: 'var(--text-muted)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(minimum 5 lignes)</span></label>
                <textarea
                  ref={ref}
                  name={name}
                  value={formData[name]}
                  onChange={handleInputChange}
                  placeholder={placeholder}
                  style={{
                    ...inputBase,
                    minHeight: 128,
                    resize: 'none',
                    overflow: 'hidden',
                    lineHeight: 1.6,
                  }}
                  onFocus={onFocusInput}
                  onBlur={onBlurInput}
                />
              </div>
            ))}

            {/* Lore editor */}
            <div>
              <label style={labelStyle}>
                Récit & Lore{' '}
                <span style={{ color: 'var(--text-muted)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
                  (minimum 25 lignes)
                </span>
              </label>
              <div style={{
                height: 600,
                display: 'flex', flexDirection: 'column',
                border: '1px solid var(--border-base)',
                borderRadius: 'var(--radius-base)',
                background: 'rgba(0,0,0,0.25)',
                overflow: 'hidden',
                transition: 'border-color var(--duration-fast) var(--ease-out)',
              }}
                onFocusCapture={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--brand-primary)'; }}
                onBlurCapture={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border-base)'; }}
              >
                <MenuBar editor={editor} />
                <div style={{ flex: 1, overflowY: 'auto' }}>
                  <EditorContent editor={editor} />
                </div>
              </div>
            </div>

            {/* Minecraft + Skin */}
            <div style={{
              display: 'flex', gap: '2rem', flexWrap: 'wrap',
              padding: '1.5rem',
              background: 'rgba(0,0,0,0.2)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
            }}>
              {/* Left: inputs */}
              <div style={{ flex: '1 1 260px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={labelStyle}>
                    Pseudo Minecraft <span style={{ color: '#F87171' }}>*</span>
                  </label>
                  <input
                    name="mcPseudo"
                    value={formData.mcPseudo}
                    onChange={handleInputChange}
                    required
                    autoComplete="off"
                    placeholder="Ex: Steve_64"
                    style={inputBase}
                    onFocus={onFocusInput}
                    onBlur={onBlurInput}
                  />
                </div>
                <div>
                  <label style={labelStyle}>
                    Apparence (.png — max 8 skins) <span style={{ color: '#F87171' }}>*</span>
                  </label>
                  <input type="file" multiple accept="image/png" onChange={handleFileChange} style={{ display: 'none' }} id="skin-upload" />
                  <label
                    htmlFor="skin-upload"
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                      width: '100%', minHeight: 120,
                      border: '2px dashed var(--border-base)',
                      borderRadius: 'var(--radius-base)',
                      background: 'rgba(0,0,0,0.2)',
                      cursor: 'pointer',
                      transition: 'border-color var(--duration-fast) var(--ease-out), background var(--duration-fast) var(--ease-out)',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = 'var(--brand-primary)';
                      e.currentTarget.style.background = 'rgba(124,58,237,0.06)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--border-base)';
                      e.currentTarget.style.background = 'rgba(0,0,0,0.2)';
                    }}
                  >
                    {isUploading ? (
                      <span style={{ fontSize: '0.75rem', color: 'var(--brand-primary)', fontWeight: 600, letterSpacing: '0.06em' }}>
                        Upload en cours...
                      </span>
                    ) : (
                      <>
                        <Upload size={20} strokeWidth={1.5} style={{ color: 'var(--text-muted)' }} />
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                          Charger mes Skins
                        </span>
                      </>
                    )}
                  </label>
                  {isHighResSkin && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem' }}>
                      <AlertTriangle size={12} strokeWidth={2} style={{ color: 'var(--brand-gold)' }} />
                      <span style={{ fontSize: '0.75rem', color: 'var(--brand-gold)', fontWeight: 600 }}>
                        Skin HD détecté — nécessite un ticket
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: 3D preview */}
              <div style={{
                flex: '1 1 200px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem',
                maxHeight: 400, overflowY: 'auto',
              }}>
                <span style={labelStyle}>Aperçu 3D</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.75rem' }}>
                  {currentSkins.map((url, i) => (
                    <div key={i} style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                      <button
                        type="button"
                        onClick={() => removeSkin(i)}
                        style={{
                          position: 'absolute', top: -8, right: -8, zIndex: 10,
                          width: 24, height: 24,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: '#EF4444', border: 'none',
                          borderRadius: '50%',
                          color: '#fff', cursor: 'pointer',
                          boxShadow: '0 2px 8px rgba(239,68,68,0.4)',
                        }}
                      >
                        <X size={12} strokeWidth={2.5} />
                      </button>
                      <SkinViewer3D skinUrl={url} width={150} height={200} />
                      <SkinDimensions url={url} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit */}
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '0.5rem' }}>
              <button
                type="submit"
                disabled={loading || isUploading}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.625rem',
                  padding: '1rem 3rem', minHeight: 52,
                  width: '100%', maxWidth: 480,
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, var(--brand-primary), #5B21B6)',
                  border: '1px solid rgba(124,58,237,0.4)',
                  borderRadius: 'var(--radius-lg)',
                  color: '#fff',
                  fontFamily: 'var(--font-cinzel), serif',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  letterSpacing: '0.08em',
                  cursor: loading || isUploading ? 'not-allowed' : 'pointer',
                  opacity: loading || isUploading ? 0.7 : 1,
                  transition: 'opacity var(--duration-fast) var(--ease-out)',
                }}
              >
                <Scroll size={16} strokeWidth={1.5} />
                {editingId ? 'Actualiser le Parchemin' : 'Sceller le Parchemin'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
