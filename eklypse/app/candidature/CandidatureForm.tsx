'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import SkinViewer3D from "../components/SkinViewer3D";
// @ts-ignore
import { FontSize } from 'tiptap-extension-font-size';
// @ts-ignore
import { lineHeight } from 'tiptap-extension-line-height';
import debounce from 'lodash.debounce';

// ===== ANIMATION D'ENTRÉE =====
const FADE_IN_ANIMATION = `
  @keyframes smoothFadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

// ===== COMPOSANT ANALYSE DIMENSIONS =====
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

const EDITOR_STYLES = `
  .tiptap-editor strong { font-weight: bold !important; color: white; }
  .tiptap-editor em { font-style: italic !important; }
  .tiptap-editor u { text-decoration: underline !important; }
  .tiptap-editor h2 { font-size: 1.5rem !important; font-weight: bold !important; margin-top: 1.5rem !important; color: #CBDBFC; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.5rem; }
  .tiptap-editor ul { list-style-type: disc !important; padding-left: 1.5rem !important; margin-bottom: 1rem !important; }
  .tiptap-editor p { margin-bottom: 1rem; line-height: 1.6; }
  .custom-scrollbar::-webkit-scrollbar { width: 6px; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(104, 56, 146, 0.3); border-radius: 10px; }
`;

const ToolbarButton = ({ onClick, isActive, children, title }: { onClick: () => void, isActive: boolean, children: React.ReactNode, title: string }) => (
  <button type="button" onMouseDown={(e) => { e.preventDefault(); onClick(); }} title={title} className={`flex items-center justify-center min-w-[50px] h-[45px] px-3 rounded-xl border transition-all duration-300 ${isActive ? 'bg-[#683892] border-[#683892] text-white shadow-[0_0_15px_rgba(104,56,146,0.5)] scale-105' : 'bg-white/5 border-white/10 text-neutral-500 hover:text-white'}`}>{children}</button>
);

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;
  return (
    <div className="sticky top-0 z-[40] flex items-center justify-center flex-wrap gap-4 p-5 bg-[#0e0816] border-b border-white/10 w-full font-sans shadow-xl rounded-t-[2.5rem]">
      <div className="flex gap-2 pr-4 border-r border-white/10">
        <ToolbarButton title="Gras" onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')}><span className="font-black text-lg">B</span></ToolbarButton>
        <ToolbarButton title="Italique" onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')}><span className="italic font-serif text-lg">I</span></ToolbarButton>
        <ToolbarButton title="Souligné" onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')}><span className="underline font-serif text-lg">U</span></ToolbarButton>
      </div>
      <div className="flex gap-3 px-4 border-r border-white/10 font-sans">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase font-bold text-neutral-600 ml-1">Taille</span>
          <select className="bg-white/5 border border-white/10 text-[12px] text-neutral-400 rounded-lg px-2 py-1 outline-none cursor-pointer" onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}>
            <option value="16px">16px</option><option value="14px">14px</option><option value="18px">18px</option><option value="22px">22px</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase font-bold text-neutral-600 ml-1">Espace</span>
          <select className="bg-white/5 border border-white/10 text-[12px] text-neutral-400 rounded-lg px-2 py-1 outline-none cursor-pointer" onChange={(e) => editor.chain().focus().setLineHeight(e.target.value).run()}>
            <option value="1.5">1.5</option><option value="1.2">1.2</option><option value="1.8">1.8</option>
          </select>
        </div>
      </div>
      <div className="flex gap-2 pl-2">
        <ToolbarButton title="Titre" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })}><span className="text-[10px] uppercase font-black">Titre</span></ToolbarButton>
        <ToolbarButton title="Liste" onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')}><span className="text-xl">•—</span></ToolbarButton>
      </div>
    </div>
  );
};

export default function CandidatureForm() {
  const [view, setView] = useState<'history' | 'form' | 'details'>('history');
  const [history, setHistory] = useState<any[]>([]);
  const [draft, setDraft] = useState<any | null>(null);
  const [selectedCandid, setSelectedCandid] = useState<any | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentRefusalReason, setCurrentRefusalReason] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({ rpName: '', age: '', skinUrl: '' });
  const [skinPreview, setSkinPreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

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

  const saveToLocal = useCallback(
    debounce((currentData: typeof formData, loreJson: any) => {
      const draftData = { ...currentData, lore: loreJson, timestamp: Date.now() };
      localStorage.setItem('eklypse_candidature_draft', JSON.stringify(draftData));
      setDraft(draftData);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 1500); 
    }, 2000), []
  );

  const editor = useEditor({
    extensions: [StarterKit, TextStyle, FontSize, lineHeight, Underline],
    immediatelyRender: false,
    editorProps: { attributes: { class: 'tiptap-editor focus:outline-none p-10 text-white prose prose-invert max-w-none text-base outline-none' } },
    onUpdate: ({ editor }) => {
      setSaveStatus('saving');
      saveToLocal(formData, editor.getJSON());
    }
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    setSkinPreview(localUrl);
    setIsUploading(true);
    const data = new FormData();
    data.append("file", file);
    try {
      const res = await fetch("/api/upload/skin", { method: "POST", body: data });
      const result = await res.json();
      if (result.success) {
        const newFormData = { ...formData, skinUrl: result.url };
        setFormData(newFormData);
        saveToLocal(newFormData, editor?.getJSON());
      }
    } catch (err) { alert("Erreur upload"); } finally { setIsUploading(false); }
  };

  const handleEditApplication = (c: any) => {
    setEditingId(c._id);
    setCurrentRefusalReason(c.refusalReason || null);
    setFormData({ rpName: c.rpName || '', age: c.age?.toString() || '', skinUrl: c.skinUrl || '' });
    setSkinPreview(c.skinUrl || null);
    if (editor) editor.commands.setContent(c.lore || '');
    setView('form');
  };

  const handleResumeDraft = () => {
    if (!draft) return;
    setEditingId(null);
    setCurrentRefusalReason(null);
    setFormData({ rpName: draft.rpName || '', age: draft.age || '', skinUrl: draft.skinUrl || '' });
    setSkinPreview(draft.skinUrl || null);
    if (editor) editor.commands.setContent(draft.lore || '');
    setView('form');
  };

  const handleDeleteDraft = (e: React.MouseEvent) => {
    e.stopPropagation();
    if(confirm("Supprimer le brouillon ?")) {
      localStorage.removeItem('eklypse_candidature_draft');
      setDraft(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let finalValue = value;
    if (name === 'age') finalValue = value.replace(/[^0-9]/g, '');
    else if (name === 'rpName') finalValue = value.replace(/[0-9]/g, '');
    const newFormData = { ...formData, [name]: finalValue };
    setFormData(newFormData);
    setSaveStatus('saving');
    saveToLocal(newFormData, editor?.getJSON());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editor || loading) return;
    if (parseInt(formData.age) < 16) return alert("Âge minimum : 16 ans.");
    if (editor.getText().trim().length === 0) return alert("Lore vide.");
    if (!formData.skinUrl) return alert("Skin obligatoire.");

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

  if (loading) return <div className="text-center py-40 animate-pulse font-black uppercase text-xs text-neutral-500 tracking-[0.5em]">Consultation des archives...</div>;

  // --- WRAPPER ANIMÉ POUR TOUT LE COMPOSANT ---
  return (
    <div 
      key={view + (editingId || 'new') + (selectedCandid?._id || 'none')} 
      style={{ animation: 'smoothFadeIn 0.8s ease-in-out forwards' }}
      className="w-full"
    >
      <style dangerouslySetInnerHTML={{ __html: FADE_IN_ANIMATION + EDITOR_STYLES }} />

      {/* VUE : HISTORIQUE */}
      {view === 'history' && (
        <div className="w-full space-y-16">
          <div className="flex flex-col items-center">
            <button 
              onClick={() => {
                setEditingId(null);
                setCurrentRefusalReason(null);
                setFormData({ rpName: '', age: '', skinUrl: '' });
                setSkinPreview(null);
                editor?.commands.clearContent();
                setView('form');
              }}
              disabled={history.some(c => c.status === 'en_attente')}
              className="group relative px-16 py-8 rounded-[3rem] overflow-hidden transition-all duration-500 hover:scale-[1.05] shadow-2xl disabled:opacity-30"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#683892] to-[#321B46]" />
              <span className="relative z-10 text-white font-black uppercase text-sm tracking-[0.4em]">
                {history.some(c => c.status === 'en_attente') ? "Étude en cours..." : "Sceller un nouveau Récit"}
              </span>
            </button>
          </div>

          {draft && !history.some(c => c.status === 'en_attente') && (
            <div className="space-y-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-amber-500/80 ml-4 italic border-l border-amber-500/30 pl-4 animate-pulse">Brouillon en attente</h3>
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
              </div>
            </div>
          )}

          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-neutral-600 ml-4 italic border-l border-[#683892] pl-4">Archives d'Eklypse</h3>
            {history.length === 0 && !draft ? (
              <div className="p-16 border border-dashed border-white/5 rounded-[3rem] text-center opacity-30">
                <p className="text-xs font-black uppercase text-white tracking-widest">Aucune trace dans les archives</p>
              </div>
            ) : (
              history.map((c) => (
                <div key={c._id} 
                  onClick={() => c.status !== 'refuse' && (setSelectedCandid(c), editor?.commands.setContent(c.lore), setView('details'))}
                  className={`group bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] flex justify-between items-center shadow-lg transition-all 
                    ${c.status === 'refuse' ? 'cursor-default opacity-80' : 'cursor-pointer hover:bg-white/[0.04]'}`}
                >
                  <div>
                    <h4 className={`text-2xl font-black text-white uppercase italic tracking-tighter ${c.status !== 'refuse' && 'group-hover:text-[#CBDBFC]'} transition-colors`}>{c.rpName}</h4>
                    <p className="text-[9px] text-neutral-500 uppercase tracking-widest mt-1">Soumis le {new Date(c.submittedAt || c.updatedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    {c.status === 'refuse' && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleEditApplication(c); }}
                        className="px-6 py-2 bg-red-600 border border-red-500 rounded-xl text-[9px] font-black text-white hover:bg-red-700 transition-all uppercase"
                      >
                        Corriger
                      </button>
                    )}
                    <div className={`px-5 py-2 rounded-full border text-[9px] font-black uppercase tracking-widest 
                      ${c.status === 'en_attente' ? 'border-amber-500/30 text-amber-500 bg-amber-500/5' : 
                        c.status === 'accepte' ? 'border-green-500/30 text-green-500 bg-green-500/5' : 
                        'border-red-500/30 text-red-500 bg-red-500/5'}`}>
                      {c.status === 'en_attente' ? 'En Attente' : c.status === 'accepte' ? 'Acceptée' : 'Refusée'}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* VUE : DÉTAILS */}
      {view === 'details' && selectedCandid && (
        <div className="w-full">
          <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/5">
              <button onClick={() => setView('history')} className="text-[12px] font-black text-neutral-500 hover:text-white uppercase tracking-[0.4em] transition-colors">← Revenir aux archives</button>
              <div className={`px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest
                  ${selectedCandid.status === 'en_attente' ? 'border-amber-500/30 text-amber-500 bg-amber-500/5' : 
                    selectedCandid.status === 'accepte' ? 'border-green-500/30 text-green-500 bg-green-500/5' : 
                    'border-red-500/30 text-red-500 bg-red-500/5'}`}>
                  {selectedCandid.status === 'en_attente' ? 'Étude en cours' : 
                  selectedCandid.status === 'accepte' ? 'Candidature Acceptée' : 'Récit Écarté'}
              </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-8 bg-black/30 border border-white/5 p-10 rounded-[2.5rem] shadow-inner">
                 <div className="mb-10 pb-8 border-b border-white/10">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-500">Identité RP</span>
                    <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter mt-1">{selectedCandid.rpName}</h2>
                    <span className="inline-block mt-4 px-3 py-1 bg-[#683892]/20 border border-[#683892]/40 rounded-lg text-sm font-black text-[#CBDBFC] uppercase">{selectedCandid.age} ans</span>
                 </div>
                 <div className="mb-6 opacity-30 text-[10px] font-black uppercase tracking-[0.4em] text-white">Récit & Lore</div>
                 <div className="max-h-[600px] overflow-y-auto custom-scrollbar pr-4">
                    <EditorContent editor={editor} className="tiptap-editor-readonly pointer-events-none" />
                 </div>
            </div>
            <div className="lg:col-span-4 flex flex-col items-center gap-6 sticky top-10">
               <div className="flex flex-col items-center">
                  <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.4em] mb-8">Skin 3D</span>
                  <SkinViewer3D skinUrl={selectedCandid.skinUrl} width={260} height={380} />
                  <SkinDimensions url={selectedCandid.skinUrl} />
               </div>
               {selectedCandid.status === 'refuse' && (
                  <button onClick={() => handleEditApplication(selectedCandid)} className="w-full py-6 bg-white text-black font-black uppercase text-xs tracking-[0.4em] rounded-[2rem] hover:bg-[#CBDBFC] transition-all transform hover:scale-105 active:scale-95 shadow-xl">
                     Réécrire le Récit
                  </button>
               )}
            </div>
          </div>
        </div>
      )}

      {/* VUE : FORMULAIRE */}
      {view === 'form' && (
        <div className="w-full">
          <div className="flex justify-between items-center px-2 mb-10">
            <button onClick={() => setView('history')} className="text-[12px] font-black text-neutral-500 hover:text-white uppercase tracking-[0.4em] transition-colors">← Abandonner</button>
            <div className="flex items-center gap-3">
              <div className={`h-1.5 w-1.5 rounded-full ${saveStatus === 'saving' ? 'bg-amber-500 animate-pulse' : saveStatus === 'saved' ? 'bg-green-500' : 'bg-neutral-700'}`} />
              <span className="text-[9px] font-black uppercase text-neutral-500">{saveStatus === 'saving' ? 'Sauvegarde...' : saveStatus === 'saved' ? 'Brouillon à jour' : 'Prêt'}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-12 font-sans">
            {editingId && currentRefusalReason && (
              <div className="bg-amber-500/5 border border-amber-500/30 p-10 rounded-[3rem] relative shadow-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-2xl">📝</span>
                  <span className="text-[11px] text-amber-500 font-black uppercase tracking-[0.3em]">Raison du refus :</span>
                </div>
                <p className="text-lg text-neutral-200 font-medium italic leading-relaxed">"{currentRefusalReason}"</p>
              </div>
            )}
            
            <div className="max-w-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-2"><label className="block text-xs font-black text-neutral-500 uppercase tracking-[0.2em] mb-4">Identité RP</label><input name="rpName" value={formData.rpName} onChange={handleInputChange} required placeholder="Nom du Citoyen" className="w-full p-6 bg-white/[0.03] border border-white/10 rounded-[1.5rem] text-white focus:border-[#683892] outline-none transition-all" /></div>
              <div className="space-y-2"><label className="block text-xs font-black text-neutral-500 uppercase tracking-[0.2em] mb-4">Âge (Min. 16)</label><input name="age" type="text" value={formData.age} onChange={handleInputChange} required placeholder="16" className="w-full p-6 bg-white/[0.03] border border-white/10 rounded-[1.5rem] text-white focus:border-[#683892] outline-none transition-all" /></div>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-black text-neutral-500 uppercase tracking-[0.2em]">Récit & Lore</label>
              <div className="group relative h-[650px] flex flex-col border border-white/10 rounded-[2.5rem] bg-white/[0.02] focus-within:border-[#683892] transition-all overflow-hidden shadow-3xl">
                <MenuBar editor={editor} />
                <div className="flex-1 overflow-y-auto custom-scrollbar"><EditorContent editor={editor} /></div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white/[0.02] p-10 rounded-[3rem] border border-white/5 items-center">
              <div className="space-y-6">
                <label className="block text-xs font-black text-neutral-500 uppercase tracking-[0.2em]">Apparence physique (.png) <span className="text-red-500">*</span></label>
                <div className="relative group">
                  <input type="file" accept="image/png" onChange={handleFileChange} className="hidden" id="skin-upload" />
                  <label htmlFor="skin-upload" className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/10 rounded-[2.5rem] cursor-pointer hover:border-[#683892]/50 hover:bg-[#683892]/5 transition-all text-center">
                    {isUploading ? <span className="animate-pulse text-[10px] font-black uppercase text-[#CBDBFC]">Enregistrement...</span> : <><span className="text-3xl mb-3">👔</span><span className="text-[10px] font-black uppercase text-neutral-500">Charger mon Skin</span></>}
                  </label>
                </div>
              </div>
              <div className="flex flex-col items-center gap-4">
                <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.4em]">Skin 3D</span>
                <SkinViewer3D skinUrl={skinPreview} />
                <SkinDimensions url={skinPreview} />
              </div>
            </div>

            <div className="pt-8 flex justify-center">
              <button type="submit" disabled={loading || isUploading} className="group relative w-full max-w-2xl py-8 rounded-[3rem] overflow-hidden transition-all duration-500 hover:scale-[1.02] shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-[#683892] to-[#321B46]" /><span className="relative z-10 text-white font-black uppercase text-sm tracking-[0.5em]">{editingId ? "Actualiser le Parchemin" : "Sceller le Parchemin"}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}