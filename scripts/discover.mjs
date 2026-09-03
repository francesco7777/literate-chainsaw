// One-off discovery script: fetches the source pages and dumps their raw
// HTML so we can design a proper scraper against the real markup.
import { mkdir, writeFile } from "node:fs/promises";

const targets = [
  { name: "fcerlinsbach-home", url: "https://fcerlinsbach.ch" },
  { name: "fcerlinsbach-home-page2", url: "https://fcerlinsbach.ch/page/2/" },
  { name: "kader-herren-1", url: "https://fcerlinsbach.ch/kader-herren-1/" },
  { name: "kader-frauen-1", url: "https://fcerlinsbach.ch/kader-frauen-1/" },
  { name: "kader-senioren-30", url: "https://fcerlinsbach.ch/kader-senioren-30/" },
  { name: "kontakt", url: "https://fcerlinsbach.ch/kontakt/" },
  { name: "vorstand", url: "https://fcerlinsbach.ch/vorstand-2/" },
  { name: "sponsoring", url: "https://fcerlinsbach.ch/kategorie/sponsoring/" },
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
