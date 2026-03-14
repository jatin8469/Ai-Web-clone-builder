import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import SidebarLeft from '../../components/Builder/SidebarLeft';
import SidebarRight from '../../components/Builder/SidebarRight';
import PreviewCanvas from '../../components/Builder/PreviewCanvas';
import { generateStructuredWebsite } from '../../ai/generateWebsite';
import { Loader2, ArrowLeft, Save, Play, Download, Maximize } from 'lucide-react';

export default function BuilderLayout() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Builder State
  const [siteData, setSiteData] = useState(null); // The JSON structure { seo, pages }
  const [activePageIdx, setActivePageIdx] = useState(0);
  const [selectedSectionIdx, setSelectedSectionIdx] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Save Modal State
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (projectId) {
      loadProject();
    } else {
      setSiteData({
        seo: { title: "New Project", description: "", keywords: "" },
        pages: [{ name: "Home", path: "/", sections: [] }]
      });
      setLoading(false);
    }
  }, [projectId]);

  async function loadProject() {
    try {
      const docRef = doc(db, 'projects', projectId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        setProject({ id: snap.id, ...data });
        if (data.siteData) {
          setSiteData(data.siteData);
        } else if (data.generatedCode) {
          setSiteData({
            seo: { title: data.websiteUrl || "Imported Project", description: "", keywords: "" },
            pages: [{
              name: "Home", path: "/", sections: [
                { id: 'legacy-1', type: 'RawHtml', html: data.generatedCode }
              ]
            }]
          });
        }
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error("Error loading project:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleSaveClick() {
    setSaveName(siteData?.seo?.title || "Untitled Project");
    setIsSaveModalOpen(true);
  }

  async function confirmSave() {
    setIsSaving(true);
    try {
      const cleanSiteData = JSON.parse(JSON.stringify(siteData));
      if (!cleanSiteData.seo) cleanSiteData.seo = {};
      cleanSiteData.seo.title = saveName;
      setSiteData({ ...cleanSiteData });

      if (projectId) {
        await updateDoc(doc(db, 'projects', projectId), {
          siteData: cleanSiteData,
          websiteUrl: saveName,
          updatedAt: serverTimestamp()
        });
        
        // Save version
        await addDoc(collection(db, 'projects', projectId, 'versions'), {
          siteData: cleanSiteData,
          createdAt: serverTimestamp()
        });

        alert('Saved successfully!');
      } else {
        const newDoc = await addDoc(collection(db, 'projects'), {
          userID: currentUser.uid,
          siteData: cleanSiteData,
          websiteUrl: saveName,
          templateType: 'Custom Builder',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        
        // Save version
        await addDoc(collection(db, 'projects', newDoc.id, 'versions'), {
          siteData: cleanSiteData,
          createdAt: serverTimestamp()
        });

        navigate(`/builder/${newDoc.id}`, { replace: true });
      }
      setIsSaveModalOpen(false);
    } catch (err) {
      console.error("Save error:", err);
      alert('Failed to save project.');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleGenerate(payload) {
    setIsGenerating(true);
    try {
      // If making a brand new project, enforce the 10 limit rule
      if (!projectId) {
        const q = query(collection(db, 'projects'), where('userID', '==', currentUser.uid));
        const snap = await getDocs(q);
        if (snap.size >= 10) {
          throw new Error("You have reached the maximum limit of 10 projects. Please delete an older project to generate a new one.");
        }
      }

      const generatedJson = await generateStructuredWebsite(payload);
      const cleanGeneratedJson = JSON.parse(JSON.stringify(generatedJson));
      setSiteData(cleanGeneratedJson);
      
      if (projectId) {
        await updateDoc(doc(db, 'projects', projectId), { 
          siteData: cleanGeneratedJson,
          websiteUrl: cleanGeneratedJson.seo?.title || payload.description || "Updated Project",
          updatedAt: serverTimestamp()
        });
        
        await addDoc(collection(db, 'projects', projectId, 'versions'), {
          siteData: cleanGeneratedJson,
          createdAt: serverTimestamp()
        });
      } else {
        const newDoc = await addDoc(collection(db, 'projects'), {
          userID: currentUser.uid,
          siteData: cleanGeneratedJson,
          websiteUrl: cleanGeneratedJson.seo?.title || payload.description || payload.redesignUrl || "New Generated Site",
          templateType: payload.template || 'Custom Builder',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
        
        await addDoc(collection(db, 'projects', newDoc.id, 'versions'), {
          siteData: cleanGeneratedJson,
          createdAt: serverTimestamp()
        });

        navigate(`/builder/${newDoc.id}`, { replace: true });
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setIsGenerating(false);
    }
  }

  const handleExport = () => {
    if (!siteData || !siteData.pages) return;
    const zip = new JSZip();

    siteData.pages.forEach(page => {
      const pageHtml = page.sections?.map(s => s.html).join('\n') || '';
      
      const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${siteData.seo?.title || page.name}</title>
    <meta name="description" content="${siteData.seo?.description || ''}">
    <meta name="keywords" content="${siteData.seo?.keywords || ''}">
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
    </style>
</head>
<body class="antialiased text-slate-900 bg-white">
    ${pageHtml}
</body>
</html>`;

      // basic mapping: "Home" -> "index.html", "About" -> "about.html"
      let filename = page.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '.html';
      if (filename === 'home.html') filename = 'index.html';
      
      zip.file(filename, fullHtml);
    });

    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, `${siteData.seo?.title?.replace(/\s+/g, '-') || 'website'}.zip`);
    });
  };

  const handleFullscreen = () => {
    // You can fullscreen the entire page, or just the PreviewCanvas area
    const elem = document.getElementById("preview-canvas-container") || document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
      elem.msRequestFullscreen();
    }
  };

  const activePage = siteData?.pages[activePageIdx];
  const selectedSection = activePage?.sections[selectedSectionIdx];

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden font-sans">
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 right-0 h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 z-50">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="font-semibold text-white flex items-center space-x-2">
            <span className="bg-indigo-600/20 text-indigo-400 px-2 pl-2.5 py-1 rounded-md text-xs uppercase tracking-wider border border-indigo-500/20">Builder</span>
            <span>{siteData?.seo?.title || 'Untitled Project'}</span>
          </div>
        </div>
        {/* Actions */}
        <div className="flex bg-[#0d1117] items-center space-x-3">
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-slate-400 bg-[#0d1117] hover:text-white px-3 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            Dashboard
          </button>
          
          <button
            onClick={handleExport}
            disabled={!siteData || isGenerating}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span>Export ZIP</span>
          </button>

          <button
            onClick={handleFullscreen}
            title="Fullscreen Preview"
            className="flex items-center justify-center p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors"
          >
            <Maximize className="w-4 h-4" />
          </button>

          <button 
            onClick={handleSaveClick}
            disabled={isGenerating || isSaving}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save</span>
          </button>
        </div>
      </header>

      {/* Main Builder Area */}
      <div className="grid grid-cols-[320px_1fr_320px] flex-1 pt-14 h-full overflow-hidden">
        {/* Left Sidebar: Pages & Layers */}
        <SidebarLeft 
          siteData={siteData} 
          setSiteData={setSiteData}
          activePageIdx={activePageIdx}
          setActivePageIdx={setActivePageIdx}
          selectedSectionIdx={selectedSectionIdx}
          setSelectedSectionIdx={setSelectedSectionIdx}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
        />

        {/* Center Canvas: Live Preview */}
        <div id="preview-canvas-container" className="bg-slate-950 relative overflow-hidden flex flex-col items-center min-w-0">
          <div className="absolute top-4 flex bg-slate-800 p-1 rounded-lg border border-slate-700 z-10 shadow-xl">
            {/* Viewport toggles could go here */}
            {siteData?.pages.map((page, idx) => (
              <button
                key={idx}
                onClick={() => setActivePageIdx(idx)}
                className={`px-4 py-1 text-xs font-semibold rounded-md transition-colors ${idx === activePageIdx ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700'}`}
              >
                {page.name}
              </button>
            ))}
          </div>
          
          <PreviewCanvas 
            activePage={activePage} 
            selectedSectionIdx={selectedSectionIdx}
            setSelectedSectionIdx={setSelectedSectionIdx}
            isGenerating={isGenerating}
          />
        </div>

        {/* Right Sidebar: Properties & SEO */}
        <SidebarRight 
          siteData={siteData}
          setSiteData={setSiteData}
          activePageIdx={activePageIdx}
          selectedSectionIdx={selectedSectionIdx}
        />
      </div>

      {/* Save Modal */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">Save Project</h3>
            <p className="text-slate-400 text-sm mb-6">Give your project a name to identify it in your dashboard.</p>
            
            <input 
              type="text"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder="e.g. My Awesome Site"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:border-indigo-500 mb-6"
            />
            
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setIsSaveModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmSave}
                disabled={isSaving || !saveName.trim()}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Confirm Save</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
