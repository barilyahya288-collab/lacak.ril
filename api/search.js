
const SOURCES = [
  {
    name: "Wikipedia Indonesia",
    endpoint: "https://id.wikipedia.org/w/rest.php/v1/search/page",
    buildUrl(q) {
      const url = new URL(this.endpoint);
      url.searchParams.set("q", q);
      url.searchParams.set("limit", "8");
      return url;
    },
    map(data) {
      return (data.pages || []).map((page) => ({
        title: page.title,
        description: page.description || page.excerpt || "",
        url:
          "https://id.wikipedia.org/wiki/" +
          encodeURIComponent(page.title.replace(/ /g, "_")),
        source: this.name
      }));
    }
  },
  {
    name: "Wikipedia Inggris",
    endpoint: "https://en.wikipedia.org/w/rest.php/v1/search/page",
    buildUrl(q) {
      const url = new URL(this.endpoint);
      url.searchParams.set("q", q);
      url.searchParams.set("limit", "5");
      return url;
    },
    map(data) {
      return (data.pages || []).map((page) => ({
        title: page.title,
        description: page.description || page.excerpt || "",
        url:
          "https://en.wikipedia.org/wiki/" +
          encodeURIComponent(page.title.replace(/ /g, "_")),
        source: this.name
      }));
    }
  }
];

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  const q = String(req.query.q || "").trim().slice(0, 200);

  if (!q) {
    return res.status(400).json({
      error: "Masukkan kata pencarian."
    });
  }

  res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");

  try {
    const resultsBySource = await Promise.all(
      SOURCES.map(async (source) => {
        try {
          const response = await fetch(source.buildUrl(q), {
            headers: {
              "User-Agent": "LacakAIPro/1.0 (public information search)"
            },
            signal: AbortSignal.timeout(7000)
          });

          if (!response.ok) return [];

          const data = await response.json();
          return source.map(data);
        } catch {
          return [];
        }
      })
    );

    const results = resultsBySource
      .flat()
      .filter((item) => item.title && item.url)
      .filter(
        (item, index, array) =>
          array.findIndex((other) => other.url === item.url) === index
      )
      .slice(0, 13);

    return res.status(200).json({
      query: q,
      results,
      sources: [...new Set(results.map((item) => item.source))],
      note: "Hasil berasal dari artikel Wikipedia publik, bukan seluruh web."
    });
  } catch {
    return res.status(502).json({
      error: "Pencarian sedang tidak tersedia. Coba lagi nanti."
    });
  }
}
