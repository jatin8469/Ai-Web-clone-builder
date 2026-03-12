// Points to the backend server.
// In development: http://localhost:3001
// In production: set VITE_BACKEND_URL to your Render backend URL
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

export async function generateWebsiteHtml(url) {
  const response = await fetch(`${BACKEND_URL}/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
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