export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "Missing required field: url" });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "OPENROUTER_API_KEY is not configured on the server." });
  }

  const prompt = `You are an elite, world-class UI/UX designer and Senior React/Tailwind expert.

Your primary objective is to generate a STUNNING, premium, modern, and highly responsive landing page based on the given website URL or business name. The user expects perfection. DO NOT output basic, generic, or simple designs. You must WOW the user with visual excellence.

### CORE REQUIREMENTS:
- Output ONLY valid, complete HTML.
- NO explanations, NO conversational filler. ONLY the HTML code.
- Use TailwindCSS (via CDN) for all styling.
- Ensure the layout is fully responsive (mobile, tablet, desktop).

### AESTHETICS & DESIGN SYSTEM (CRITICAL):
1. Typography: Use premium Google Fonts (e.g., 'Inter', 'Outfit', 'Plus Jakarta Sans'). Do not use browser defaults.
2. Color Palette: Avoid plain colors. Use curated, vibrant, harmonious color palettes. Implement smooth, modern linear or radial gradients for backgrounds and text.
3. Micro-Animations & Interactions: Add dynamic hover effects, transition-all duration-300, scale transforms, and subtle shadow expansions on interactive elements.
4. Glassmorphism: Use backdrop-blur, semi-transparent backgrounds, and glowing borders where appropriate (especially in navbars, cards, and hero sections).
5. Dark Mode / Premium Look: Default to a sleek, premium light mode, or a stunning modern dark mode if it suits the brand better. Incorporate glowing accents.
6. Images & Icons: Use high-quality placeholders (e.g., Unsplash source URLs \`https://source.unsplash.com/random/800x600/?technology,business\`) or premium SVG icons.

### STRUCTURE & SECTIONS:
The generated page must be comprehensive and include:
1. Modern Navigation Bar (sticky, glassmorphism, logo, links, attractive CTA button).
2. Jaw-dropping Hero Section (large bold headline, beautiful gradient text, compelling subtext, primary/secondary buttons, and a stunning illustration or floating image mockup).
3. Features Section (bento grid or modern multi-column layout, glowing cards, rich SVG icons, clear descriptions).
4. Services/Products Section (interactive cards with hover states).
5. Testimonials/Social Proof (avatars, names, roles, star ratings, clean card design).
6. Pricing Section (3 tiers, prominent "Recommended" glowing tier, clear checkmarks for features).
7. Call To Action (CTA) Section (high-contrast, urgent, compelling gradient background, large button).
8. Footer (clean, organized links, social icons, copyright).

### QUALITY ASSURANCE:
- Do not use placeholders like "[Insert Content Here]". Write realistic, persuasive, professional copywriting relevant to the input.
- Use plenty of whitespace (padding and margin) to make the design breathe.
- Your HTML must be valid and semantic. Include all necessary `<style>` tags for custom fonts or animations that Tailwind cannot handle directly.

Input:
A website URL or business name: ${url}

Return ONLY a complete HTML document starting EXACTLY with:
<!DOCTYPE html>`;

  try {
    const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
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
