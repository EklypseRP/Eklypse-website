'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import SkinViewer3D from '@/app/components/SkinViewer3D';
// @ts-ignore
import { FontSize } from 'tiptap-extension-font-size';
// @ts-ignore
import { lineHeight } from 'tiptap-extension-line-height';
import { FolderOpen, FileText, User, AlertTriangle, ChevronLeft, Check, X, Ticket } from 'lucide-react';

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
      padding: '0.2rem 0.625rem',
      background: 'rgba(0,0,0,0.05)',
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

/* ── Read-only lore renderer ── */
const LoreRenderer = ({ content }: { content: any }) => {
  const editor = useEditor({
    extensions: [StarterKit, TextStyle, FontSize, lineHeight, Underline],
    content,
    editable: false,
    immediatelyRender: false,
    editorProps: {
      attributes: { class: 'tiptap-editor focus:outline-none' },
    },
  });
  return <EditorContent editor={editor} />;
};

/* ── Shared label style ── */
const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.72rem', fontWeight: 700,
  letterSpacing: '0.1em', textTransform: 'uppercase',
  color: 'var(--text-muted)',
  marginBottom: '0.35rem',
};

/* ─────────────────────────────────────────────
   Main page
   ───────────────────────────────────────────── */
export default function AdminCandidaturesPage() {
  const { data: session, status }: any = useSession();
  const router = useRouter();

  const [allCandidatures, setAllCandidatures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'overview' | 'folder'>('overview');
  const [selectedUserKey, setSelectedUserKey] = useState<string | null>(null);
  const [selectedCandidId, setSelectedCandidId] = useState<string | null>(null);
  const [isHighResSkin, setIsHighResSkin] = useState(false);
  const [refusalModal, setRefusalModal] = useState<{ show: boolean; id: string; name: string }>({ show: false, id: '', name: '' });
  const [reason, setReason] = useState('');

  const fetchCandidatures = async () => {
    try {
      const res = await fetch('/api/admin/candidatures');
      if (res.ok) {
        const data = await res.json();
        setAllCandidatures(Array.isArray(data) ? data : []);
      }
    } catch (err) { console.error('Erreur Fetch:', err); } finally { setLoading(false); }
  };

  const handleAction = async (id: string, action: 'accepte' | 'refuse', refusalReason?: string) => {
    try {
      const res = await fetch('/api/admin/candidature-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: action, reason: refusalReason }),
      });
      if (res.ok) {
        setRefusalModal({ show: false, id: '', name: '' });
        setReason('');
        fetchCandidatures();
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (status === 'unauthenticated' || (status === 'authenticated' && !session?.user?.isRecruiter)) {
      router.push('/unauthorized');
    } else if (session?.user?.isRecruiter) {
      fetchCandidatures();
    }
  }, [session, status, router]);

  const userFolders = useMemo(() => {
    const groups: Record<string, any> = {};
    allCandidatures.forEach((c: any) => {
      const key = c.discordId || 'ID_INCONNU';
      if (!groups[key]) {
        groups[key] = {
          id: key,
          discordName: c.userName || c.name || 'Inconnu',
          rpName: c.rpName || 'Anonyme',
          image: c.userImage || c.image,
          count: 0,
          candidatures: [],
        };
      }
      groups[key].count++;
      groups[key].candidatures.push(c);
    });
    return Object.values(groups).sort((a: any, b: any) => {
      const dateA = new Date(a.candidatures[0]?.submittedAt || 0).getTime();
      const dateB = new Date(b.candidatures[0]?.submittedAt || 0).getTime();
      return dateB - dateA;
    });
  }, [allCandidatures]);

  const pendingCandidatures = useMemo(() =>
    [...allCandidatures]
      .filter(c => c.status === 'en_attente')
      .sort((a, b) => new Date(b.submittedAt || b.updatedAt).getTime() - new Date(a.submittedAt || a.updatedAt).getTime()),
    [allCandidatures],
  );

  const currentFolder = useMemo(() => userFolders.find(f => f.id === selectedUserKey), [userFolders, selectedUserKey]);
  const activeCandidature = useMemo(() => currentFolder?.candidatures.find((c: any) => c._id === selectedCandidId), [currentFolder, selectedCandidId]);
  const activeSkins = activeCandidature?.skinUrls?.length ? activeCandidature.skinUrls : (activeCandidature?.skinUrl ? [activeCandidature.skinUrl] : []);

  useEffect(() => {
    if (!activeSkins.length) { setIsHighResSkin(false); return; }
    let isHd = false; let loadedCount = 0;
    activeSkins.forEach((url: string) => {
      const img = new window.Image();
      img.onload = () => {
        if (img.width === 512 && img.height === 512) isHd = true;
        loadedCount++;
        if (loadedCount === activeSkins.length) setIsHighResSkin(isHd);
      };
      img.src = url;
    });
  }, [activeCandidature, activeSkins]);

  /* ── Loading ── */
  if (loading) {
    return (
      <div style={{
        minHeight: 'calc(100dvh - 64px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.75rem', fontWeight: 700,
        letterSpacing: '0.3em', textTransform: 'uppercase',
      }}>
        Lecture du Codex...
      </div>
    );
  }

  return (
    <div style={{
      padding: 'clamp(2rem,5vw,3.5rem) clamp(1rem,4vw,2rem)',
      animation: 'fade-up var(--duration-slow) var(--ease-out) both',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* ── Page header ── */}
        <header style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <h1 style={{
                fontFamily: 'var(--font-cinzel), serif',
                fontSize: 'clamp(1.5rem,4vw,2.25rem)',
                fontWeight: 900,
                color: 'var(--text-primary)',
                letterSpacing: '0.06em',
                marginBottom: '0.2rem',
              }}>
                {view === 'overview' ? 'Gestion des Candidatures' : `Dossier · ${currentFolder?.discordName}`}
              </h1>
              {view === 'overview' && (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  {pendingCandidatures.length} en attente · {allCandidatures.length} total
                </p>
              )}
            </div>
            {view === 'folder' && (
              <button
                onClick={() => selectedCandidId ? setSelectedCandidId(null) : setView('overview')}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  padding: '0.5rem 1rem', minHeight: 40,
                  background: 'rgba(124,58,237,0.08)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-base)',
                  color: 'var(--text-muted)', fontSize: '0.82rem',
                  cursor: 'pointer',
                  transition: 'color var(--duration-fast) var(--ease-out)',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                <ChevronLeft size={14} strokeWidth={2} />
                {selectedCandidId ? 'Retour au dossier' : 'Retour aux archives'}
              </button>
            )}
          </div>
          <div className="divider" style={{ marginTop: '1.25rem' }} />
        </header>

        {/* ── OVERVIEW ── */}
        {view === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>

            {/* Pending */}
            <section>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '1rem' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#EF4444', boxShadow: '0 0 8px rgba(239,68,68,0.6)', display: 'inline-block' }} />
                <h2 style={{
                  fontSize: '0.75rem', fontWeight: 700,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                }}>
                  À traiter ({pendingCandidatures.length})
                </h2>
              </div>

              {pendingCandidatures.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', paddingLeft: '0.5rem' }}>
                  Aucune candidature en attente.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {pendingCandidatures.map((c: any) => (
                    <div
                      key={c._id}
                      onClick={() => { setSelectedUserKey(c.discordId); setView('folder'); setSelectedCandidId(c._id); }}
                      className="card"
                      style={{
                        padding: '1rem 1.25rem',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', minWidth: 0 }}>
                        <div style={{
                          width: 40, height: 40, flexShrink: 0,
                          borderRadius: 'var(--radius-sm)',
                          background: 'rgba(124,58,237,0.15)',
                          border: '1px solid var(--border-subtle)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontFamily: 'var(--font-cinzel), serif',
                          fontWeight: 700, fontSize: '1rem',
                          color: 'var(--brand-primary)',
                        }}>
                          {c.rpName?.substring(0, 1).toUpperCase()}
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <h3 style={{
                            fontFamily: 'var(--font-cinzel), serif',
                            fontWeight: 700, fontSize: '0.95rem',
                            color: 'var(--text-primary)',
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                          }}>
                            {c.rpName}
                          </h3>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Discord : {c.userName || c.name} · {new Date(c.submittedAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <StatusBadge status={c.status} />
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* All folders */}
            <section>
              <h2 style={{
                fontSize: '0.75rem', fontWeight: 700,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: 'var(--text-muted)',
                marginBottom: '1rem',
              }}>
                Archives des Membres ({userFolders.length})
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '1rem',
              }}>
                {userFolders.map((folder: any) => (
                  <div
                    key={folder.id}
                    onClick={() => { setSelectedUserKey(folder.id); setView('folder'); setSelectedCandidId(null); }}
                    className="card"
                    style={{ padding: '1.25rem', cursor: 'pointer' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1rem' }}>
                      {folder.image ? (
                        <Image src={folder.image} alt="" width={44} height={44} style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }} />
                      ) : (
                        <div style={{
                          width: 44, height: 44, flexShrink: 0,
                          borderRadius: 'var(--radius-sm)',
                          background: 'rgba(124,58,237,0.1)',
                          border: '1px solid var(--border-subtle)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <User size={20} strokeWidth={1.5} style={{ color: 'var(--text-muted)' }} />
                        </div>
                      )}
                      <div style={{ minWidth: 0 }}>
                        <h3 style={{
                          fontWeight: 700, fontSize: '0.95rem',
                          color: 'var(--text-primary)',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {folder.discordName}
                        </h3>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
                          Compte Discord
                        </span>
                      </div>
                    </div>
                    <div style={{
                      paddingTop: '0.75rem',
                      borderTop: '1px solid var(--border-subtle)',
                      display: 'flex', alignItems: 'center', gap: '0.4rem',
                    }}>
                      <FolderOpen size={13} strokeWidth={1.5} style={{ color: 'var(--brand-gold)' }} />
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                        {folder.count} fiche{folder.count > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ── FOLDER VIEW ── */}
        {view === 'folder' && !selectedCandidId && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {currentFolder?.candidatures.map((c: any) => (
              <div
                key={c._id}
                onClick={() => setSelectedCandidId(c._id)}
                className="card"
                style={{
                  padding: '1.25rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', minWidth: 0 }}>
                  <FileText size={20} strokeWidth={1.5} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <h4 style={{
                      fontWeight: 600, fontSize: '0.9rem',
                      color: 'var(--text-primary)',
                      marginBottom: '0.15rem',
                    }}>
                      Fiche du {new Date(c.submittedAt || c.updatedAt).toLocaleDateString('fr-FR')}
                    </h4>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {c.rpName}
                    </p>
                  </div>
                </div>
                <StatusBadge status={c.status} />
              </div>
            ))}
          </div>
        )}

        {/* ── CANDIDATURE DETAIL ── */}
        {view === 'folder' && selectedCandidId && activeCandidature && (
          <div style={{ animation: 'fade-up var(--duration-slow) var(--ease-out) both' }}>

            {/* Top status bar */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
              marginBottom: '1.75rem', paddingBottom: '1.25rem',
              borderBottom: '1px solid var(--border-subtle)',
              flexWrap: 'wrap',
            }}>
              <span style={{
                padding: '0.25rem 0.75rem',
                background: 'rgba(124,58,237,0.08)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem', fontWeight: 600,
                color: 'var(--text-muted)',
              }}>
                Dossier : {currentFolder?.discordName}
              </span>
              <StatusBadge status={activeCandidature.status} />
            </div>

            {/* Alert banners */}
            {activeCandidature.status === 'en_attente' && activeCandidature.lastRefusalReason && (
              <div style={{
                display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
                padding: '1rem 1.25rem',
                background: 'rgba(201,168,76,0.06)',
                border: '1px solid rgba(201,168,76,0.25)',
                borderRadius: 'var(--radius-base)',
                marginBottom: '1.25rem',
              }}>
                <AlertTriangle size={16} strokeWidth={1.5} style={{ color: 'var(--brand-gold)', flexShrink: 0, marginTop: 2 }} />
                <div>
                  <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--brand-gold)', marginBottom: '0.25rem' }}>
                    Candidature représentée après un refus
                  </span>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    Ancien motif : "{activeCandidature.lastRefusalReason}"
                  </p>
                </div>
              </div>
            )}

            {activeCandidature.status === 'refuse' && activeCandidature.refusalReason && (
              <div style={{
                padding: '1rem 1.25rem',
                background: 'rgba(239,68,68,0.06)',
                border: '1px solid rgba(239,68,68,0.25)',
                borderRadius: 'var(--radius-base)',
                marginBottom: '1.25rem',
              }}>
                <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#F87171', marginBottom: '0.35rem' }}>
                  Motif du rejet
                </span>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: 1.6 }}>
                  "{activeCandidature.refusalReason}"
                </p>
              </div>
            )}

            {activeCandidature.race === 'Autre' && activeCandidature.status === 'en_attente' && (
              <div style={{
                display: 'flex', gap: '0.625rem', alignItems: 'center',
                padding: '0.75rem 1rem',
                background: 'rgba(201,168,76,0.06)',
                border: '1px solid rgba(201,168,76,0.2)',
                borderRadius: 'var(--radius-base)',
                marginBottom: '1.25rem',
              }}>
                <Ticket size={14} strokeWidth={1.5} style={{ color: 'var(--brand-gold)', flexShrink: 0 }} />
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--brand-gold)', marginRight: '0.5rem' }}>
                    Race particulière détectée
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Un ticket doit être ouvert par le joueur.
                  </span>
                </div>
              </div>
            )}

            {isHighResSkin && activeCandidature.status === 'en_attente' && (
              <div style={{
                display: 'flex', gap: '0.625rem', alignItems: 'center',
                padding: '0.75rem 1rem',
                background: 'rgba(201,168,76,0.06)',
                border: '1px solid rgba(201,168,76,0.2)',
                borderRadius: 'var(--radius-base)',
                marginBottom: '1.25rem',
              }}>
                <Ticket size={14} strokeWidth={1.5} style={{ color: 'var(--brand-gold)', flexShrink: 0 }} />
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--brand-gold)', marginRight: '0.5rem' }}>
                    Skin HD (512×512) détecté
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Un ticket doit être ouvert par le joueur.
                  </span>
                </div>
              </div>
            )}

            {/* Main 2-col layout */}
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>

              {/* Lore + identity */}
              <div style={{
                flex: '1 1 420px',
                background: 'var(--surface-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
              }}>
                <div style={{ marginBottom: '1.5rem', paddingBottom: '1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={labelStyle}>Identité Consignée</span>
                  <h3 style={{
                    fontFamily: 'var(--font-cinzel), serif',
                    fontSize: 'clamp(1.5rem,3vw,2.25rem)',
                    fontWeight: 900, color: 'var(--text-primary)',
                    marginBottom: '0.75rem',
                  }}>
                    {activeCandidature.rpName}
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    {[
                      `${activeCandidature.age} ans`,
                      `Race : ${activeCandidature.race || 'Inconnue'}`,
                      `Taille : ${activeCandidature.taille || 'Inconnue'}`,
                    ].map(label => (
                      <span key={label} style={{
                        padding: '0.2rem 0.625rem',
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
                  { label: 'Description Physique', value: activeCandidature.physique },
                  { label: 'Description Mentale', value: activeCandidature.mental },
                ].map(({ label, value }) => (
                  <div key={label} style={{ marginBottom: '1.25rem' }}>
                    <span style={labelStyle}>{label}</span>
                    <p style={{
                      fontSize: '0.9rem', color: 'var(--text-secondary)',
                      lineHeight: 1.7, fontStyle: 'italic',
                      borderLeft: '2px solid rgba(124,58,237,0.3)',
                      paddingLeft: '0.875rem',
                    }}>
                      {value || 'Non spécifiée'}
                    </p>
                  </div>
                ))}

                <div>
                  <span style={{ ...labelStyle, marginBottom: '0.75rem' }}>Récit & Lore</span>
                  <div style={{ maxHeight: 600, overflowY: 'auto' }}>
                    <LoreRenderer content={activeCandidature.lore} />
                  </div>
                </div>
              </div>

              {/* Skin + actions */}
              <div style={{
                flex: '0 0 240px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
                position: 'sticky', top: 80,
              }}>
                <span style={labelStyle}>Skin{activeSkins.length > 1 ? 's' : ''} 3D ({activeSkins.length})</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', maxHeight: 500, overflowY: 'auto' }}>
                  {activeSkins.map((url: string, i: number) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <SkinViewer3D skinUrl={url} width={activeSkins.length > 1 ? 160 : 220} height={activeSkins.length > 1 ? 220 : 300} />
                      <SkinDimensions url={url} />
                    </div>
                  ))}
                </div>

                <div style={{
                  padding: '0.75rem 1rem',
                  background: 'var(--surface-bg)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-base)',
                  textAlign: 'center', width: '100%',
                }}>
                  <span style={{ display: 'block', ...labelStyle, marginBottom: '0.2rem' }}>Pseudo Minecraft</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                    {activeCandidature.mcPseudo || 'Inconnu'}
                  </span>
                </div>

                {activeCandidature.status === 'en_attente' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', width: '100%' }}>
                    <button
                      onClick={() => handleAction(activeCandidature._id, 'accepte')}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                        width: '100%', minHeight: 48,
                        padding: '0.75rem',
                        background: 'rgba(6,182,212,0.12)',
                        border: '1px solid rgba(6,182,212,0.35)',
                        borderRadius: 'var(--radius-base)',
                        color: 'var(--brand-teal)',
                        fontWeight: 700, fontSize: '0.875rem',
                        cursor: 'pointer',
                        transition: 'background var(--duration-fast) var(--ease-out)',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(6,182,212,0.2)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(6,182,212,0.12)'; }}
                    >
                      <Check size={16} strokeWidth={2} />
                      Accepter
                    </button>
                    <button
                      onClick={() => setRefusalModal({ show: true, id: activeCandidature._id, name: activeCandidature.rpName })}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                        width: '100%', minHeight: 48,
                        padding: '0.75rem',
                        background: 'rgba(239,68,68,0.1)',
                        border: '1px solid rgba(239,68,68,0.3)',
                        borderRadius: 'var(--radius-base)',
                        color: '#F87171',
                        fontWeight: 700, fontSize: '0.875rem',
                        cursor: 'pointer',
                        transition: 'background var(--duration-fast) var(--ease-out)',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
                    >
                      <X size={16} strokeWidth={2} />
                      Rejeter
                    </button>
                  </div>
                ) : (
                  <div style={{
                    width: '100%', padding: '1rem',
                    borderTop: '1px solid var(--border-subtle)',
                    textAlign: 'center',
                  }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Décision par{' '}
                      <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
                        {activeCandidature.reviewedByName || 'un recruteur'}
                      </span>
                    </span>
                    {activeCandidature.reviewedAt && (
                      <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        {new Date(activeCandidature.reviewedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Refusal modal ── */}
      {refusalModal.show && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 'var(--z-modal)' as any,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1.5rem',
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(8px)',
        }}>
          <div style={{
            width: '100%', maxWidth: 480,
            background: 'var(--surface-raised)',
            backdropFilter: 'blur(20px)',
            border: '1px solid var(--border-base)',
            borderRadius: 'var(--radius-xl)',
            padding: '2rem',
            boxShadow: 'var(--shadow-raised)',
          }}>
            <h3 style={{
              fontFamily: 'var(--font-cinzel), serif',
              fontSize: '1.1rem', fontWeight: 700,
              color: 'var(--text-primary)',
              marginBottom: '1.25rem',
            }}>
              Refuser {refusalModal.name} ?
            </h3>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Motif du refus..."
              style={{
                width: '100%', minHeight: 120,
                padding: '0.75rem 1rem',
                background: 'rgba(0,0,0,0.03)',
                border: '1px solid var(--border-base)',
                borderRadius: 'var(--radius-base)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                outline: 'none',
                resize: 'vertical',
                marginBottom: '1.25rem',
                transition: 'border-color var(--duration-fast) var(--ease-out)',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = 'var(--brand-primary)'; }}
              onBlur={e => { e.currentTarget.style.borderColor = 'var(--border-base)'; }}
            />
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setRefusalModal({ show: false, id: '', name: '' })}
                style={{
                  flex: 1, minHeight: 44,
                  background: 'rgba(124,58,237,0.08)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-base)',
                  color: 'var(--text-muted)', fontWeight: 600,
                  fontSize: '0.875rem', cursor: 'pointer',
                  transition: 'color var(--duration-fast) var(--ease-out)',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                Annuler
              </button>
              <button
                onClick={() => handleAction(refusalModal.id, 'refuse', reason)}
                style={{
                  flex: 1, minHeight: 44,
                  background: 'rgba(239,68,68,0.15)',
                  border: '1px solid rgba(239,68,68,0.35)',
                  borderRadius: 'var(--radius-base)',
                  color: '#F87171', fontWeight: 700,
                  fontSize: '0.875rem', cursor: 'pointer',
                  transition: 'background var(--duration-fast) var(--ease-out)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.25)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; }}
              >
                Confirmer le refus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
