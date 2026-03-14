import { useState, useEffect, useRef } from 'react';
import { Code2 } from 'lucide-react';

export default function PreviewCanvas({ activePage, selectedSectionIdx, setSelectedSectionIdx, isGenerating }) {
  const iframeRef = useRef(null);
  const [compiledHtml, setCompiledHtml] = useState('');

  useEffect(() => {
    if (!activePage) return;

    // Compile sections into a single HTML structure for the iframe
    // We add Tailwind via CDN and inject some scripts for selection coordination
    const sectionsHtml = activePage.sections?.map((section, idx) => {
      // Wrap each section to highlight if selected
      const isSelected = selectedSectionIdx === idx;
      const highlightClass = isSelected ? "ring-4 ring-indigo-500/80 ring-inset outline-none relative z-50 transition-all shadow-[0_0_30px_rgba(99,102,241,0.3)]" : "";
      
      // Inject a wrapper div that allows clicking to select
      return `
        <div data-section-idx="${idx}" class="${highlightClass} cursor-pointer hover:ring-2 hover:ring-indigo-400/50 hover:relative hover:z-40 transition-shadow">
          ${section.html}
        </div>
      `;
    }).join('\n') || '<div class="flex items-center justify-center min-h-screen text-gray-400 font-sans">No content generated yet.</div>';

    const fullHtml = `
      <!DOCTYPE html>
      <html class="scroll-smooth">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://cdn.tailwindcss.com"></script>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Inter', sans-serif; }
            /* Hide scrollbar for cleaner preview */
            ::-webkit-scrollbar { width: 8px; }
            ::-webkit-scrollbar-track { background: transparent; }
            ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
          </style>
        </head>
        <body class="bg-white">
          ${sectionsHtml}
          
          <script>
            // Send click events back to parent react app
            document.body.addEventListener('click', (e) => {
              const wrapper = e.target.closest('[data-section-idx]');
              if (wrapper) {
                e.preventDefault();
                e.stopPropagation();
                const idx = parseInt(wrapper.getAttribute('data-section-idx'), 10);
                window.parent.postMessage({ type: 'SECTION_CLICKED', idx }, '*');
              }
            });
          </script>
        </body>
      </html>
    `;

    setCompiledHtml(fullHtml);
  }, [activePage, selectedSectionIdx]);

  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data?.type === 'SECTION_CLICKED') {
        setSelectedSectionIdx(e.data.idx);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [setSelectedSectionIdx]);

  return (
    <div className="w-full h-full p-8 overflow-hidden flex items-center justify-center pointer-events-none">
      <div 
        className="w-full max-w-[1400px] h-full bg-slate-900 rounded-xl shadow-2xl overflow-hidden border border-slate-700 pointer-events-auto transition-all relative group"
      >
        <div className="absolute top-0 left-0 right-0 h-6 bg-slate-800 border-b border-slate-700 flex items-center px-4 space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-50">
           <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></div>
           <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
           <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
           <span className="text-[10px] text-slate-500 ml-4 font-mono tracking-wider absolute left-1/2 -translate-x-1/2">{activePage?.name || 'Preview'}</span>
        </div>
        
        {isGenerating && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md text-indigo-400">
            <div className="flex flex-col items-center animate-pulse">
              <Code2 className="w-16 h-16 mb-6 animate-bounce" />
              <h3 className="text-2xl font-bold font-mono tracking-wider mb-2">Architecting your block...</h3>
              <p className="text-slate-400 font-mono text-sm max-w-sm text-center">AI is currently writing the Tailwind HTML for your layout. This may take a few seconds.</p>
            </div>
            {/* Simple progress bar animation */}
            <div className="absolute bottom-1/4 w-64 h-1 bg-white/10 rounded-full overflow-hidden">
               <div className="h-full bg-indigo-500 rounded-full animate-[progress_2s_ease-in-out_infinite]" style={{ animation: 'progress 3s ease-in-out infinite' }}></div>
            </div>
            <style>{`
              @keyframes progress {
                0% { width: 0%; transform: translateX(-100%); }
                50% { width: 50%; transform: translateX(50%); }
                100% { width: 100%; transform: translateX(200%); }
              }
            `}</style>
          </div>
        )}
        <iframe
          ref={iframeRef}
          srcDoc={compiledHtml}
          title="Preview Canvas"
          className={`w-full h-full border-none transition-opacity duration-300 pt-6 bg-white ${isGenerating ? 'opacity-30' : 'opacity-100'}`}
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
}
