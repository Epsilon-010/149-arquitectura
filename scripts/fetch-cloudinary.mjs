// Fetches every asset inside `proyects/1/` … `proyects/10/` from
// Cloudinary and writes a JSON manifest at
// `src/data/cloudinary-projects.json`. The frontend reads that JSON
// at build time so adding/removing images in Cloudinary only requires
// a redeploy — no code changes.
//
// Runs as a "prebuild" npm script, so `npm run build` triggers it
// automatically. Vercel runs the same `build` script during deploy
// → uploads the env vars from its dashboard → script picks them up.
//
// SAFETY:
// - If credentials are missing (e.g. someone runs `npm run build`
//   without a .env), the script exits cleanly without overwriting
//   the existing JSON. The build proceeds with the last-good data.
// - If a folder is empty or doesn't exist, that project gets `[]`
//   and the UI degrades gracefully.

import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_PATH = resolve(__dirname, "../src/data/cloudinary-projects.json");

// Same transformation chain we use in Hero.tsx — keeps the project
// images consistent with the brand's visual treatment.
const TRANSFORMATION = "f_auto,q_auto,w_1600,c_limit";
const PROJECT_COUNT = 10;
const FOLDER_PREFIX = "projects";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  console.warn(
    "⚠ Cloudinary credentials missing — skipping fetch.\n" +
      "  Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET\n" +
      "  in .env (local) or Vercel env vars (production).",
  );
  // Exit 0 → build keeps going with the previously committed JSON.
  process.exit(0);
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

// Builds a delivery URL for a given resource. Cloudinary's `url()`
// helper handles versioning + transformation chaining for us.
function buildUrl(resource) {
  return cloudinary.url(resource.public_id, {
    secure: true,
    version: resource.version,
    resource_type: resource.resource_type,
    format: resource.format,
    transformation: [{ raw_transformation: TRANSFORMATION }],
  });
}

async function fetchFolder(num) {
  const folder = `${FOLDER_PREFIX}/${num}`;
  const all = [];
  let nextCursor;

  // Use the Search API — works for BOTH "Fixed folders" and "Dynamic
  // folders" account modes. The legacy `resources({prefix})` only
  // works for Fixed folders (where public_id includes the folder
  // path); under Dynamic folders the relationship lives in the
  // `asset_folder` field, queried by Search.
  do {
    const res = await cloudinary.search
      .expression(`folder="${folder}" OR asset_folder="${folder}"`)
      .max_results(500)
      .next_cursor(nextCursor)
      .execute();
    all.push(...res.resources);
    nextCursor = res.next_cursor;
  } while (nextCursor);

  // Sort by `display_name` first (Cloudinary's user-facing label,
  // typically "01-cover.png" → "01-cover"), falling back to
  // `public_id`. This makes naming conventions like `01-cover`,
  // `02-interior` deterministically place the cover first.
  return all
    .sort((a, b) => {
      const aKey = a.display_name ?? a.public_id;
      const bKey = b.display_name ?? b.public_id;
      return aKey.localeCompare(bKey);
    })
    .map(buildUrl);
}

async function main() {
  console.log("→ Fetching Cloudinary folders…\n");

  const projects = {};

  for (let i = 1; i <= PROJECT_COUNT; i++) {
    process.stdout.write(`  ${FOLDER_PREFIX}/${i}/  …  `);
    try {
      const urls = await fetchFolder(i);
      projects[String(i)] = urls;
      console.log(`✓ ${urls.length} ${urls.length === 1 ? "imagen" : "imágenes"}`);
    } catch (err) {
      console.log(`✗ ${err.message}`);
      projects[String(i)] = [];
    }
  }

  mkdirSync(dirname(OUT_PATH), { recursive: true });
  writeFileSync(OUT_PATH, JSON.stringify(projects, null, 2) + "\n");

  const total = Object.values(projects).reduce((n, a) => n + a.length, 0);
  console.log(
    `\n→ Wrote ${total} URLs across ${PROJECT_COUNT} projects → ${
      existsSync(OUT_PATH) ? "src/data/cloudinary-projects.json" : "(write failed)"
    }`,
  );
}

main().catch((err) => {
  console.error("\n✗ fetch-cloudinary failed:", err.message);
  console.error("  Build will continue with the previously committed JSON.");
  process.exit(0);
});
