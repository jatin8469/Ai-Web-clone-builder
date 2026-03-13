export async function generateWebsiteHtml(url, template = 'Startup') {
  const response = await fetch('/api/generate', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url, template }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Backend error: ${response.status}`);
  }

  const data = await response.json();

  if (!data.html) {
    throw new Error("Backend returned no HTML content.");
  }

  return data.html;
}

export async function generateStructuredWebsite({ description, template, mode, redesignUrl, imageBase64, currentSiteData }) {
  const response = await fetch('/api/builder-generate', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ description, template, mode, redesignUrl, imageBase64, currentSiteData }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to generate structured website from server.');
  }

  const result = await response.json();
  return result.data; // The parsed JSON 
}