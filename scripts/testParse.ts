// scripts/testParse.ts
import { parseMarkdownFile } from "../src/utils/parseMarkdown.ts";

const questions = parseMarkdownFile("public/exams/exam1.md");
console.log(JSON.stringify(questions, null, 2));
