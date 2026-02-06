import removeMarkdown from "remove-markdown";

/**
 * Fully removes markdown, symbols, bullets, and formatting
 * @param {string} input
 * @returns {string}
 */
export function parseTextToPlainText(input) {
  if (!input || typeof input !== "string") return "";

  let text = removeMarkdown(input, {
    stripListLeaders: true,
    useImgAltText: false
  });

  text = text
    .replace(/[#>*_`~\-]/g, "")      // remove markdown symbols
    .replace(/\[(.*?)\]\(.*?\)/g, "$1") // links → text
    .replace(/\n{3,}/g, "\n\n")      // normalize newlines
    .replace(/[ ]{2,}/g, " ")        // extra spaces
    .trim();

  return text;
}

let test = `
Project Description

Alright, let's dive into "AI-Powered Classroom."
As a startup advisor, my first reaction is: **exciting concept, but incredibly vague.**
The success lies entirely in the execution and the specific problem it solves.

Here's my analysis:

### Startup Idea Analysis: AI-Powered Classroom
**Idea:** AI Powered Classroom
**Description:** AI-Powered Classroo (sic)
**Category:** Idea
**Equity Offered:** Not specified%

### 1. Strengths
1. **Massive Market Potential:** The global education technology (EdTech) market is huge.
2. **Addresses Core Pain Points:** AI *can* address critical issues like:
   - **Personalized Learning**
   - **Teacher Workload**
   - **Engagement**
   - **Data-Driven Insights**

### 2. Weaknesses
1. **Extreme Vagueness:** This is the *biggest* weakness.
"AI Powered Classroom" is a concept, not a product.
`;

console.log(parseTextToPlainText(test));
