// scripts/convertExams.ts
import fs from "fs";
import path from "path";
import { parseMarkdownContent } from "../src/utils/parseMarkdown.ts";

const examsDir = path.resolve("public/exams");
const outputDir = path.resolve("public/parsed-exams");

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Read all .md files
const files = fs.readdirSync(examsDir).filter((f) => f.endsWith(".md"));

files.forEach((file) => {
  const filePath = path.join(examsDir, file);
  const content = fs.readFileSync(filePath, "utf-8");
  const questions = parseMarkdownContent(content);

  const outPath = path.join(
    outputDir,
    file.replace(/\.md$/, ".json")
  );
  fs.writeFileSync(outPath, JSON.stringify(questions, null, 2));

  console.log(`✅ Converted ${file} → ${path.relative(process.cwd(), outPath)}`);
});
