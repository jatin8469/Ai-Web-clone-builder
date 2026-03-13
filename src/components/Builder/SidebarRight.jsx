import { useState, useEffect } from 'react';
import { Settings, Code2, Sparkles, LayoutPanelLeft, History, Download, RotateCcw } from 'lucide-react';
import { db } from '../../firebase';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { useParams } from 'react-router-dom';

export default function SidebarRight({ siteData, setSiteData, activePageIdx, selectedSectionIdx }) {
  const { projectId } = useParams();
  const [activeTab, setActiveTab] = useState('code'); // 'code', 'seo', 'history'
  const [versions, setVersions] = useState([]);

  useEffect(() => {
    if (activeTab === 'history' && projectId) {
      fetchVersions();
    }
  }, [activeTab, projectId]);

  async function fetchVersions() {
    try {
      const q = query(
        collection(db, 'projects', projectId, 'versions'),
        orderBy('createdAt', 'desc')
      );
      const snap = await getDocs(q);
      const docs = [];
      snap.forEach(d => docs.push({ id: d.id, ...d.data() }));
      setVersions(docs);
    } catch (err) {
      console.error("Error fetching versions", err);
    }
  }

  const handleRestore = (versionData) => {
    if (window.confirm("Restore this version? Unsaved changes will be lost.")) {
      setSiteData(versionData);
    }
  };

  const activePage = siteData?.pages[activePageIdx];
  const selectedSection = activePage?.sections[selectedSectionIdx];

  const handleSeoChange = (field, value) => {
    const newData = { ...siteData };
    newData.seo[field] = value;
    setSiteData(newData);
  };

  const handleCodeChange = (html) => {
    if (selectedSectionIdx === null) return;
    const newData = { ...siteData };
    newData.pages[activePageIdx].sections[selectedSectionIdx].html = html;
    setSiteData(newData);
  };

  return (
    <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col h-full overflow-hidden shrink-0">
      
      <div className="flex p-4 space-x-2 border-b border-slate-800">
        <button
          onClick={() => setActiveTab('code')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg flex items-center justify-center space-x-2 transition-colors ${
            activeTab === 'code' ? 'bg-indigo-600/20 text-indigo-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span>Code</span>
        </button>
        <button
          onClick={() => setActiveTab('seo')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg flex items-center justify-center space-x-2 transition-colors ${
            activeTab === 'seo' ? 'bg-indigo-600/20 text-indigo-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>SEO & Pages</span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg flex items-center justify-center space-x-2 transition-colors ${
            activeTab === 'history' ? 'bg-indigo-600/20 text-indigo-400' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <History className="w-4 h-4" />
          <span>History</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'seo' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Global SEO</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Site Title</label>
                  <input 
                    type="text" 
                    value={siteData?.seo?.title || ''}
                    onChange={(e) => handleSeoChange('title', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Meta Description</label>
                  <textarea 
                    value={siteData?.seo?.description || ''}
                    onChange={(e) => handleSeoChange('description', e.target.value)}
                    rows={3}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Keywords</label>
                  <input 
                    type="text" 
                    value={siteData?.seo?.keywords || ''}
                    onChange={(e) => handleSeoChange('keywords', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-6 border-t border-slate-800">
               <h4 className="text-sm font-semibold text-white mb-3">Pages Hierarchy</h4>
               <div className="space-y-2">
                 {siteData?.pages?.map((p, i) => (
                   <div key={i} className="flex items-center justify-between bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-sm text-slate-300">
                     <span>{p.name}</span>
                     <span className="text-xs text-slate-500 font-mono">{p.path}</span>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        )}

        {activeTab === 'code' && (
          <div className="h-full flex flex-col">
            {selectedSection ? (
              <>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-white flex items-center space-x-2">
                    <LayoutPanelLeft className="w-4 h-4 text-indigo-400" />
                    <span>{selectedSection.type || 'Selected Section'}</span>
                  </h4>
                  <button className="text-[10px] font-bold bg-indigo-600/20 text-indigo-400 px-2 py-1 rounded uppercase flex items-center space-x-1 hover:bg-indigo-600/30 transition-colors">
                    <Sparkles className="w-3 h-3" />
                    <span>AI Edit</span>
                  </button>
                </div>
                <textarea 
                  value={selectedSection.html}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  className="flex-1 w-full bg-[#0d1117] border border-slate-800 rounded-lg p-4 text-xs font-mono text-emerald-400 focus:outline-none focus:border-indigo-500 leading-relaxed whitespace-pre"
                  spellCheck="false"
                />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-center border border-dashed border-slate-800 rounded-xl px-4">
                <Code2 className="w-8 h-8 text-slate-700 mb-2" />
                <p className="text-sm text-slate-500">Select a section on the canvas or left sidebar to edit its code.</p>
              </div>
            )}
          </div>
        )}
        {activeTab === 'history' && (
          <div className="p-5 space-y-4">
            <h3 className="font-medium text-slate-200 text-sm flex items-center space-x-2 mb-4">
              <History className="w-4 h-4 text-indigo-400" />
              <span>Version History</span>
            </h3>
            
            {versions.length === 0 ? (
              <div className="text-center p-6 border border-slate-800 border-dashed rounded-xl bg-slate-900/50 flex flex-col items-center">
                <History className="w-8 h-8 text-slate-700 mb-2" />
                <p className="text-sm text-slate-500">No versions saved yet. Save or generate to create history.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {versions.map((ver, idx) => (
                  <div key={ver.id} className="p-4 rounded-xl border border-slate-800 bg-[#0d1117] shadow-sm hover:border-slate-700 hover:bg-slate-900 transition-all group">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-xs font-bold px-2 py-1 bg-indigo-500/10 text-indigo-400 rounded-lg inline-block">
                          v{versions.length - idx}
                        </span>
                        <p className="text-xs text-slate-400 mt-2 font-medium">
                          {ver.createdAt?.toDate()?.toLocaleString() || "Recent"}
                        </p>
                      </div>
                      <button 
                        onClick={() => handleRestore(ver.siteData)}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                        title="Restore this version"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
