export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { url, template } = req.body;

  if (!url) {
    return res.status(400).json({ error: "Missing required field: url" });
  }

  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  if (!apiKey) {
    return res.status(500).json({ error: "OPENROUTER_API_KEY is not configured on the server." });
  }

  const prompt = `You are an elite, world-class UI/UX designer and Senior React/Tailwind expert.

Your primary objective is to generate a STUNNING, premium, modern, and highly responsive landing page based on the given website URL or business name. 

### TEMPLATE STYLE: ${template || 'General'}
You MUST strictly follow the design language of this template:
- **Startup**: Growth focused, modern, clean, with strong CTAs, bento-box grids, and social proof.
- **SaaS**: High-tech, feature-rich, interactive elements, data visualizations, and dark accents.
- **Portfolio**: Creative, visual-heavy, large elegant typography (e.g., lowercase geometric sans), smooth transitions, and personal branding.
- **Restaurant**: Image-heavy, elegant serif/sans mix, warm or sophisticated colors, menu/reservation focus.
- **Agency**: Professional, grid-based, bold typography, service showcases, contact forms.

### CORE REQUIREMENTS:
- Output ONLY valid, complete HTML.
- NO explanations, NO conversational filler. ONLY the HTML code.
- Use TailwindCSS (via CDN) for all styling.
- Ensure the layout is perfectly responsive (mobile, tablet, desktop) using grid and flexbox.

### STRUCTURE & QUALITY:
1. **Sections**: Include at minimum: Navigation, Hero, Features/Services, Proof/Testimonials, and CTA Footer.
2. **Copywriting**: Write realistic, persuasive, high-conversion copy based on the input "${url}". No "Lorem Ipsum".
3. **Typography**: Use premium Google Fonts imported via CDN (e.g., Inter, Outfit, Plus Jakarta Sans, Syne).
4. **Icons**: Use Phosphor Icons or Lucide Icons (via CDN).

### AESTHETICS & DESIGN SYSTEM (CRITICAL - THIS IS WHAT SEPARATES GOOD FROM GREAT):
1. **Premium Typography**: Avoid default serif/sans. Use tight letter-spacing for headings (tracking-tight) and relaxed for body (leading-relaxed).
2. **Rich Color Palettes**: AVOID basic colors (no plain blue-500). Use sophisticated palettes (e.g., slate-900 with indigo-500/emerald-400 accents). Use modern linear \`bg-gradient-to-r\` or radial gradients for backgrounds and text (\`bg-clip-text text-transparent\`).
3. **Glassmorphism & Depth**: Deeply integrate glass details: \`bg-white/5 backdrop-blur-xl border border-white/10\`. Use multiple blended glow effects behind main elements.
4. **Dynamic Micro-Interactions**: Elements must feel alive. Use \`transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:scale-[1.02]\` on cards and buttons.
5. **Modern Layouts**: Use asymmetrical bento-box grids (\`grid-cols-1 md:grid-cols-3\` with varying col-spans) and overlapping absolute elements to break the standard blocky flow.

Input:
A website URL or business name: ${url}

Return ONLY a complete HTML document starting EXACTLY with:
<!DOCTYPE html>`;

  try {
    const fetchUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    console.log("DEBUG FETCH URL:", fetchUrl, "KEY LENGTH:", apiKey?.length);
    const geminiRes = await fetch(fetchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!geminiRes.ok) {
      const errorText = await geminiRes.text();
      return res.status(502).json({ error: `Gemini API error: ${geminiRes.status}`, details: errorText });
    }

    const data = await geminiRes.json();
    let rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Extract only the HTML part using regex (matches everything from <!DOCTYPE html> to </html>)
    const match = rawContent.match(/<!DOCTYPE html>[\s\S]*<\/html>/i);
    let html = match ? match[0] : rawContent;

    // Fallback: cleanup markdown fences if match fails
    html = html.replace(/```html/gi, "").replace(/```/g, "").trim();

    if (!html || !html.toLowerCase().includes('<html')) {
      return res.status(500).json({ error: "AI failed to generate a valid HTML document." });
    }

    return res.status(200).json({ html });
  } catch (err) {
    return res.status(500).json({ error: `Internal server error: ${err.message}` });
  }
}
