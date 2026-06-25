import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientRoot = path.resolve(__dirname, "..");
const sourceDir = path.join(clientRoot, "assets", "source-images");
const outputDir = path.join(clientRoot, "public", "optimized");

const widths = [640, 1024, 1536, 2048];

const images = [
  { source: "demo.png", name: "demo-hero" },
  { source: "demo2.png", name: "demo-feature" },
  { source: "login_demo.png", name: "login-demo" },
];

const force = process.argv.includes("--force");

const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
};

const expectedOutputsFor = (name) => [
  path.join(outputDir, `${name}-placeholder.webp`),
  ...widths.flatMap((width) => [
    path.join(outputDir, `${name}-${width}.avif`),
    path.join(outputDir, `${name}-${width}.webp`),
    path.join(outputDir, `${name}-${width}.jpg`),
  ]),
];

const outputIsFresh = async (input, name) => {
  if (force) return false;

  const sourceStat = await fs.stat(input);
  const outputs = expectedOutputsFor(name);

  for (const output of outputs) {
    try {
      const outputStat = await fs.stat(output);
      if (outputStat.mtimeMs < sourceStat.mtimeMs) return false;
    } catch {
      return false;
    }
  }

  return true;
};

const writeVariant = async (input, name, width, format) => {
  const base = sharp(input).rotate().resize({
    width,
    withoutEnlargement: true,
  });

  const filePath = path.join(outputDir, `${name}-${width}.${format}`);

  if (format === "avif") {
    await base.avif({ quality: 58, effort: 6 }).toFile(filePath);
  } else if (format === "webp") {
    await base.webp({ quality: 84, effort: 5 }).toFile(filePath);
  } else {
    await base.jpeg({ quality: 86, mozjpeg: true, progressive: true }).toFile(filePath);
  }

  return filePath;
};

const optimizeImage = async ({ source, name }) => {
  const input = path.join(sourceDir, source);
  await fs.access(input);

  if (await outputIsFresh(input, name)) {
    console.log(`${name}: already optimized`);
    return;
  }

  await sharp(input)
    .rotate()
    .resize({ width: 32, withoutEnlargement: true })
    .blur(8)
    .webp({ quality: 36, effort: 4 })
    .toFile(path.join(outputDir, `${name}-placeholder.webp`));

  const outputs = [];
  for (const width of widths) {
    outputs.push(await writeVariant(input, name, width, "avif"));
    outputs.push(await writeVariant(input, name, width, "webp"));
    outputs.push(await writeVariant(input, name, width, "jpg"));
  }

  const largestDesktop = path.join(outputDir, `${name}-2048.webp`);
  const stat = await fs.stat(largestDesktop);
  console.log(`${name}: generated ${outputs.length + 1} files, ${formatBytes(stat.size)} desktop WebP`);
};

await fs.mkdir(outputDir, { recursive: true });

for (const image of images) {
  await optimizeImage(image);
}
