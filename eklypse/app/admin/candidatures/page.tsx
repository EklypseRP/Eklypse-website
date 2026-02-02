'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import SkinViewer3D from "@/app/components/SkinViewer3D";
// @ts-ignore
import { FontSize } from 'tiptap-extension-font-size';
// @ts-ignore
import { lineHeight } from 'tiptap-extension-line-height';

const DASHBOARD_ANIMATIONS = `
  @keyframes smoothFadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes floatGlow {
    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
    50% { transform: translate(2%, 2%) scale(1.05); opacity: 0.5; }
  }
`;

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
    <div className="mt-2 px-4 py-2 bg-black/40 border border-white/5 rounded-full">
      <span className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: 'rgba(203, 219, 252, 0.9)' }}>
        Format : {dims}
      </span>
    </div>
  );
};

const LoreRenderer = ({ content }: { content: any }) => {
  const editor = useEditor({
    extensions: [StarterKit, TextStyle, FontSize, lineHeight, Underline],
    content: content,
    editable: false,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'tiptap-editor focus:outline-none text-neutral-300 prose prose-invert max-w-none text-base font-sans prose-h2:text-[#CBDBFC] prose-h2:font-black prose-h2:uppercase prose-strong:text-white',
      },
    },
  });
  return <EditorContent editor={editor} />;
};

const COLORS = {
  purple: '#683892',
  cardBorder: 'rgba(104, 56, 146, 0.3)',
  cardBg: 'rgba(50, 27, 70, 0.5)',
};

export default function AdminCandidaturesPage() {
  const { data: session, status }: any = useSession();
  const router = useRouter();
  
  const [allCandidatures, setAllCandidatures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'overview' | 'folder'>('overview');
  const [selectedUserKey, setSelectedUserKey] = useState<string | null>(null);
  const [selectedCandidId, setSelectedCandidId] = useState<string | null>(null);

  const [refusalModal, setRefusalModal] = useState<{show: boolean, id: string, name: string}>({show: false, id: '', name: ''});
  const [reason, setReason] = useState('');

  const fetchCandidatures = async () => {
    try {
      const res = await fetch('/api/admin/candidatures');
      if (res.ok) {
        const data = await res.json();
        setAllCandidatures(Array.isArray(data) ? data : []);
      }
    } catch (err) { console.error("Erreur Fetch:", err); } finally { setLoading(false); }
  };

  const handleAction = async (id: string, action: 'accepte' | 'refuse', refusalReason?: string) => {
    try {
      const res = await fetch('/api/admin/candidature-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: action, reason: refusalReason })
      });
      if (res.ok) {
        setRefusalModal({show: false, id: '', name: ''});
        setReason('');
        fetchCandidatures(); 
      }
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (status === "unauthenticated" || (status === "authenticated" && !session?.user?.isRecruiter)) {
      router.push('/unauthorized');
    } else if (session?.user?.isRecruiter) {
      fetchCandidatures();
    }
  }, [session, status, router]);

  const userFolders = useMemo(() => {
    const groups: { [key: string]: any } = {};
    allCandidatures.forEach((c: any) => {
      const key = c.discordId || "ID_INCONNU";
      if (!groups[key]) {
        groups[key] = {
          id: key,
          discordName: c.userName || c.name || "Inconnu", 
          rpName: c.rpName || "Anonyme",
          image: c.userImage || c.image,
          count: 0,
          candidatures: []
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

  const pendingCandidatures = useMemo(() => {
    return [...allCandidatures]
      .filter(c => c.status === 'en_attente')
      .sort((a, b) => new Date(b.submittedAt || b.updatedAt).getTime() - new Date(a.submittedAt || a.updatedAt).getTime());
  }, [allCandidatures]);

  const currentFolder = useMemo(() => 
    userFolders.find(f => f.id === selectedUserKey), 
    [userFolders, selectedUserKey]
  );

  const activeCandidature = useMemo(() => 
    currentFolder?.candidatures.find((c: any) => c._id === selectedCandidId),
    [currentFolder, selectedCandidId]
  );

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#0A0612] text-neutral-500 font-black tracking-[0.5em] animate-pulse uppercase text-xs">Lecture du Codex...</div>;

  return (
    <div className="min-h-screen bg-[#0a0612] relative overflow-x-hidden font-sans">
      <style dangerouslySetInnerHTML={{ __html: DASHBOARD_ANIMATIONS }} />
      
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-[#683892]/20 blur-[120px]" style={{ animation: 'floatGlow 8s ease-in-out infinite' }} />
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-[#683892]/10 blur-[120px]" style={{ animation: 'floatGlow 12s ease-in-out infinite reverse' }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(104,56,146,0.03)_0%,transparent_100%)]" />
      </div>

      {refusalModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#140b1d] border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
            <h3 className="text-xl font-black text-white uppercase italic mb-4">Refuser {refusalModal.name} ?</h3>
            <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Motif..." className="w-full h-40 p-4 bg-black/20 border border-white/5 rounded-xl text-white outline-none focus:border-[#683892] mb-6" />
            <div className="flex gap-4">
              <button onClick={() => setRefusalModal({show: false, id: '', name: ''})} className="flex-1 py-4 text-neutral-500 font-bold uppercase text-[10px]">Annuler</button>
              <button onClick={() => handleAction(refusalModal.id, 'refuse', reason)} className="flex-1 py-4 rounded-xl bg-red-600 text-white font-black uppercase text-[10px]">Confirmer</button>
            </div>
          </div>
        </div>
      )}

      <main 
        key={view + (selectedCandidId || 'none')} 
        style={{ 
          animation: 'smoothFadeIn 0.8s ease-in-out forwards',
          paddingTop: '8rem',
          paddingBottom: '4rem',
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
        className="px-6 w-full max-w-6xl mx-auto"
      >
        <header className="flex flex-col items-center mb-16 w-full">
          <div className="relative pb-6 text-center group">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-[#CBDBFC] uppercase">
              {view === 'overview' ? 'Gestion des Candidatures' : `Dossier de ${currentFolder?.discordName}`}
            </h1>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-full bg-gradient-to-r from-transparent via-[#683892] to-transparent shadow-[0_0_10px_#683892]" />
          </div>
          
          {view === 'folder' && (
            <button onClick={() => selectedCandidId ? setSelectedCandidId(null) : setView('overview')} className="mt-8 group relative py-2 flex flex-col items-center transition-transform duration-500 ease-out hover:scale-105">
              <span className="text-neutral-500 uppercase font-black text-[12px] tracking-[0.4em] group-hover:text-white transition-colors duration-300">
                {selectedCandidId ? '← Retour au dossier' : '← Retour aux archives'}
              </span>
            </button>
          )}
        </header>

        {view === 'overview' ? (
          <div className="space-y-24 w-full">
            <section>
              <div className="flex items-center gap-4 mb-8 ml-4">
                <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
                <h2 className="text-xs font-black uppercase tracking-[0.4em] text-neutral-500 italic">Candidatures à traiter ({pendingCandidatures.length})</h2>
              </div>
              <div className="grid gap-4 w-full">
                {pendingCandidatures.length > 0 ? pendingCandidatures.map((c: any) => (
                  <div 
                    key={c._id} 
                    onClick={() => { setSelectedUserKey(c.discordId); setView('folder'); setSelectedCandidId(c._id); }} 
                    className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-[#683892]/50 hover:bg-white/[0.05] hover:shadow-2xl transition-all duration-500 ease-out hover:scale-[1.01] cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-5">
                      <div className="h-12 w-12 rounded-2xl bg-[#683892]/20 border border-[#683892]/30 flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform duration-500">{c.rpName?.substring(0,1).toUpperCase()}</div>
                      <div>
                        <h3 className="text-white font-bold uppercase tracking-tight group-hover:text-[#CBDBFC] transition-colors">{c.rpName}</h3>
                        <p className="text-[9px] text-neutral-500 uppercase font-black tracking-widest italic">Discord: {c.userName || c.name} • Reçu le {new Date(c.submittedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className="text-[9px] text-[#683892] font-black uppercase tracking-widest opacity-0 translate-x-[-10px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 mr-4">Examiner →</span>
                  </div>
                )) : <p className="text-neutral-700 text-[10px] font-black uppercase tracking-widest ml-4">Aucune candidature en attente de traitement.</p>}
              </div>
            </section>

            <section className="w-full">
              <h2 className="text-xs font-black uppercase tracking-[0.4em] text-neutral-600 mb-8 ml-4 italic">Archives des Membres</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                {userFolders.map((folder: any) => (
                  <div key={folder.id} onClick={() => { setSelectedUserKey(folder.id); setView('folder'); setSelectedCandidId(null); }} className="relative group p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:border-[#683892]/60 hover:bg-white/[0.06] hover:shadow-2xl transition-all duration-500 ease-out hover:scale-[1.03] cursor-pointer overflow-hidden shadow-xl">
                    <div className="absolute -right-4 -bottom-4 text-8xl opacity-[0.03] transform group-hover:scale-125 transition-all duration-700">📂</div>
                    <div className="flex items-center gap-5 mb-4 relative z-10">
                      {folder.image ? <Image src={folder.image} alt="" width={50} height={50} className="rounded-2xl border border-white/10" /> : <div className="h-[50px] w-[50px] rounded-2xl bg-[#683892]/10 border border-white/5 flex items-center justify-center text-xl">👤</div>}
                      <div className="flex flex-col">
                        <h3 className="text-lg font-black text-white uppercase tracking-tighter leading-tight group-hover:text-[#CBDBFC] transition-colors">{folder.discordName}</h3>
                        <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest">Compte Discord</span>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-white/5 relative z-10">
                      <p className="text-[10px] text-[#CBDBFC] font-black uppercase tracking-widest flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-[#683892]" />{folder.count} Fiche{folder.count > 1 ? 's' : ''} consignée{folder.count > 1 ? 's' : ''}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        ) : (
          <div className="w-full">
            {!selectedCandidId ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                 {currentFolder?.candidatures.map((c: any) => (
                    <div key={c._id} onClick={() => setSelectedCandidId(c._id)} className="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-[#683892]/50 hover:bg-white/[0.04] hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] cursor-pointer flex items-center justify-between group shadow-lg">
                      <div className="flex items-center gap-6">
                        <div className="text-2xl opacity-40 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-500">📄</div>
                        <div>
                          <h4 className="text-white font-bold uppercase tracking-tight group-hover:text-[#CBDBFC] transition-colors">Fiche du {new Date(c.submittedAt || c.updatedAt).toLocaleDateString()}</h4>
                          <p className="text-[9px] text-neutral-500 uppercase font-black tracking-widest italic">Identité RP : {c.rpName}</p>
                        </div>
                      </div>
                      <div className={`px-4 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest transition-all duration-500 ${c.status === 'en_attente' ? 'border-amber-500/30 text-amber-500 bg-amber-500/5 group-hover:bg-amber-500/10' : c.status === 'accepte' ? 'border-green-500/30 text-green-500 bg-green-500/5 group-hover:bg-green-500/10' : 'border-red-500/30 text-red-500 bg-red-500/5 group-hover:bg-red-500/10'}`}>{c.status === 'en_attente' ? 'À traiter' : c.status}</div>
                    </div>
                 ))}
              </div>
            ) : (
              activeCandidature && (
                <div style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.cardBorder}`, backdropFilter: 'blur(20px)' }} className="p-10 rounded-[3rem] shadow-2xl w-full">
                  <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/5">
                    <span className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[9px] font-black text-neutral-400 uppercase tracking-widest">Dossier: {currentFolder?.discordName}</span>
                    <div className={`px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${activeCandidature.status === 'en_attente' ? 'border-amber-500/30 text-amber-500 bg-amber-500/5' : activeCandidature.status === 'accepte' ? 'border-green-500/30 text-green-500 bg-green-500/5' : 'border-red-500/30 text-red-500 bg-red-500/5'}`}>{activeCandidature.status === 'en_attente' ? 'En Attente' : activeCandidature.status.toUpperCase()}</div>
                  </div>

                  {activeCandidature.status === 'en_attente' && activeCandidature.lastRefusalReason && (
                    <div className="mb-8 p-6 bg-amber-500/5 border border-amber-500/20 rounded-[2rem] flex gap-5 items-center">
                      <div className="text-2xl animate-pulse">⚠️</div>
                      <div>
                        <span className="block text-[10px] text-amber-500 font-black uppercase tracking-widest mb-1">Candidature représentée après un refus</span>
                        <p className="text-xs text-neutral-400 italic">"Ancien motif : {activeCandidature.lastRefusalReason}"</p>
                      </div>
                    </div>
                  )}

                  {activeCandidature.status === 'refuse' && activeCandidature.refusalReason && (
                    <div className="mb-8 p-8 bg-red-500/10 border border-red-500/20 rounded-[2.5rem]">
                      <span className="block text-[10px] text-red-500 font-black uppercase tracking-widest mb-3">Motif du rejet :</span>
                      <p className="text-sm text-neutral-200 italic leading-relaxed">"{activeCandidature.refusalReason}"</p>
                    </div>
                  )}

                  {/* AJOUT : BANDEAU D'ALERTE POUR LA RACE "AUTRE" */}
                  {activeCandidature.race === 'Autre' && activeCandidature.status === 'en_attente' && (
                    <div className="mb-8 p-6 bg-amber-500/5 border border-amber-500/20 rounded-[2rem] flex gap-5 items-center shadow-lg">
                      <div className="text-2xl">🎫</div>
                      <div>
                        <span className="block text-[10px] text-amber-500 font-black uppercase tracking-widest mb-1">Race Particulière détectée</span>
                        <p className="text-xs text-neutral-400 italic">Un ticket doit être ouvert par le joueur sous peu pour valider les spécificités de cette race.</p>
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col lg:flex-row gap-10 mb-10">
                    <div className="flex-1 bg-black/30 border border-white/5 p-10 rounded-[2rem] shadow-inner">
                       <div className="mb-10 pb-8 border-b border-white/10">
                          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500">Identité Consignée</span>
                          <h3 className="text-5xl font-black text-white uppercase italic tracking-tighter mt-1">{activeCandidature.rpName}</h3>
                          
                          <div className="flex flex-wrap gap-3 mt-4">
                            <span className="px-3 py-1 bg-[#683892]/20 border border-[#683892]/40 rounded-lg text-sm font-black text-[#CBDBFC] uppercase">{activeCandidature.age} ans</span>
                            <span className={`px-3 py-1 border rounded-lg text-sm font-black uppercase ${activeCandidature.race === 'Autre' ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' : 'bg-[#683892]/20 border-[#683892]/40 text-[#CBDBFC]'}`}>Race : {activeCandidature.race || "Inconnue"}</span>
                            <span className="px-3 py-1 bg-[#683892]/20 border border-[#683892]/40 rounded-lg text-sm font-black text-[#CBDBFC] uppercase">Taille : {activeCandidature.taille || "Inconnue"}</span>
                          </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                          <div className="space-y-3">
                             <span className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em]">Description Physique</span>
                             <p className="text-sm text-[#CBDBFC]/80 leading-relaxed italic border-l border-[#683892]/30 pl-4">{activeCandidature.physique || "Non spécifiée"}</p>
                          </div>
                          <div className="space-y-3">
                             <span className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em]">Description Mentale</span>
                             <p className="text-sm text-[#CBDBFC]/80 leading-relaxed italic border-l border-[#683892]/30 pl-4">{activeCandidature.mental || "Non spécifiée"}</p>
                          </div>
                       </div>

                       <div className="mb-6 opacity-30 text-[10px] font-black uppercase tracking-[0.4em] text-white">Récit & Lore</div>
                       <LoreRenderer content={activeCandidature.lore} />
                    </div>
                    <div className="flex flex-col items-center gap-4">
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500">Skin 3D</span>
                      <SkinViewer3D skinUrl={activeCandidature.skinUrl} width={250} height={350} />
                      
                      <div className="mt-4 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-center w-full">
                         <span className="block text-[8px] text-neutral-500 uppercase font-black tracking-widest mb-1">Pseudo Minecraft</span>
                         <span className="text-sm font-bold text-[#CBDBFC] tracking-tight">{activeCandidature.mcPseudo || "Inconnu"}</span>
                      </div>
                      
                      <SkinDimensions url={activeCandidature.skinUrl} />
                    </div>
                  </div>

                  {activeCandidature.status === 'en_attente' ? (
                    <div className="flex flex-col sm:flex-row gap-6 mt-12">
                      <button onClick={() => handleAction(activeCandidature._id, 'accepte')} className="flex-1 py-6 rounded-[2.5rem] bg-white text-black font-black uppercase text-xs tracking-[0.4em] hover:bg-[#CBDBFC] hover:scale-[1.02] active:scale-95 transition-all duration-500 shadow-xl">Accepter</button>
                      <button onClick={() => setRefusalModal({show: true, id: activeCandidature._id, name: activeCandidature.rpName})} className="flex-1 py-6 rounded-[2.5rem] border border-white/10 text-white font-black uppercase text-xs tracking-[0.4em] hover:bg-red-600 hover:border-red-600 hover:scale-[1.02] active:scale-95 transition-all duration-500">Rejeter</button>
                    </div>
                  ) : (
                    <div className="text-center py-8 border-t border-white/5 mt-6">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 italic">Décision par <span className="text-[#CBDBFC]">{activeCandidature.reviewedByName || "un recruteur"}</span></span>
                        {activeCandidature.reviewedAt && (
                          <span className="text-[9px] font-bold text-neutral-600 uppercase tracking-widest">
                            le {new Date(activeCandidature.reviewedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        )}
      </main>
    </div>
  );
}