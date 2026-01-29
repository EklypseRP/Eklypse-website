'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
// @ts-ignore
import { FontSize } from 'tiptap-extension-font-size';
// @ts-ignore
import { lineHeight } from 'tiptap-extension-line-height';
import debounce from 'lodash.debounce';

const EDITOR_STYLES = `
  .tiptap-editor strong { font-weight: bold !important; color: white; }
  .tiptap-editor em { font-style: italic !important; }
  .tiptap-editor u { text-decoration: underline !important; }
  .tiptap-editor h2 { font-size: 1.5rem !important; font-weight: bold !important; margin-top: 1.5rem !important; color: #CBDBFC; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.5rem; }
  .tiptap-editor ul { list-style-type: disc !important; padding-left: 1.5rem !important; margin-bottom: 1rem !important; }
  .tiptap-editor p { margin-bottom: 1rem; }

  /* Personnalisation de la barre de défilement interne */
  .custom-scrollbar::-webkit-scrollbar { width: 6px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(104, 56, 146, 0.3); border-radius: 10px; }
  .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(104, 56, 146, 0.6); }

  input:-webkit-autofill,
  input:-webkit-autofill:hover, 
  input:-webkit-autofill:focus {
    -webkit-text-fill-color: white !important;
    -webkit-box-shadow: 0 0 0px 1000px #1c0f26 inset !important;
    transition: background-color 5000s ease-in-out 0s;
  }
`;

const ToolbarButton = ({ onClick, isActive, children, title }: { onClick: () => void, isActive: boolean, children: React.ReactNode, title: string }) => (
  <button
    type="button"
    onMouseDown={(e) => { e.preventDefault(); onClick(); }} 
    title={title}
    className={`
      flex items-center justify-center min-w-[50px] h-[45px] px-3 rounded-xl border transition-all duration-300
      ${isActive 
        ? 'bg-[#683892] border-[#683892] text-white shadow-[0_0_15px_rgba(104,56,146,0.5)] scale-105' 
        : 'bg-white/5 border-white/10 text-neutral-500 hover:border-[#683892]/60 hover:text-white'}
    `}
  >
    {children}
  </button>
);

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;
  return (
    <div className="sticky top-0 z-[40] flex items-center justify-center flex-wrap gap-4 p-5 bg-[#0e0816] border-b border-white/10 w-full font-sans shadow-xl rounded-t-[2.5rem]">
      <div className="flex gap-2 pr-4 border-r border-white/10">
        <ToolbarButton title="Gras" onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')}>
          <span className="font-black text-lg">B</span>
        </ToolbarButton>
        <ToolbarButton title="Italique" onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')}>
          <span className="italic font-serif text-lg">I</span>
        </ToolbarButton>
        <ToolbarButton title="Souligné" onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')}>
          <span className="underline font-serif text-lg">U</span>
        </ToolbarButton>
      </div>

      <div className="flex gap-3 px-4 border-r border-white/10 font-sans">
        <div className="flex flex-col gap-1">
          <span className="text-[14px] uppercase font-bold text-neutral-600 ml-1">Taille</span>
          <select 
            className="bg-white/5 border border-white/10 text-[14px] text-neutral-400 rounded-lg px-2 py-1 outline-none hover:border-[#683892]/50 transition-colors cursor-pointer font-sans"
            onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}
          >
            <option value="16px">16px</option>
            <option value="14px">14px</option>
            <option value="18px">18px</option>
            <option value="22px">22px</option>
          </select>
        </div>
        
        <div className="flex flex-col gap-1">
          <span className="text-[14px] uppercase font-bold text-neutral-600 ml-1">Espace</span>
          <select 
            className="bg-white/5 border border-white/10 text-[14px] text-neutral-400 rounded-lg px-2 py-1 outline-none hover:border-[#683892]/50 transition-colors cursor-pointer font-sans"
            onChange={(e) => editor.chain().focus().setLineHeight(e.target.value).run()}
          >
            <option value="1.5">1.5</option>
            <option value="1.2">1.2</option>
            <option value="1.8">1.8</option>
            <option value="2.0">2.0</option>
          </select>
        </div>
      </div>

      <div className="flex gap-2 pl-2">
        <ToolbarButton title="Titre" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })}>
          <span className="text-[10px] uppercase font-black">Titre</span>
        </ToolbarButton>
        <ToolbarButton title="Liste" onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')}>
          <span className="text-xl">•—</span>
        </ToolbarButton>
      </div>
    </div>
  );
};

export default function CandidatureForm() {
  const [view, setView] = useState<'history' | 'form'>('history');
  const [history, setHistory] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<any | null>(null);
  const [formData, setFormData] = useState({ rpName: '', age: '' });
  const [status, setStatus] = useState<'idle' | 'brouillon' | 'en_attente' | 'accepte' | 'refuse' | 'error'>('idle');
  const [refusalReason, setRefusalReason] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [loading, setLoading] = useState(true);

  const fetchCandidatures = async () => {
    try {
      const savedDraft = localStorage.getItem('eklypse_candidature_draft');
      if (savedDraft) setDraft(JSON.parse(savedDraft));

      const res = await fetch('/api/candidature');
      if (res.ok) {
        const data = await res.json();
        if (data.exists) {
          setHistory(data.history || []);
          const latest = data.history[0];
          setStatus(latest.status);
          setRefusalReason(latest.refusalReason || null);
          setFormData({ rpName: latest.rpName || '', age: latest.age?.toString() || '' });
        }
      }
    } catch (err) {
      console.error("Erreur chargement:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidatures();
  }, []);

  const saveToLocal = useCallback(
    debounce((currentData: typeof formData, loreJson: any) => {
      if (status !== 'idle' && status !== 'brouillon') return;
      const draftData = { ...currentData, lore: loreJson, timestamp: Date.now() };
      localStorage.setItem('eklypse_candidature_draft', JSON.stringify(draftData));
      setDraft(draftData);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 1500); 
    }, 2000), 
    [status]
  );

  const editor = useEditor({
    extensions: [StarterKit, TextStyle, FontSize, lineHeight, Underline],
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'tiptap-editor focus:outline-none p-10 text-white prose prose-invert max-w-none text-base outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      if ((status === 'idle' || status === 'brouillon') && !loading) {
        setSaveStatus('saving');
        saveToLocal(formData, editor.getJSON());
      }
    },
  });

  const handleEditApplication = (c: any) => {
    setEditingId(c._id);
    setFormData({ rpName: c.rpName || '', age: c.age?.toString() || '' });
    if (editor && c.lore) {
      editor.commands.setContent(c.lore);
    }
    setStatus('idle');
    setView('form');
  };

  const handleResumeDraft = () => {
    if (draft && editor) {
      setEditingId(null);
      setFormData({ rpName: draft.rpName || '', age: draft.age || '' });
      editor.commands.setContent(draft.lore || '');
      setStatus('idle');
      setView('form');
    }
  };

  const handleDeleteDraft = (e: React.MouseEvent) => {
    e.stopPropagation();
    if(confirm("Supprimer définitivement ce brouillon ?")) {
      localStorage.removeItem('eklypse_candidature_draft');
      setDraft(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let finalValue = value;
    if (name === 'age') finalValue = value.replace(/[^0-9]/g, '');

    const newFormData = { ...formData, [name]: finalValue };
    setFormData(newFormData);
    if (status === 'idle' || status === 'brouillon') {
      setSaveStatus('saving');
      saveToLocal(newFormData, editor?.getJSON() || null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editor || loading) return;
    if (parseInt(formData.age) < 16) {
      alert("L'âge minimum requis est de 16 ans.");
      return;
    }
    saveToLocal.cancel();
    setLoading(true);
    try {
      const response = await fetch('/api/candidature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formData, 
          lore: editor.getJSON(), 
          isFinalSubmit: true,
          id: editingId 
        }),
      });
      if (response.ok) {
        localStorage.removeItem('eklypse_candidature_draft');
        setDraft(null);
        setEditingId(null);
        await fetchCandidatures();
        setStatus('en_attente');
        editor.setEditable(false);
      } else {
        setStatus('error');
      }
    } catch (error) { setStatus('error'); } finally { setLoading(false); }
  };

  if (loading) return (
    <div className="text-center py-20 animate-pulse font-black uppercase text-xs tracking-[0.5em] text-neutral-500">
      Consultation du Codex...
    </div>
  );

  // --- VUE 1 : ESPACE CITOYEN ---
  if (view === 'history') {
    return (
      <div className="max-w-4xl mx-auto space-y-16 animate-in fade-in duration-700">
        <div className="flex flex-col items-center gap-6">
          <button 
            onClick={() => {
              setEditingId(null);
              setFormData({ rpName: '', age: '' });
              editor?.commands.clearContent();
              setStatus('idle');
              setView('form');
            }}
            disabled={history.some(c => c.status === 'en_attente')}
            className="group relative px-16 py-8 rounded-[3rem] overflow-hidden transition-all duration-500 hover:scale-[1.05] active:scale-95 shadow-2xl disabled:opacity-30 disabled:grayscale"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#683892] to-[#321B46]" />
            <span className="relative z-10 text-white font-black uppercase text-sm tracking-[0.4em]">
               {history.some(c => c.status === 'en_attente') ? "Étude en cours..." : "Sceller un nouveau Récit"}
            </span>
          </button>
        </div>

        {draft && !history.some(c => c.status === 'en_attente') && (
          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-500/80 ml-4 italic border-l border-amber-500/30 pl-4 animate-pulse">Brouillon non scellé</h3>
            <div onClick={handleResumeDraft} className="group relative p-8 rounded-[2.5rem] bg-amber-500/[0.02] border border-amber-500/10 hover:border-amber-500/30 transition-all cursor-pointer shadow-xl overflow-hidden">
              <div className="flex justify-between items-center relative z-10">
                <div>
                  <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter">{draft.rpName || "Récit sans nom"}</h4>
                  <p className="text-[9px] text-amber-500/60 uppercase font-black tracking-widest mt-1">Dernière modification : {new Date(draft.timestamp).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-4">
                   <button onClick={handleDeleteDraft} className="p-3 text-neutral-600 hover:text-red-500 transition-colors uppercase font-black text-[9px]">Supprimer</button>
                   <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest group-hover:translate-x-1 transition-transform">Reprendre →</span>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 h-[1px] w-0 bg-amber-500/50 group-hover:w-full transition-all duration-700" />
            </div>
          </div>
        )}

        <div className="space-y-6">
          <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-neutral-600 ml-4 italic border-l border-[#683892] pl-4">Archives du Codex</h3>
          {history.length === 0 ? (
            <div className="p-16 border border-dashed border-white/5 rounded-[3rem] text-center opacity-30">
              <p className="text-xs font-black uppercase tracking-widest text-white">Aucune trace de vous dans le Codex</p>
            </div>
          ) : (
            history.map((c) => (
              <div key={c._id} className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] transition-all hover:bg-white/[0.04] shadow-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter">{c.rpName}</h4>
                    <p className="text-[9px] text-neutral-500 uppercase font-black tracking-widest mt-1">Soumis le {new Date(c.submittedAt || c.updatedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    {c.status === 'refuse' && (
                        <button 
                            onClick={() => handleEditApplication(c)}
                            className="px-6 py-2 bg-[#683892]/20 border border-[#683892]/40 rounded-xl text-[9px] font-black text-white hover:bg-[#683892] transition-all uppercase tracking-widest"
                        >
                            Modifier & Renvoyer
                        </button>
                    )}
                    <div className={`px-5 py-2 rounded-full border text-[9px] font-black uppercase tracking-widest 
                        ${c.status === 'en_attente' ? 'border-amber-500/30 text-amber-500 bg-amber-500/5' : 
                        c.status === 'accepte' ? 'border-green-500/30 text-green-500 bg-green-500/5' : 
                        'border-red-500/30 text-red-500 bg-red-500/5'}`}>
                        {c.status === 'en_attente' ? 'En Attente' : c.status === 'accepte' ? 'Accepté' : 'Refusé'}
                    </div>
                  </div>
                </div>
                {c.status === 'refuse' && c.refusalReason && (
                  <div className="mt-6 p-6 bg-red-900/10 border border-red-900/20 rounded-2xl">
                    <span className="block text-[10px] text-red-500 font-black uppercase tracking-widest mb-2">Raison du refus :</span>
                    <p className="text-neutral-300 text-sm italic font-medium">"{c.refusalReason}"</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // --- VUE 2 : ÉCRANS DE STATUT ---
  if (status === 'en_attente' || status === 'accepte' || status === 'refuse') {
    return (
      <div className="max-w-4xl mx-auto py-16 animate-in fade-in duration-1000 font-sans text-center">
        <style dangerouslySetInnerHTML={{ __html: EDITOR_STYLES }} />
        <button onClick={() => setView('history')} className="mb-12 text-[9px] font-black text-neutral-600 hover:text-white uppercase tracking-[0.4em] transition-colors">← Retour à l'espace citoyen</button>
        <div className="text-7xl mb-8">{status === 'en_attente' && "📜"}{status === 'accepte' && "⚔️"}{status === 'refuse' && "🌑"}</div>
        <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-white mb-4">{status === 'en_attente' && "Candidature Scellée"}{status === 'accepte' && "Citoyen Adoubé"}{status === 'refuse' && "Récit Écarté"}</h2>
        
        <div className="flex flex-col items-center gap-2 mb-12">
          <p className="text-neutral-500 uppercase font-black text-[10px] tracking-[0.4em]">{status === 'en_attente' && "En attente de lecture par les hautes instances"}{status === 'accepte' && "Votre destin s'écrit désormais parmi nous"}{status === 'refuse' && "Le conseil n'a pas retenu votre plume"}</p>
          <div className="h-px w-20 bg-[#683892]/40 mt-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto mb-10">
          <div className="bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] text-left">
            <span className="block text-[10px] text-neutral-500 font-black uppercase tracking-widest mb-1">Identité RP</span>
            <span className="text-xl font-black text-white uppercase italic tracking-tighter">{formData.rpName}</span>
          </div>
          <div className="bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] text-left">
            <span className="block text-[10px] text-neutral-500 font-black uppercase tracking-widest mb-1">Âge du Citoyen</span>
            <span className="text-xl font-black text-white uppercase italic tracking-tighter">{formData.age} ans</span>
          </div>
        </div>

        {status === 'refuse' && refusalReason && (
          <div className="mb-12 p-8 bg-red-900/10 border border-red-900/20 rounded-[2.5rem] text-left relative overflow-hidden group"><div className="absolute top-0 left-0 w-1 h-full bg-red-600/50" /><span className="block text-[10px] text-red-500 font-black uppercase tracking-widest mb-3">Commentaire du Recruteur :</span><p className="text-neutral-300 italic font-medium leading-relaxed">"{refusalReason}"</p></div>
        )}

        <div className="relative p-10 bg-black/40 border border-white/5 rounded-[3rem] text-left shadow-2xl overflow-hidden group">
          <div className="mb-6 opacity-30">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white">Récit & Lore</span>
          </div>
          <EditorContent editor={editor} className="tiptap-editor-readonly" />
        </div>

        {status === 'refuse' && (
          <button 
            onClick={() => {
                const currentRefused = history.find(h => h.status === 'refuse');
                if (currentRefused) handleEditApplication(currentRefused);
                else setStatus('idle');
            }} 
            className="mt-12 group relative py-3 px-8 flex flex-col items-center mx-auto transition-all"
          >
            <span className="text-neutral-500 uppercase font-black text-[10px] tracking-[0.4em] group-hover:text-white transition-colors">Modifier mon récit & Retenter</span>
            <div className="absolute bottom-0 h-[2px] w-0 bg-gradient-to-r from-transparent via-[#683892] to-transparent transition-all duration-500 group-hover:w-full" />
          </button>
        )}
      </div>
    );
  }

  // --- VUE 3 : FORMULAIRE ---
  const inputClassName = "w-full p-5 bg-white/[0.03] border border-white/10 rounded-2xl text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#683892] focus:bg-white/[0.05] focus:ring-4 focus:ring-[#683892]/10 transition-all duration-300 font-sans";

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700">
      
      <div className="flex justify-between items-center px-2">
        <button 
          onClick={() => setView('history')} 
          className="text-[9px] font-black text-neutral-600 hover:text-white uppercase tracking-[0.4em] transition-colors"
        >
          ← Abandonner la rédaction
        </button>

        {editingId && (
          <div className="animate-in fade-in slide-in-from-right-2 duration-500">
            <span className="px-4 py-1.5 bg-[#683892]/20 border border-[#683892]/40 rounded-full text-[8px] font-black text-[#CBDBFC] uppercase tracking-[0.3em]">
              Mode Mise à Jour du Récit
            </span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-12 font-sans">
        <style dangerouslySetInnerHTML={{ __html: EDITOR_STYLES }} />

        <div className="max-w-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-2">
            <label className="block text-base font-black text-neutral-500 uppercase tracking-[0.2em] mb-4 ml-1">Identité RP</label>
            <input name="rpName" value={formData.rpName} onChange={handleInputChange} required autoComplete="off" placeholder="Ex: Alistair" className={inputClassName} />
          </div>
          <div className="space-y-2">
            <label className="block text-base font-black text-neutral-500 uppercase tracking-[0.2em] mb-4 ml-1">Âge (Min. 16)</label>
            <input name="age" type="text" inputMode="numeric" value={formData.age} onChange={handleInputChange} required autoComplete="off" placeholder="16" className={inputClassName} />
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-base font-black text-neutral-500 uppercase tracking-[0.2em] mb-4 ml-1">Récit & Lore</label>
          
          {/* STRUCTURE FIXE AVEC SCROLL INTERNE */}
          <div className="group relative h-[650px] flex flex-col border border-white/10 rounded-[2.5rem] bg-white/[0.02] focus-within:border-[#683892] transition-all shadow-3xl overflow-hidden">
            <MenuBar editor={editor} />
            <div className="flex-1 overflow-y-auto custom-scrollbar">
               <EditorContent editor={editor} />
            </div>
          </div>

          <div className="flex justify-end px-4 mt-2">
            <div className="flex items-center gap-2">
              <div className={`h-1.5 w-1.5 rounded-full ${saveStatus === 'saving' ? 'bg-amber-500 animate-pulse' : saveStatus === 'saved' ? 'bg-blue-400' : 'bg-neutral-700'}`} />
              <span className="text-[10px] font-black uppercase tracking-widest opacity-40 italic">
                {saveStatus === 'saving' ? "Mise en cache..." : saveStatus === 'saved' ? "Brouillon sécurisé" : "Prêt"}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-8 flex justify-center">
          <button type="submit" disabled={loading} className="group relative w-full max-w-2xl py-7 rounded-[3rem] overflow-hidden transition-all duration-500 hover:scale-[1.02] active:scale-95 disabled:opacity-50">
            <div className="absolute inset-0 bg-gradient-to-br from-[#683892] to-[#321B46]" />
            <span className="relative z-10 text-white font-black uppercase text-sm tracking-[0.5em]">
              {editingId ? "Mettre à jour le Parchemin" : "Sceller le Parchemin"}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
}