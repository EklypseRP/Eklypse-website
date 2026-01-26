'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import debounce from 'lodash.debounce';

const ToolbarButton = ({ onClick, isActive, children }: { onClick: () => void, isActive: boolean, children: React.ReactNode }) => (
  <button
    type="button"
    onMouseDown={(e) => { e.preventDefault(); onClick(); }}
    className={`flex items-center justify-center min-w-[50px] h-[45px] rounded-xl border transition-all ${isActive ? 'bg-[#683892] border-[#683892] text-white shadow-lg' : 'bg-white/5 border-white/10 text-neutral-500 hover:border-[#683892]/60'}`}
  >
    {children}
  </button>
);

export default function CandidatureForm() {
  const [formData, setFormData] = useState({ rpName: '', age: '' });
  const [isHovered, setIsHovered] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    immediatelyRender: false,
    editorProps: { attributes: { class: 'tiptap-editor focus:outline-none min-h-[400px] p-10 text-white prose prose-invert max-w-none text-base' } },
  });

  const inputStyle = "w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-neutral-700 focus:outline-none focus:border-[#683892] transition-all";
  const labelStyle = "block text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-3 ml-1";

  return (
    <form className="space-y-12">
      {/* Section Identité : Resserrée et équilibrée */}
      <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-1">
          <label className={labelStyle}>Identité RP</label>
          <input name="rpName" value={formData.rpName} onChange={(e) => setFormData({...formData, rpName: e.target.value})} placeholder="Ex: Alistair de Rivia" className={inputStyle} />
        </div>
        <div className="space-y-1">
          <label className={labelStyle}>Âge</label>
          <input name="age" type="number" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} placeholder="25" className={inputStyle} />
        </div>
      </div>

      {/* Éditeur Rich Text */}
      <div className="space-y-4">
        <label className={labelStyle}>Récit & Motivations</label>
        <div className="group relative border border-white/10 rounded-3xl bg-white/[0.02] overflow-hidden focus-within:border-[#683892] transition-all shadow-xl">
          <div className="flex items-center justify-center gap-4 p-5 bg-black/40 border-b border-white/10">
             <ToolbarButton onClick={() => editor?.chain().focus().toggleBold().run()} isActive={!!editor?.isActive('bold')}>B</ToolbarButton>
             <ToolbarButton onClick={() => editor?.chain().focus().toggleItalic().run()} isActive={!!editor?.isActive('italic')}>I</ToolbarButton>
             
             {/* Sélecteurs Taille & Interligne (Simulation UI) */}
             <select className="bg-white/5 border border-white/10 text-[16px] text-neutral-400 rounded-lg px-2 py-2 outline-none">
                <option>Taille</option><option>16px</option><option>18px</option>
             </select>
             <select className="bg-white/5 border border-white/10 text-[16px] text-neutral-400 rounded-lg px-2 py-2 outline-none">
                <option>Interligne</option><option>1.5</option><option>1.8</option>
             </select>

             <ToolbarButton onClick={() => editor?.chain().focus().toggleBulletList().run()} isActive={!!editor?.isActive('bulletList')}>•—</ToolbarButton>
          </div>
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Bouton de soumission : Plus long, sans emoji, bords arrondis [3rem] */}
      <div className="flex justify-center pt-6">
        <button 
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            background: isHovered ? 'linear-gradient(135deg, #321B46, #683892)' : 'linear-gradient(135deg, #683892, #321B46)',
            boxShadow: isHovered ? '0 20px 40px rgba(104, 56, 146, 0.3)' : 'none',
          }}
          className="w-full max-w-2xl py-7 rounded-[3rem] text-white font-black uppercase text-sm tracking-[0.4em] transition-all duration-500 scale-100 hover:scale-[1.02]"
        >
          Sceller le Parchemin
        </button>
      </div>
    </form>
  );
}