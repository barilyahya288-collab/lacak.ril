
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const q = String(req.query.q || "").trim().slice(0, 200);

  if (!q) {
    return res.status(400).json({ error: "Masukkan kata pencarian" });
  }

  try {
    const endpoint = new URL(
      "https://id.wikipedia.org/w/rest.php/v1/search/page"
    );
    endpoint.searchParams.set("q", q);
    endpoint.searchParams.set("limit", "10");

    const response = await fetch(endpoint, {
      headers: { "User-Agent": "LacakAIPro/1.0 (public information search)" }
    });

    if (!response.ok) {
      throw new Error("Sumber pencarian sedang tidak tersedia");
    }

    const data = await response.json();

    return res.status(200).json({
      query: q,
      results: (data.pages || []).map((page) => ({
        title: page.title,
        description: page.description || "",
        url: `https://id.wikipedia.org/wiki/${encodeURIComponent(
          page.title.replace(/ /g, "_")
        )}`
      }))
    });
  } catch {
    return res.status(502).json({
      error: "Pencarian gagal. Coba lagi nanti."
    });
  }
}
