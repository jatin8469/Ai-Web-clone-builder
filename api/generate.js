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
- **Startup**: Growth focused, modern, clean, with strong CTAs, bento grids, and social proof.
- **SaaS**: High-tech, feature-rich, interactive elements, data visualizations, and dark accents.
- **Portfolio**: Creative, visual-heavy, large elegant typography, smooth transitions, and personal branding.
- **Restaurant**: Image-heavy, elegant serif/sans mix, warm or sophisticated colors, and menu/reservation focus.
- **Agency**: Professional, grid-based, bold headlines, service showcases, and contact forms.

### CORE REQUIREMENTS:
- Output ONLY valid, complete HTML.
- NO explanations, NO conversational filler. ONLY the HTML code.
- Use TailwindCSS (via CDN) for all styling.
- Ensure the layout is fully responsive (mobile, tablet, desktop).

### STRUCTURE & QUALITY:
1. **Sections**: Include a Navigation Bar, Hero, Features/Services, Social Proof/Testimonials, and a strong CTA Footer.
2. **Copywriting**: Write realistic, persuasive, professional copywriting based on the input "${url}". No placeholders.
3. **Typography**: Use premium Google Fonts.
4. **Interactions**: Add subtle hover animations and smooth transitions.

### AESTHETICS & DESIGN SYSTEM (CRITICAL):
1. Typography: Use premium Google Fonts (e.g., 'Inter', 'Outfit', 'Plus Jakarta Sans'). Do not use browser defaults.
2. Color Palette: Avoid plain colors. Use curated, vibrant, harmonious color palettes. Implement smooth, modern linear or radial gradients for backgrounds and text.
3. Micro-Animations & Interactions: Add dynamic hover effects, transition-all duration-300, scale transforms, and subtle shadow expansions on interactive elements.
4. Glassmorphism: Use backdrop-blur, semi-transparent backgrounds, and glowing borders where appropriate (especially in navbars, cards, and hero sections).
5. Dark Mode / Premium Look: Default to a sleek, premium light mode, or a stunning modern dark mode if it suits the brand better. Incorporate glowing accents.

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
