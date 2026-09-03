// One-off discovery script: fetches the source pages and dumps their raw
// HTML so we can design a proper scraper against the real markup.
import { mkdir, writeFile } from "node:fs/promises";

const targets = [
  {
    name: "matchcenter",
    url: "https://matchcenter.afv.ch/default.aspx?v=246&oid=5&lng=1&a=vs",
  },
  { name: "fcerlinsbach-home", url: "https://fcerlinsbach.ch" },
];

await mkdir("out", { recursive: true });

for (const { name, url } of targets) {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
      },
    });
    const html = await res.text();
    await writeFile(`out/${name}.html`, html, "utf8");
    console.log(`${name}: ${url} -> status ${res.status}, ${html.length} bytes`);
  } catch (err) {
    console.error(`${name}: FAILED -`, err.message);
    await writeFile(`out/${name}.error.txt`, String(err.stack ?? err), "utf8");
  }
}
