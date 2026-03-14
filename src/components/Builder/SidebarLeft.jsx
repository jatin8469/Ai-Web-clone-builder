import { useState } from 'react';
import { Layers, Plus, Image as ImageIcon, Link2, Sparkles, Loader2, GripVertical, Trash2 } from 'lucide-react';

export default function SidebarLeft({ siteData, setSiteData, activePageIdx, setActivePageIdx, selectedSectionIdx, setSelectedSectionIdx, onGenerate, isGenerating }) {
  const [genMode, setGenMode] = useState('text'); // 'text', 'redesign', 'image'
  const [inputValue, setInputValue] = useState('');
  const [template, setTemplate] = useState('SaaS');
  const [imageFile, setImageFile] = useState(null);

  const activePage = siteData?.pages[activePageIdx];

  const handleGenerate = () => {
    let payload = { mode: genMode, template };
    if (genMode === 'text' || genMode === 'refine') payload.description = inputValue;
    if (genMode === 'redesign') payload.redesignUrl = inputValue;
    if (genMode === 'image' && imageFile) payload.imageBase64 = imageFile;
    if (genMode === 'refine') payload.currentSiteData = siteData;

    onGenerate(payload);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageFile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteSection = (e, sIdx) => {
    e.stopPropagation();
    const newSiteData = { ...siteData };
    newSiteData.pages[activePageIdx].sections.splice(sIdx, 1);
    // If we deleted the currently selected section, clear selection
    if (selectedSectionIdx === sIdx) setSelectedSectionIdx(null);
    else if (selectedSectionIdx > sIdx) setSelectedSectionIdx(selectedSectionIdx - 1);
    setSiteData(newSiteData);
  };

  const moveSection = (e, sIdx, direction) => {
    e.stopPropagation();
    const newSiteData = { ...siteData };
    const sections = newSiteData.pages[activePageIdx].sections;
    if (direction === 'up' && sIdx > 0) {
      const temp = sections[sIdx];
      sections[sIdx] = sections[sIdx - 1];
      sections[sIdx - 1] = temp;
      if (selectedSectionIdx === sIdx) setSelectedSectionIdx(sIdx - 1);
      else if (selectedSectionIdx === sIdx - 1) setSelectedSectionIdx(sIdx);
    } else if (direction === 'down' && sIdx < sections.length - 1) {
      const temp = sections[sIdx];
      sections[sIdx] = sections[sIdx + 1];
      sections[sIdx + 1] = temp;
      if (selectedSectionIdx === sIdx) setSelectedSectionIdx(sIdx + 1);
      else if (selectedSectionIdx === sIdx + 1) setSelectedSectionIdx(sIdx);
    }
    setSiteData(newSiteData);
  };


  return (
    <div className="w-full bg-slate-900 border-r border-slate-800 flex flex-col h-full overflow-y-auto">
      
      {/* Generation Panel */}
      <div className="p-4 border-b border-slate-800">
        <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>AI Generator</span>
        </h3>
        
        <div className="flex bg-slate-950 p-1 rounded-lg mb-4">
          <button onClick={() => setGenMode('text')} className={`flex-1 text-xs py-1.5 rounded-md transition-colors ${genMode === 'text' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}>Text</button>
          <button onClick={() => setGenMode('redesign')} className={`flex-1 text-xs py-1.5 rounded-md transition-colors ${genMode === 'redesign' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}>URL</button>
          <button onClick={() => setGenMode('image')} className={`flex-1 text-xs py-1.5 rounded-md transition-colors ${genMode === 'image' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}>Image</button>
          <button onClick={() => setGenMode('refine')} className={`flex-1 text-xs py-1.5 rounded-md transition-colors ${genMode === 'refine' ? 'bg-slate-800 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}>Refine</button>
        </div>

        <div className="space-y-3">
          {(genMode === 'text' || genMode === 'refine') && (
            <textarea 
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={genMode === 'refine' ? "e.g. Make the hero section blue and add a pricing table..." : "Describe your website..."}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-indigo-500 min-h-[80px]"
            />
          )}
          {genMode === 'redesign' && (
            <input 
              type="url"
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="https://example.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          )}
          {genMode === 'image' && (
             <div className="w-full bg-slate-950 border border-slate-800 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-indigo-500 transition-colors relative">
               <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
               <ImageIcon className="w-6 h-6 text-slate-500 mx-auto mb-2" />
               <p className="text-xs text-slate-400">Click to upload screenshot</p>
               {imageFile && <p className="text-xs text-indigo-400 mt-2 font-medium">Image selected</p>}
             </div>
          )}

          <select 
            value={template} 
            onChange={(e) => setTemplate(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="Startup">Startup</option>
            <option value="SaaS">SaaS</option>
            <option value="Portfolio">Portfolio</option>
            <option value="Restaurant">Restaurant</option>
            <option value="Agency">Agency</option>
            <option value="Blog">Blog</option>
          </select>

          <button 
            onClick={handleGenerate}
            disabled={isGenerating || (genMode !== 'image' && !inputValue) || (genMode === 'image' && !imageFile)}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>{isGenerating ? 'Generating...' : 'Generate Site'}</span>
          </button>
        </div>
      </div>

      {/* Layers Panel */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Layers className="w-4 h-4 text-slate-400" />
            <span>Layers ({activePage?.name})</span>
          </h3>
          <button className="text-indigo-400 hover:text-indigo-300 p-1">
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2">
          {activePage?.sections?.map((section, sIdx) => (
            <div 
              key={section.id || sIdx}
              onClick={() => setSelectedSectionIdx(sIdx)}
              className={`group flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${selectedSectionIdx === sIdx ? 'bg-indigo-600/10 border-indigo-500/50 text-indigo-300' : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'}`}
            >
              <div className="flex items-center space-x-3 truncate">
                <GripVertical className="w-4 h-4 text-slate-600 cursor-grab" />
                <span className="text-sm font-medium truncate">{section.type || 'Section'}</span>
              </div>
              <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1">
                <div className="flex flex-col">
                  <button onClick={(e) => moveSection(e, sIdx, 'up')} className="hover:text-white p-0.5"><span className="text-[10px] leading-none">▲</span></button>
                  <button onClick={(e) => moveSection(e, sIdx, 'down')} className="hover:text-white p-0.5"><span className="text-[10px] leading-none">▼</span></button>
                </div>
                <button onClick={(e) => deleteSection(e, sIdx)} className="p-1.5 hover:bg-rose-500/20 hover:text-rose-400 rounded-md transition-colors ml-1">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {(!activePage?.sections || activePage.sections.length === 0) && (
            <div className="text-center py-8 text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
              No sections. Generate or add one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
