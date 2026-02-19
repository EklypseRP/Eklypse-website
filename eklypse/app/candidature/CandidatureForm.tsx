'use client';

import { useState, useCallback, useRef, useEffect, useLayoutEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import { Extension } from '@tiptap/core';
import SkinViewer3D from "../components/SkinViewer3D";
// @ts-ignore
import { FontSize } from 'tiptap-extension-font-size';
// @ts-ignore
import { lineHeight } from 'tiptap-extension-line-height';
import debounce from 'lodash.debounce';

const FADE_IN_ANIMATION = `
  @keyframes smoothFadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const EDITOR_STYLES = `
  .tiptap-editor {
    background-color: transparent !important;
    color: white !important;
    min-height: 500px;
  }
  
  .tiptap-editor strong { font-weight: bold !important; color: white !important; }
  .tiptap-editor em { font-style: italic !important; color: white !important; }
  .tiptap-editor u { text-decoration: underline !important; color: white !important; }
  .tiptap-editor h2 { font-size: 1.5rem !important; font-weight: bold !important; margin-top: 1.5rem !important; color: #CBDBFC !important; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.5rem; }
  .tiptap-editor ul { list-style-type: disc !important; padding-left: 1.5rem !important; margin-bottom: 1rem !important; color: white !important; }
  .tiptap-editor p { margin-bottom: 1rem; line-height: 1.6; color: white !important; }
  
  .custom-scrollbar::-webkit-scrollbar { width: 6px; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(104, 56, 146, 0.5); border-radius: 10px; }

  input:-webkit-autofill,
  input:-webkit-autofill:hover, 
  input:-webkit-autofill:focus,
  textarea:-webkit-autofill,
  textarea:-webkit-autofill:hover,
  textarea:-webkit-autofill:focus {
    -webkit-text-fill-color: white !important;
    -webkit-box-shadow: 0 0 0px 1000px #140b1d inset !important; 
    transition: background-color 5000s ease-in-out 0s;
  }
  
  /* CONTRASTES RENFORCÉS POUR L'ACCESSIBILITÉ */
  input, textarea, select {
    background-color: rgba(0, 0, 0, 0.4) !important;
    color: white !important;
    border: 1px solid rgba(255, 255, 255, 0.2) !important;
  }

  input:focus, textarea:focus, select:focus {
    background-color: rgba(0, 0, 0, 0.6) !important;
    border-color: #683892 !important;
    outline: none !important;
    box-shadow: 0 0 0 1px rgba(104, 56, 146, 0.3);
  }

  select option {
    background-color: #140b1d !important;
    color: white !important;
  }
`;

// Extension pour quitter le mode Titre quand on fait Entrée
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
    <div className="mt-2 px-4 py-2 bg-black/60 border border-white/10 rounded-full">
      <span className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: 'rgba(203, 219, 252, 0.9)' }}>
        Format : {dims}
      </span>
    </div>
  );
};

// ToolbarButton avec transition rapide (75ms)
const ToolbarButton = ({ onClick, isActive, children, title }: { onClick: () => void, isActive: boolean, children: React.ReactNode, title: string }) => (
  <button 
    type="button" 
    onMouseDown={(e) => { e.preventDefault(); onClick(); }} 
    title={title} 
    className={`flex items-center justify-center min-w-[50px] h-[45px] px-3 rounded-xl border transition-all duration-75 ${isActive ? 'bg-[#683892] border-[#683892] text-white shadow-[0_0_15px_rgba(104,56,146,0.5)] scale-105' : 'bg-white/5 border-white/20 text-neutral-400 hover:text-white hover:bg-white/10'}`}
  >
    {children}
  </button>
);

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;
  return (
    <div className="sticky top-0 z-[40] flex items-center justify-center flex-wrap gap-4 p-5 bg-[#0e0816] border-b border-white/20 w-full font-sans shadow-xl rounded-t-[2.5rem]">
      <div className="flex gap-2 pr-4 border-r border-white/10">
        <ToolbarButton title="Gras" onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')}><span className="font-black text-lg">B</span></ToolbarButton>
        <ToolbarButton title="Italique" onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')}><span className="italic font-serif text-lg">I</span></ToolbarButton>
        <ToolbarButton title="Souligné" onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')}><span className="underline font-serif text-lg">U</span></ToolbarButton>
      </div>
      <div className="flex gap-3 px-4 border-r border-white/10 font-sans">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] uppercase font-bold text-neutral-400 ml-1">Taille</span>
          <select 
            className="bg-black/40 border border-white/20 text-[12px] text-white rounded-lg px-2 py-1 outline-none cursor-pointer hover:border-white/40 transition-colors" 
            onChange={(e) => editor.chain().focus().setFontSize(e.target.value).run()}
          >
            <option value="14px">14px</option>
            <option value="16px">16px</option>
            <option value="18px">18px</option>
            <option value="22px">22px</option>
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
  
  const [updateTrigger, setUpdateTrigger] = useState(0); 

  const [formData, setFormData] = useState({ 
    rpName: '', 
    age: '', 
    taille: '',
    race: 'Humain',
    physique: '', 
    mental: '', 
    mcPseudo: '', 
    skinUrl: '' 
  });
  const [skinPreview, setSkinPreview] = useState<string | null>(null);
  const [isHighResSkin, setIsHighResSkin] = useState(false);

  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // REFS pour l'auto-resize
  const physiqueRef = useRef<HTMLTextAreaElement>(null);
  const mentalRef = useRef<HTMLTextAreaElement>(null);

  // === REFS POUR SÉCURISER L'ENREGISTREMENT ===
  const viewRef = useRef(view);
  const editingIdRef = useRef(editingId);
  const formDataRef = useRef(formData);
  const isEditorLoadingRef = useRef(false); // Verrou anti-sauvegarde automatique de Tiptap

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
    const url = skinPreview || formData.skinUrl;
    if (!url) { 
      setIsHighResSkin(false); 
      return; 
    }
    const img = new window.Image();
    img.onload = () => {
      if (img.width === 512 && img.height === 512) {
        setIsHighResSkin(true);
      } else {
        setIsHighResSkin(false);
      }
    };
    img.src = url;
  }, [skinPreview, formData.skinUrl]);

  useLayoutEffect(() => {
    if (view === 'form') {
      const adjust = (ref: React.RefObject<HTMLTextAreaElement | null>) => {
        if (ref.current) {
          ref.current.style.height = 'auto';
          ref.current.style.height = `${ref.current.scrollHeight}px`;
        }
      };
      setTimeout(() => {
        adjust(physiqueRef);
        adjust(mentalRef);
      }, 0);
    }
  }, [view, formData.physique, formData.mental]); 

  const saveToLocal = useCallback(
    debounce((currentData: typeof formData, loreJson: any) => {
      // SÉCURITÉ : On ne sauvegarde QUE si on est sur le formulaire ET que c'est une NOUVELLE candidature (pas d'ID)
      if (viewRef.current !== 'form' || editingIdRef.current) return;

      const draftData = { ...currentData, lore: loreJson, timestamp: Date.now() };
      localStorage.setItem('eklypse_candidature_draft', JSON.stringify(draftData));
      setDraft(draftData);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 1500); 
    }, 2000), []
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2] } }),
      TextStyle, 
      FontSize, 
      lineHeight, 
      Underline,
      HeadingExitOnEnter
    ],
    immediatelyRender: false,
    editorProps: { 
      attributes: { 
        class: 'tiptap-editor focus:outline-none p-10 text-white prose prose-invert max-w-none text-base outline-none' 
      } 
    },
    onTransaction: () => {
      setUpdateTrigger(prev => prev + 1);
    },
    onUpdate: ({ editor }) => {
      // On bloque si l'éditeur est en train de charger du texte informatiquement
      if (isEditorLoadingRef.current) return;

      if (viewRef.current === 'form' && !editingIdRef.current) {
        setSaveStatus('saving');
        saveToLocal(formDataRef.current, editor.getJSON());
      }
    }
  });

  // Fonction sûre pour modifier le texte de l'éditeur sans déclencher de sauvegarde fantôme
  const safeSetContent = (content: any, isClear = false) => {
    if (!editor) return;
    isEditorLoadingRef.current = true; // On active le verrou
    if (isClear) {
      editor.commands.clearContent();
    } else {
      editor.commands.setContent(content || '');
    }
    // On libère le verrou peu après
    setTimeout(() => { isEditorLoadingRef.current = false; }, 100);
  };

  const checkImageDimensions = (file: File): Promise<{width: number, height: number}> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const img = new window.Image();
        img.onload = () => resolve({ width: img.width, height: img.height });
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const dims = await checkImageDimensions(file);
    if (dims.width > 512 || dims.height > 512) {
      alert(`Format invalide : Votre image fait ${dims.width}x${dims.height}. Le format maximum autorisé est 512x512 pixels.`);
      e.target.value = ''; 
      return;
    }

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
        if (view === 'form' && !editingId) {
          saveToLocal(newFormData, editor?.getJSON());
        }
      }
    } catch (err) { 
      alert("Erreur upload"); 
    } finally { 
      setIsUploading(false); 
    }
  };

  const handleEditApplication = (c: any) => {
    // Force une string pour éviter que ça soit évalué comme null
    setEditingId(c._id || "edit_mode"); 
    setCurrentRefusalReason(c.refusalReason || null);
    setFormData({ 
      rpName: c.rpName || '', 
      age: c.age?.toString() || '', 
      taille: c.taille || '',
      race: c.race || 'Humain',
      physique: c.physique || '',
      mental: c.mental || '',
      mcPseudo: c.mcPseudo || '',
      skinUrl: c.skinUrl || '' 
    });
    setSkinPreview(c.skinUrl || null);
    safeSetContent(c.lore);
    setView('form');
  };

  const handleResumeDraft = () => {
    if (!draft) return;
    setEditingId(null);
    setCurrentRefusalReason(null);
    setFormData({ 
      rpName: draft.rpName || '', 
      age: draft.age || '', 
      taille: draft.taille || '',
      race: draft.race || 'Humain',
      physique: draft.physique || '',
      mental: draft.mental || '',
      mcPseudo: draft.mcPseudo || '',
      skinUrl: draft.skinUrl || '' 
    });
    setSkinPreview(draft.skinUrl || null);
    safeSetContent(draft.lore);
    setView('form');
  };

  const handleDeleteDraft = (e: React.MouseEvent) => {
    e.stopPropagation();
    if(confirm("Supprimer le brouillon ?")) {
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
        const target = e.target as HTMLTextAreaElement;
        target.style.height = 'auto'; 
        target.style.height = `${target.scrollHeight}px`;
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
    
    if (parseInt(formData.age) < 18) return alert("Âge minimum requis : 18 ans.");
    if (!formData.taille.trim()) return alert("La taille est obligatoire (en chiffres uniquement)."); 
    if (!formData.race.trim()) return alert("La race est obligatoire.");
    if (!formData.physique.trim()) return alert("La description physique est obligatoire.");
    if (!formData.mental.trim()) return alert("La description mentale est obligatoire.");
    if (editor.getText().trim().length === 0) return alert("Le récit (Lore) ne peut pas être vide.");
    if (!formData.skinUrl) return alert("L'apparence physique (Skin) est obligatoire.");
    if (!formData.mcPseudo) return alert("Le pseudo Minecraft est requis.");

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

  if (loading) return <div className="text-center py-40 animate-pulse font-black uppercase text-xs text-neutral-500 tracking-[0.5em]">Consultation du Codex...</div>;

  return (
    <div 
      key={view + (editingId || 'new') + (selectedCandid?._id || 'none')} 
      style={{ animation: 'smoothFadeIn 0.8s ease-in-out forwards' }}
      className="w-full"
    >
      <style dangerouslySetInnerHTML={{ __html: FADE_IN_ANIMATION + EDITOR_STYLES }} />

      {view === 'history' && (
        <div className="w-full space-y-16">
          <div className="flex flex-col items-center">
            {draft && (
              <div 
                onClick={handleResumeDraft}
                className="mb-8 p-6 bg-white/[0.05] border border-white/20 rounded-[2rem] flex items-center gap-6 cursor-pointer hover:bg-white/[0.1] transition-all group shadow-lg"
              >
                <div className="h-10 w-10 bg-amber-500/20 rounded-full flex items-center justify-center text-amber-500 animate-pulse">📝</div>
                <div>
                  <p className="text-[10px] font-black uppercase text-neutral-400 tracking-widest">Brouillon en cours</p>
                  <p className="text-sm font-bold text-white italic">"{draft.rpName || 'Sans nom'}"</p>
                </div>
                <button onClick={handleDeleteDraft} className="ml-4 p-2 text-neutral-500 hover:text-red-500 transition-colors">✕</button>
              </div>
            )}

            <button 
              onClick={() => {
                setEditingId(null);
                setCurrentRefusalReason(null);
                setFormData({ rpName: '', age: '', taille: '', race: 'Humain', physique: '', mental: '', mcPseudo: '', skinUrl: '' });
                setSkinPreview(null);
                safeSetContent(null, true);
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

          <div className="space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-neutral-500 ml-4 italic border-l border-[#683892] pl-4">Archives d'Eklypse</h3>
            {history.length === 0 && !draft ? (
              <div className="p-16 border border-dashed border-white/10 rounded-[3rem] text-center opacity-40">
                <p className="text-xs font-black uppercase text-white tracking-widest">Aucune trace dans les archives</p>
              </div>
            ) : (
              history.map((c) => (
                <div key={c._id} 
                  onClick={() => {
                    if (c.status !== 'refuse') {
                      setSelectedCandid(c);
                      safeSetContent(c.lore);
                      setView('details');
                    }
                  }}
                  className={`group bg-white/[0.05] border border-white/10 p-8 rounded-[2.5rem] flex justify-between items-center shadow-lg transition-all 
                    ${c.status === 'refuse' ? 'cursor-default opacity-90' : 'cursor-pointer hover:bg-white/[0.08] hover:border-white/20'}`}
                >
                  <div>
                    <h4 className={`text-2xl font-black text-white uppercase italic tracking-tighter ${c.status !== 'refuse' && 'group-hover:text-[#CBDBFC]'} transition-colors`}>{c.rpName}</h4>
                    <p className="text-[9px] text-neutral-400 uppercase tracking-widest mt-1">Soumis le {new Date(c.submittedAt || c.updatedAt).toLocaleDateString()}</p>
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

      {view === 'details' && selectedCandid && (
        <div className="w-full">
          <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/10">
              <button onClick={() => setView('history')} className="text-[12px] font-black text-neutral-400 hover:text-white uppercase tracking-[0.4em] transition-colors">← Revenir aux Archives</button>
              <div className={`px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest
                  ${selectedCandid.status === 'en_attente' ? 'border-amber-500/30 text-amber-500 bg-amber-500/5' : 
                    selectedCandid.status === 'accepte' ? 'border-green-500/30 text-green-500 bg-green-500/5' : 
                    'border-red-500/30 text-red-500 bg-red-500/5'}`}>
                  {selectedCandid.status === 'en_attente' ? 'Étude en cours' : 
                  selectedCandid.status === 'accepte' ? 'Candidature Acceptée' : 'Récit Écarté'}
              </div>
          </div>

          {selectedCandid.status === 'refuse' && selectedCandid.refusalReason && (
            <div className="mb-8 p-8 bg-red-500/10 border border-red-500/20 rounded-[2.5rem]">
              <span className="block text-[10px] text-red-500 font-black uppercase tracking-widest mb-3">Motif du rejet :</span>
              <p className="text-sm text-neutral-200 italic leading-relaxed">"{selectedCandid.refusalReason}"</p>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-8 bg-black/40 border border-white/10 p-10 rounded-[2.5rem] shadow-inner">
                 <div className="mb-10 pb-8 border-b border-white/10">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400">Identité RP</span>
                    <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter mt-1">{selectedCandid.rpName}</h2>
                    <div className="flex flex-wrap gap-2 mt-4">
                      <span className="px-3 py-1 bg-[#683892]/20 border border-[#683892]/40 rounded-lg text-sm font-black text-[#CBDBFC] uppercase">{selectedCandid.age} ans</span>
                      <span className="px-3 py-1 bg-[#683892]/20 border border-[#683892]/40 rounded-lg text-sm font-black text-[#CBDBFC] uppercase">Race : {selectedCandid.race || 'Non spécifiée'}</span>
                      <span className="px-3 py-1 bg-[#683892]/20 border border-[#683892]/40 rounded-lg text-sm font-black text-[#CBDBFC] uppercase">Taille : {selectedCandid.taille || 'Non spécifiée'}</span>
                    </div>
                 </div>
                 
                 <div className="space-y-12 mb-12">
                    <div className="space-y-3">
                       <span className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em]">Description Physique</span>
                       <p className="text-sm text-[#CBDBFC]/90 leading-relaxed italic border-l border-[#683892]/30 pl-4">{selectedCandid.physique}</p>
                    </div>
                    <div className="space-y-3">
                       <span className="text-[10px] font-black uppercase text-white/40 tracking-[0.2em]">Description Mentale</span>
                       <p className="text-sm text-[#CBDBFC]/90 leading-relaxed italic border-l border-[#683892]/30 pl-4">{selectedCandid.mental}</p>
                    </div>
                 </div>

                 <div className="mb-6 opacity-30 text-[10px] font-black uppercase tracking-[0.4em] text-white">Récit & Lore</div>
                 <div className="max-h-[600px] overflow-y-auto custom-scrollbar pr-4">
                    <EditorContent editor={editor} className="tiptap-editor-readonly pointer-events-none" />
                 </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center gap-6 sticky top-10">
               <div className="flex flex-col items-center gap-4">
                  <span className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.4em]">Skin 3D</span>
                  <SkinViewer3D skinUrl={selectedCandid.skinUrl} width={260} height={380} />
                  <div className="mt-4 px-6 py-3 bg-white/5 border border-white/20 rounded-2xl text-center w-full">
                     <span className="block text-[8px] text-neutral-400 uppercase font-black tracking-widest mb-1">Pseudo Minecraft</span>
                     <span className="text-sm font-bold text-[#CBDBFC] tracking-tight">{selectedCandid.mcPseudo || "Inconnu"}</span>
                  </div>
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

      {view === 'form' && (
        <div className="w-full">
          <div className="flex justify-between items-center px-2 mb-10">
            <button onClick={() => setView('history')} className="text-[12px] font-black text-neutral-400 hover:text-white uppercase tracking-[0.4em] transition-colors">← Abandonner</button>
            <div className="flex items-center gap-3">
              <div className={`h-1.5 w-1.5 rounded-full ${saveStatus === 'saving' ? 'bg-amber-500 animate-pulse' : saveStatus === 'saved' ? 'bg-green-500' : 'bg-neutral-600'}`} />
              <span className="text-[9px] font-black uppercase text-neutral-400">{saveStatus === 'saving' ? 'Sauvegarde...' : saveStatus === 'saved' ? 'Brouillon à jour' : 'Prêt'}</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-12 font-sans">
            {editingId && currentRefusalReason && (
              <div className="bg-amber-500/10 border border-amber-500/40 p-10 rounded-[3rem] relative shadow-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-2xl">📝</span>
                  <span className="text-[11px] text-amber-500 font-black uppercase tracking-[0.3em]">Raison du refus :</span>
                </div>
                <p className="text-lg text-neutral-200 font-medium italic leading-relaxed">"{currentRefusalReason}"</p>
              </div>
            )}
            
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2 lg:col-span-1">
                <label className="block text-center text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-3">Nom RP</label>
                <input name="rpName" value={formData.rpName} onChange={handleInputChange} required autoComplete="off" placeholder="Jean Dupont" className="w-full p-4 rounded-2xl text-white outline-none transition-all text-sm" />
              </div>
              <div className="space-y-2">
                <label className="block text-center text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-3">Âge (18+)</label>
                <input name="age" type="text" value={formData.age} onChange={handleInputChange} required autoComplete="off" placeholder="24" className="w-full p-4 rounded-2xl text-white outline-none transition-all text-sm" />
              </div>
              <div className="space-y-2">
                <label className="block text-center text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-3">Taille (cm)</label>
                <input name="taille" type="text" value={formData.taille} onChange={handleInputChange} required autoComplete="off" placeholder="180" className="w-full p-4 rounded-2xl text-white outline-none transition-all text-sm" />
              </div>
              <div className="space-y-2">
                <label className="block text-center text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-3">Race</label>
                <select name="race" value={formData.race} onChange={handleInputChange} required className="w-full p-4 rounded-2xl text-white cursor-pointer outline-none">
                  <option value="Humain">Humain</option>
                  <option value="Elfe">Elfe</option>
                  <option value="Nain">Nain</option>
                  <option value="Autre">Autre</option>
                </select>
                {formData.race === 'Autre' && (
                  <p className="text-[9px] text-center text-amber-500 font-black uppercase tracking-widest mt-2 animate-pulse">⚠️ Nécessite un ticket</p>
                )}
              </div>
            </div>

            <div className="space-y-12">
              <div className="space-y-2">
                <label className="block text-xs font-black text-neutral-400 uppercase tracking-[0.2em] mb-4">Description Physique (Minimum 5 lignes)</label>
                <textarea 
                  ref={physiqueRef}
                  name="physique" 
                  value={formData.physique} 
                  onChange={handleInputChange} 
                  placeholder="Apparence, style vestimentaire, signes distinctifs..." 
                  className="w-full min-h-[128px] p-6 rounded-[1.5rem] text-white outline-none transition-all resize-none custom-scrollbar overflow-hidden" 
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-xs font-black text-neutral-400 uppercase tracking-[0.2em] mb-4">Description Mentale (Minimum 5 lignes)</label>
                <textarea 
                  ref={mentalRef}
                  name="mental" 
                  value={formData.mental} 
                  onChange={handleInputChange} 
                  placeholder="Caractère, tempérament, psychologie, peurs..." 
                  className="w-full min-h-[128px] p-6 rounded-[1.5rem] text-white outline-none transition-all resize-none custom-scrollbar overflow-hidden" 
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-black text-neutral-400 uppercase tracking-[0.2em]">Récit & Lore (Minimum 25 lignes)</label>
              <div className="group relative h-[600px] flex flex-col border border-white/20 rounded-[2.5rem] bg-white/[0.05] focus-within:border-[#683892] focus-within:bg-black/40 transition-all overflow-hidden shadow-2xl">
                <MenuBar editor={editor} />
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  <EditorContent editor={editor} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white/[0.05] p-10 rounded-[3rem] border border-white/20 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                   <label className="block text-xs font-black text-neutral-400 uppercase tracking-[0.2em]">Pseudo Minecraft <span className="text-red-500">*</span></label>
                   <input name="mcPseudo" value={formData.mcPseudo} onChange={handleInputChange} required autoComplete="off" placeholder="Ex: Steve_64" className="w-full p-6 rounded-2xl text-white outline-none transition-all" />
                </div>
                <div className="space-y-4">
                  <label className="block text-xs font-black text-neutral-400 uppercase tracking-[0.2em]">Fichier Apparence (.png - Max 512x512) <span className="text-red-500">*</span></label>
                  <div className="relative group">
                    <input type="file" accept="image/png" onChange={handleFileChange} className="hidden" id="skin-upload" />
                    <label htmlFor="skin-upload" className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/20 rounded-[2rem] cursor-pointer hover:border-[#683892] hover:bg-[#683892]/10 transition-all text-center bg-black/40">
                      {isUploading ? <span className="animate-pulse text-[10px] font-black uppercase text-[#CBDBFC]">Analyse du fichier...</span> : <><span className="text-3xl mb-3">👔</span><span className="text-[10px] font-black uppercase text-neutral-400 group-hover:text-white transition-colors">Charger mon Skin</span></>}
                    </label>
                  </div>
                  {isHighResSkin && (
                    <p className="text-[9px] text-center text-amber-500 font-black uppercase tracking-widest mt-2 animate-pulse">⚠️ Nécessite un ticket</p>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-center gap-4">
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.4em]">Skin 3D</span>
                <SkinViewer3D skinUrl={skinPreview || formData.skinUrl} />
                <SkinDimensions url={skinPreview || formData.skinUrl} />
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