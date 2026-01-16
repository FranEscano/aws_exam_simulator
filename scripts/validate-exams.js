import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const excludedFiles = ['explanations.json', 'exams.json']
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const examsDir = path.join(__dirname, '../public/parsed-exams');
const files = fs.readdirSync(examsDir)
    .filter(f => f.endsWith('json'))
    .filter(f => !excludedFiles.includes(f));

let hasError = false;

files.forEach(file => {
    try {
        let rawData = fs.readFileSync(path.join(examsDir, file), 'utf-8');
        rawData = rawData.trim().replace(/^\uFEFF/, '').trim();

        const data = JSON.parse(rawData);

        console.log(`Testing ${file}...`);

        // if(!data.title) throw new Error("Exam title is missing");
        // if(!data.questions || !Array.isArray(data.questions)) throw new Error("Question field should be an Array");

        data.questions.forEach((q, index) => {
            const cleanQ = {};
            Object.keys(q).forEach(key => {
                const cleanKey = key.replace(/[^\w]/g, '');
                cleanQ[cleanKey] = q[key];
            });

            const qId = cleanQ.id || index + 1;

            // if(index === 0) {
            //     console.log(`DEBUG Question 1 - Field in the file:`, Object.keys(q));
            // }

            const missing = [];
            if(!q.question) missing.push("question");
            if(!q.options) missing.push("options");
            if(!q.correctAnswers) missing.push("correctAnswers");

            if(missing.length > 0) {
                throw new Error(`Question ID ${qId}: Missing fields: ${missing.join(", ")}`);
            }

            if(!cleanQ.question) {
                throw new Error(`Question ${qId}: Missing basic fields`);
            }

            if(!cleanQ.explanation || cleanQ.explanation.trim().length < 5) {
                throw new Error(`Question ${qId}: Explanation missing or too short`);
            }

            if(!cleanQ.correctAnswers || cleanQ.correctAnswers.length === 0) {
                throw new Error(`Question ${qId} does not have correct answer`);
            }
            cleanQ.correctAnswers.forEach(ans => {
                if(!cleanQ.options.find(o => o.letter === ans)) {
                    throw new Error(`Question ${qId}: The correct answer '${ans}' does not exist in the options`);
                }
            });
        });

        console.log(`${file} pass the Test`);
    } catch(err) {
        console.error(`Error in ${file}: ${err.message}`);
        hasError = true;
    }
});

if (hasError) process.exit(1);