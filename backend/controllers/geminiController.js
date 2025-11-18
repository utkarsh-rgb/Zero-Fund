const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "gemini-2.5-flash";

// Helper function: send query to Gemini REST API
async function askGemini(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

  try {
    const response = await axios.post(
      url,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        timeout: 60000, // 60 seconds timeout
      }
    );

    return response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  } catch (err) {
    console.error("Gemini API ERROR:", err.response?.data || err.message);
    throw err;
  }
}

/**
 * ANALYZE STARTUP IDEA
 */
const analyzeIdea = async (req, res) => {
  try {
    const { title, description, category, equityOffered } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required" });
    }

    const prompt = `
As a startup advisor, analyze the following startup idea:

Title: ${title}
Description: ${description}
Category: ${category || "Not specified"}
Equity Offered: ${equityOffered || "Not specified"}%

Provide:
1. Strengths
2. Weaknesses
3. Market Potential
4. Recommendations
5. Success Probability (1–10)
    `;

    const text = await askGemini(prompt);

    res.json({ success: true, analysis: text, ideaTitle: title });

  } catch (error) {
    console.error("Error analyzing idea:", error);
    res.status(500).json({ error: "Failed to analyze idea", details: error.message });
  }
};

/**
 * MATCH DEVELOPERS
 */
const matchDevelopers = async (req, res) => {
  try {
    const { ideaDescription, requiredSkills, developers } = req.body;

    if (!ideaDescription || !developers?.length) {
      return res.status(400).json({ error: "Idea description and developers list are required" });
    }

    const developersInfo = developers
      .map(
        (dev, index) => `Developer ${index + 1}:
- Name: ${dev.name}
- Skills: ${dev.skills}
- Experience: ${dev.experience}
- Bio: ${dev.bio}`
      )
      .join("\n\n");

    const prompt = `
As a technical recruiter, analyze matching developers:

Startup Idea: ${ideaDescription}
Required Skills: ${requiredSkills}

Developers:
${developersInfo}

Provide:
1. Top 3 matches
2. Skill gap analysis
3. Recommended team
4. Missing skills
`;

    const text = await askGemini(prompt);

    res.json({ success: true, matching: text, totalDevelopers: developers.length });

  } catch (error) {
    console.error("Error matching developers:", error);
    res.status(500).json({ error: "Failed to match developers", details: error.message });
  }
};

/**
 * EVALUATE PROPOSAL
 */
const evaluateProposal = async (req, res) => {
  try {
    const { proposalText, developerSkills, equityOffered, timeline } = req.body;

    if (!proposalText) return res.status(400).json({ error: "Proposal text is required" });

    const prompt = `
Evaluate this collaboration proposal:

Proposal: ${proposalText}
Developer Skills: ${developerSkills}
Equity Offered: ${equityOffered}%
Timeline: ${timeline}

Provide:
1. Fairness assessment
2. Risks
3. Timeline feasibility
4. Terms clarity
5. Recommendations
6. Score (1–10)
`;

    const text = await askGemini(prompt);

    res.json({ success: true, evaluation: text });

  } catch (error) {
    console.error("Error evaluating proposal:", error);
    res.status(500).json({ error: "Failed to evaluate proposal", details: error.message });
  }
};

/**
 * GET MARKET INSIGHTS
 */
const getMarketInsights = async (req, res) => {
  try {
    const { category, ideaTitle } = req.body;

    if (!category) return res.status(400).json({ error: "Category is required" });

    const prompt = `
Provide market insights for the ${category} sector
${ideaTitle ? `(focused on: ${ideaTitle})` : ""}

Include:
1. Trends
2. Competition
3. Target audience
4. Growth potential
5. Challenges
6. Success factors
`;

    const text = await askGemini(prompt);

    res.json({ success: true, insights: text, category });

  } catch (error) {
    console.error("Error getting market insights:", error);
    res.status(500).json({ error: "Failed to get market insights", details: error.message });
  }
};

/**
 * SUGGEST STARTUP NAMES
 */
const suggestNames = async (req, res) => {
  try {
    const { description, category, keywords } = req.body;

    if (!description) return res.status(400).json({ error: "Description is required" });

    const prompt = `
Generate 10 startup names based on:

Description: ${description}
Category: ${category}
Keywords: ${keywords}

Requirements: 1–2 words, unique, memorable.
`;

    const text = await askGemini(prompt);

    res.json({ success: true, suggestions: text });

  } catch (error) {
    console.error("Error suggesting names:", error);
    res.status(500).json({ error: "Failed to suggest names", details: error.message });
  }
};

module.exports = {
  analyzeIdea,
  matchDevelopers,
  evaluateProposal,
  getMarketInsights,
  suggestNames,
};
