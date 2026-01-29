'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
// @ts-ignore
import { FontSize } from 'tiptap-extension-font-size';
// @ts-ignore
import { lineHeight } from 'tiptap-extension-line-height';

// ===== RENDU LORE (JSON) =====
const LoreRenderer = ({ content }: { content: any }) => {
  const editor = useEditor({
    extensions: [StarterKit, TextStyle, FontSize, lineHeight],
    content: content,
    editable: false,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'tiptap-editor focus:outline-none text-neutral-300 prose prose-invert max-w-none text-base font-sans prose-h2:text-[rgba(203,219,252,0.9)] prose-h2:font-black prose-h2:uppercase prose-h2:italic prose-strong:text-white',
      },
    },
  });
  return <EditorContent editor={editor} />;
};

const COLORS = {
  purple: '#683892',
  cardBorder: 'rgba(104, 56, 146, 0.3)',
  cardBg: 'rgba(50, 27, 70, 0.5)',
  textBlue: 'rgba(203, 219, 252, 0.9)',
};

export default function AdminCandidaturesPage() {
  const { data: session, status }: any = useSession();
  const router = useRouter();
  
  const [allCandidatures, setAllCandidatures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'overview' | 'folder'>('overview');
  const [selectedUserKey, setSelectedUserKey] = useState<string | null>(null);

  // ÉTATS POUR LE REFUS
  const [refusalModal, setRefusalModal] = useState<{show: boolean, id: string, name: string}>({show: false, id: '', name: ''});
  const [reason, setReason] = useState('');

  const fetchCandidatures = async () => {
    try {
      const res = await fetch('/api/admin/candidatures');
      if (res.ok) {
        const data = await res.json();
        setAllCandidatures(Array.isArray(data) ? data : []);
      }
    } catch (err) { 
        console.error("Erreur Fetch:", err); 
    } finally { 
        setLoading(false); 
    }
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
    } catch (err) { console.error("Erreur lors de l'action:", err); }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/unauthorized');
    } else if (status === "authenticated") {
      if (session?.user?.isRecruiter) {
        fetchCandidatures();
      } else {
        router.push('/unauthorized');
      }
    }
  }, [session, status, router]);

  // LOGIQUE DE REGROUPEMENT (Dossiers par Discord ID)
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
    
    // Tri des dossiers par date du dernier message dans le dossier
    return Object.values(groups).sort((a: any, b: any) => {
        const dateA = new Date(a.candidatures[0]?.submittedAt || 0).getTime();
        const dateB = new Date(b.candidatures[0]?.submittedAt || 0).getTime();
        return dateB - dateA;
    });
  }, [allCandidatures]);

  // LOGIQUE DES 5 DERNIÈRES (Flux direct)
  const recentCandidatures = useMemo(() => {
    return [...allCandidatures]
      .filter(c => c.status === 'en_attente') // On ne montre que ce qui est à traiter dans le flux rapide
      .sort((a: any, b: any) => 
        new Date(b.submittedAt || b.updatedAt || 0).getTime() - 
        new Date(a.submittedAt || a.updatedAt || 0).getTime()
      )
      .slice(0, 5);
  }, [allCandidatures]);

  const currentFolder = useMemo(() => 
    userFolders.find(f => f.id === selectedUserKey), 
    [userFolders, selectedUserKey]
  );

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#0A0612]">
        <div className="text-neutral-500 font-black tracking-[0.5em] animate-pulse italic uppercase text-xs">
            Lecture du Codex...
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0612] pt-32 px-6 flex flex-col items-center pb-20 font-sans">
      
      {/* MODAL DE REFUS */}
      {refusalModal.show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-[#140b1d] border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
            <h3 className="text-xl font-black text-white uppercase italic mb-4">Refuser {refusalModal.name} ?</h3>
            <textarea 
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Expliquez la raison du rejet..."
              className="w-full h-40 p-4 bg-black/20 border border-white/5 rounded-xl text-white outline-none focus:border-[#683892] transition-all font-sans mb-6"
            />
            <div className="flex gap-4">
              <button onClick={() => {setRefusalModal({show: false, id: '', name: ''}); setReason('');}} className="flex-1 py-4 text-neutral-500 font-bold uppercase text-[10px]">Annuler</button>
              <button onClick={() => handleAction(refusalModal.id, 'refuse', reason)} className="flex-1 py-4 rounded-xl bg-red-600 text-white font-black uppercase text-[10px]">Confirmer</button>
            </div>
          </div>
        </div>
      )}

      <main className="w-full max-w-6xl">
        <header className="flex flex-col items-center mb-16">
          <div className="relative pb-6 text-center group">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-[rgba(203,219,252,0.9)] uppercase italic">
              {view === 'overview' ? 'Gestion des Candidatures' : `Candidature de ${currentFolder?.discordName}`}
            </h1>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-full bg-gradient-to-r from-transparent via-[#683892] to-transparent shadow-[0_0_10px_#683892]" />
          </div>
          
          {view === 'folder' && (
            <button 
              onClick={() => setView('overview')}
              className="mt-8 group relative py-2 flex flex-col items-center transition-transform hover:scale-105"
            >
              <span className="text-neutral-500 uppercase font-black text-[10px] tracking-[0.4em] group-hover:text-white transition-colors">
                ← Retour au Codex
              </span>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-0 bg-gradient-to-r from-transparent via-[#683892] to-transparent transition-all duration-300 group-hover:w-full" />
            </button>
          )}
        </header>

        {allCandidatures.length === 0 ? (
          <div className="text-center py-40 rounded-[4rem] bg-white/[0.02] border border-dashed border-white/10 opacity-50">
            <p className="text-neutral-600 font-black uppercase tracking-[0.5em] text-xs">Le Codex est vide</p>
          </div>
        ) : (
          view === 'overview' ? (
            <div className="space-y-24 animate-in fade-in duration-700">
              
              {/* SECTION 1 : FLUX DES 5 DERNIÈRES (UNIQUEMENT EN ATTENTE) */}
              <section>
                <div className="flex items-center gap-4 mb-8 ml-4">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                  <h2 className="text-xs font-black uppercase tracking-[0.4em] text-neutral-500 italic">Derniers Arrivages (À traiter)</h2>
                </div>
                <div className="grid gap-4">
                  {recentCandidatures.length > 0 ? recentCandidatures.map((c: any) => (
                    <div 
                      key={c._id}
                      onClick={() => { setSelectedUserKey(c.discordId); setView('folder'); }}
                      className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-[#683892]/40 transition-all cursor-pointer flex items-center justify-between group shadow-lg"
                    >
                      <div className="flex items-center gap-5">
                        <div className="h-10 w-10 rounded-xl bg-[#683892]/20 border border-[#683892]/30 flex items-center justify-center text-white font-bold text-lg">
                          {c.rpName?.substring(0,1).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-white font-bold uppercase tracking-tight">{c.rpName}</h3>
                          <p className="text-[9px] text-neutral-500 uppercase font-black tracking-widest italic">
                              Discord: {c.userName || c.name} • Reçu le {new Date(c.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className="text-[9px] text-[#683892] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all mr-4">Examiner →</span>
                    </div>
                  )) : (
                    <p className="text-neutral-700 text-[10px] font-black uppercase tracking-widest ml-4">Aucune candidature en attente de traitement.</p>
                  )}
                </div>
              </section>

              {/* SECTION 2 : ARCHIVES PAR DOSSIERS */}
              <section>
                <h2 className="text-xs font-black uppercase tracking-[0.4em] text-neutral-600 mb-8 ml-4 italic">Archives des Citoyens</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {userFolders.map((folder: any) => (
                    <div 
                      key={folder.id}
                      onClick={() => { setSelectedUserKey(folder.id); setView('folder'); }}
                      className="relative group p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:border-[#683892]/40 transition-all cursor-pointer overflow-hidden shadow-xl"
                    >
                      <div className="absolute -right-4 -bottom-4 text-8xl opacity-[0.03] transform group-hover:scale-110 transition-all">📂</div>
                      
                      <div className="flex items-center gap-4 mb-6">
                        {folder.image ? (
                          <Image src={folder.image} alt="" width={40} height={40} className="rounded-full border border-white/10" />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-[#683892]/10 border border-white/5" />
                        )}
                        <span className="text-[9px] text-neutral-600 font-black uppercase tracking-widest truncate max-w-[150px]">Discord: {folder.discordName}</span>
                      </div>

                      <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">{folder.rpName}</h3>
                      <p className="text-[10px] text-[#CBDBFC] font-black uppercase tracking-widest flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-[#683892]" />
                        {folder.count} Candidature{folder.count > 1 ? 's' : ''}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          ) : (
            /* VUE DOSSIER */
            <div className="grid gap-12 animate-in slide-in-from-bottom-4 duration-700">
              {currentFolder?.candidatures.map((c: any) => (
                <div 
                  key={c._id} 
                  style={{ background: COLORS.cardBg, border: `1px solid ${COLORS.cardBorder}`, backdropFilter: 'blur(20px)' }}
                  className="p-10 rounded-[3rem] shadow-2xl transition-all"
                >
                  <div className="flex justify-between items-start mb-10">
                    <div className="flex items-center gap-6">
                      <div className="h-16 w-16 bg-[#683892]/20 rounded-2xl border border-[#683892]/40 flex items-center justify-center font-black text-2xl text-white">
                        {c.rpName?.substring(0,1).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">{c.rpName}</h3>
                        <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest">
                            {c.age} ans • Discord: {c.userName || c.name}
                        </p>
                      </div>
                    </div>
                    <div className={`px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest 
                      ${c.status === 'en_attente' ? 'border-amber-500/30 text-amber-500 bg-amber-500/5' : 
                        c.status === 'accepte' ? 'border-green-500/30 text-green-500 bg-green-500/5' : 
                        'border-red-500/30 text-red-500 bg-red-500/5'}`}>
                      {c.status === 'en_attente' ? 'Soumis' : c.status === 'accepte' ? 'Accepté' : 'Refusé'}
                    </div>
                  </div>

                  {c.refusalReason && (
                    <div className="mb-8 p-6 bg-red-500/10 border border-red-500/20 rounded-2xl">
                      <span className="block text-[10px] text-red-500 font-black uppercase tracking-widest mb-2">Motif du rejet :</span>
                      <p className="text-sm text-neutral-400 font-medium italic">"{c.refusalReason}"</p>
                    </div>
                  )}

                  <div className="bg-black/30 border border-white/5 p-10 rounded-[2rem] mb-10 shadow-inner overflow-hidden">
                    <LoreRenderer content={c.lore || c.motivations} />
                  </div>

                  {c.status === 'en_attente' ? (
                    <div className="flex flex-col sm:flex-row gap-6">
                      <button 
                        onClick={() => handleAction(c._id, 'accepte')}
                        className="flex-1 group relative py-6 rounded-[2.5rem] overflow-hidden transition-all duration-500 hover:scale-[1.02] active:scale-95 shadow-xl"
                      >
                        <div className="absolute inset-0 bg-white group-hover:bg-[#CBDBFC]" />
                        <span className="relative z-10 text-black font-black uppercase text-xs tracking-[0.4em]">Accepter</span>
                      </button>
                      <button 
                        onClick={() => setRefusalModal({show: true, id: c._id, name: c.rpName})}
                        className="flex-1 group relative py-6 rounded-[2.5rem] overflow-hidden border border-white/10 transition-all hover:bg-red-600 hover:border-red-600 hover:scale-[1.02] active:scale-95"
                      >
                        <span className="relative z-10 text-white font-black uppercase text-xs tracking-[0.4em]">Rejeter</span>
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-6 border-t border-white/5 mt-4">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 italic">
                        Décision enregistrée par <span className="text-[#CBDBFC]">{c.reviewedByName || "un recruteur"}</span> le {new Date(c.reviewedAt || c.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        )}
      </main>
    </div>
  );
}