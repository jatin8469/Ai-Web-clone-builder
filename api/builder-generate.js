import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { description, template, mode, redesignUrl, imageBase64, currentSiteData } = req.body;

  if (!description && mode !== 'image' && mode !== 'redesign') {
    return res.status(400).json({ error: "Missing required input." });
  }

  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  if (!apiKey) {
    return res.status(500).json({ error: "API Key is not configured." });
  }

  let scrapedContent = "";
  if (mode === 'redesign' && redesignUrl) {
    try {
      const fetchRes = await fetch(redesignUrl);
      const htmlString = await fetchRes.text();
      const $ = cheerio.load(htmlString);
      // Remove scripts, styles, etc.
      $('script, style, noscript, nav, footer, iframe').remove();
      scrapedContent = $('body').text().replace(/\s+/g, ' ').trim().substring(0, 10000); // Limit to 10k chars
    } catch (err) {
      console.warn("Failed to scrape redesign URL:", err);
    }
  }

  const prompt = `You are an elite AI Architect and Senior Frontend Developer. 
Your objective is to generate a complete, structured, multi-page website based on the input.

${mode === 'redesign' ? `You are REDESIGNING an existing website. Here is its content: ${scrapedContent}` : ''}
${mode === 'text' ? `Here is the description of the website to build: ${description}` : ''}
${mode === 'image' ? `Replicate the layout and design of the provided visual screenshot.` : ''}
${mode === 'refine' ? `You are UPDATING an EXISTING structured website based on the user's instructions.
User Instructions: ${description}
Current Website JSON: ${JSON.stringify(currentSiteData)}
Carefully apply the requested changes and output the entire updated JSON structure.` : ''}

### TEMPLATE STYLE: ${template || 'Startup'}
Use the design language of this template. It is IMPERATIVE that you apply modern, premium UI aesthetics:
- **Typography**: Import and use premium Google Fonts (e.g., Inter, Outfit). Use \`tracking-tight\` for headings.
- **Colors & Depth**: Avoid generic colors. Use rich gradients, \`bg-white/5 backdrop-blur-xl border border-white/10\`, and subtle glowing shadows (\`shadow-[0_0_40px_-15px_rgba(79,70,229,0.3)]\`).
- **Layouts**: Use complex arrangements like bento grids, overlapping elements, and generous whitespace (\`py-24\`).
- **Interactions**: Add \`transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl\` on cards/buttons.

### OUTPUT FORMAT (CRITICAL)
You MUST output ONLY valid JSON. Do not include markdown code block formatting like \`\`\`json. Output raw JSON that perfectly matches the structure below:

{
  "seo": {
    "title": "Optimized Page Title",
    "description": "Optimized meta description",
    "keywords": "keyword1, keyword2"
  },
  "pages": [
    {
      "name": "Home",
      "path": "/",
      "sections": [
        {
          "id": "hero-section-1",
          "type": "Hero",
          "html": "<section class='relative bg-slate-900 text-white py-20'>...</section>"
        },
        {
          "id": "features-section-1",
          "type": "Features",
          "html": "<section class='py-16 bg-white'>...</section>"
        }
      ]
    },
    {
      "name": "About",
      "path": "/about",
      "sections": [
        {
          "id": "about-hero-1",
          "type": "Hero",
          "html": "..."
        }
      ]
    }
  ]
}

Instructions for the 'html' field:
- Use TailwindCSS (via CDN) classes exclusively.
- Write valid, semantic HTML without full document wrappers (\`<html>\`, \`<body>\`, etc.). Just the \`<section>\` or \`<header>\` block itself.
- For images, use Unsplash placeholders: \`https://source.unsplash.com/random/800x600/?business,tech\` or relevant keywords.
- Include interactive hover states (\`hover:bg-blue-600\`, \`transition-all\`, etc.).
- Ensure perfect responsive design (\`md:flex-row\`, \`grid-cols-1 md:grid-cols-3\`).
- Generate the following pages: Home, About, Services, Contact.
- Do NOT add markdown formatting to the JSON output.

Let's begin. Output ONLY the JSON.`;

  try {
    const fetchUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    let parts = [{ text: prompt }];
    
    if (mode === 'image' && imageBase64) {
      // Remove the data:image/jpeg;base64, prefix if present
      const base64Data = imageBase64.replace(/^data:image\/(png|jpeg|webp);base64,/, "");
      parts.push({
        inline_data: {
          mime_type: "image/jpeg",
          data: base64Data
        }
      });
    }

    const geminiRes = await fetch(fetchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts }],
      }),
    });

    if (!geminiRes.ok) {
      const errorText = await geminiRes.text();
      return res.status(502).json({ error: `AI API error: ${geminiRes.status}`, details: errorText });
    }

    const data = await geminiRes.json();
    let rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Parse the JSON
    // Remove markdown code fences if the AI included them despite instructions
    rawContent = rawContent.replace(/```json/gi, "").replace(/```/g, "").trim();

    try {
      const parsedJson = JSON.parse(rawContent);
      return res.status(200).json({ data: parsedJson });
    } catch (parseError) {
      console.error("Failed to parse JSON from AI:", rawContent.substring(0, 500) + "...");
      return res.status(500).json({ error: "AI failed to generate structural JSON", details: parseError.message });
    }

  } catch (err) {
    return res.status(500).json({ error: `Internal server error: ${err.message}` });
  }
}
