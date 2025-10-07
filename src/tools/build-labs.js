// tools/build-labs.js
import fs from "fs-extra";
import path from "path";
import glob from "glob";
import matter from "gray-matter";

const LABS_ROOT = path.join(process.cwd(), "public", "labs");
const OUT_META = path.join(process.cwd(), "public", "labs", "labs.json");

async function main() {
  const mdFiles = glob.sync(`${LABS_ROOT}/*/*.md`);

  const allMeta = [];

  for (const mdPath of mdFiles) {
    const dir = path.dirname(mdPath);
    const raw = await fs.readFile(mdPath, "utf8");
    const parsed = matter(raw);
    let { data, content } = parsed;

    // convert Obsidian image links ![[file.png]] -> standard relative Markdown ![](./file.png)
    content = content.replace(/\!\[\[([^\]]+)\]\]/g, (_m, filename) => {
      const fname = filename.trim();
      return `![](./${fname})`;
    });

    // write back (so site uses the web-friendly form)
    await fs.writeFile(mdPath, `---\n${matter.stringify("", data).trim()}\n---\n\n${content}`);

    // Derive slug if missing
    const slug = data.slug || data.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    data.slug = slug;

    // pick a poster image if screenshots field present
    const poster = (data.screenshots && data.screenshots[0]) ? `/labs/${path.basename(dir)}/${data.screenshots[0]}` : null;

    allMeta.push({
      title: data.title,
      slug,
      date: data.date,
      difficulty: data.difficulty,
      os: data.os,
      summary: data.summary,
      tags: data.tags || [],
      poster,
      mdPath: `/labs/${path.basename(dir)}/${path.basename(mdPath)}`,
    });
  }

  await fs.writeFile(OUT_META, JSON.stringify(allMeta, null, 2));
  console.log("Written labs metadata:", OUT_META);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
