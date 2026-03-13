import { useState, useEffect, useRef } from 'react';

export default function PreviewCanvas({ activePage, selectedSectionIdx, setSelectedSectionIdx }) {
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
        className="w-full max-w-[1400px] h-full bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-700/50 pointer-events-auto transition-all"
      >
        <iframe
          ref={iframeRef}
          srcDoc={compiledHtml}
          title="Preview Canvas"
          className="w-full h-full border-none"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
}
