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

  const prompt = `You are an expert UI/UX designer and senior frontend developer.

Your job is to generate a modern, beautiful, responsive landing page based on a given website URL or business name.

Requirements:
- Output ONLY valid HTML (no explanations).
- Use TailwindCSS CDN for styling.
- Create a fully responsive layout.
- Use clean, professional UI design.
- Use modern SaaS design principles.

The generated page must include these sections:

1. Navigation Bar
- Logo or brand name
- Links: Home, Features, Pricing, About, Contact
- Primary CTA button

2. Hero Section
- Large headline
- Supporting description
- Two call-to-action buttons
- Illustration or visual placeholder

3. Features Section
- 3–4 feature cards
- Icons
- Clear descriptions

4. Services / Product Section
- Grid layout
- Cards with title and description

5. Testimonials Section
- 3 customer testimonials
- Profile image placeholders
- Name and role

6. Pricing Section
- 3 pricing plans
- Highlight the recommended plan

7. Call To Action Section
- Strong conversion message
- Button encouraging signup

8. Footer
- Links
- Contact information
- Social media icons
- Copyright text

Design Guidelines:
- Use TailwindCSS CDN:
https://cdn.tailwindcss.com
- Add subtle hover animations
- Use rounded cards
- Proper spacing and grid layout
- Professional typography
- Mobile responsive

Input:
A website URL or business name: ${url}

Return ONLY a complete HTML document starting with:

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
