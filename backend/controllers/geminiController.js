const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini AI with API key from environment
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * Analyze a startup idea and provide AI-powered feedback
 */
const analyzeIdea = async (req, res) => {
  try {
    const { title, description, category, equityOffered } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `As a startup advisor, analyze the following startup idea and provide detailed feedback:

Title: ${title}
Description: ${description}
Category: ${category || "Not specified"}
Equity Offered: ${equityOffered || "Not specified"}%

Please provide:
1. Strengths: Key advantages and unique value propositions
2. Weaknesses: Potential challenges and risks
3. Market Potential: Target market size and opportunities
4. Recommendations: 3-5 actionable suggestions for improvement
5. Success Probability: Rate from 1-10 with brief explanation

Format the response in clear sections.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = response.text();

    res.json({
      success: true,
      analysis: analysis,
      ideaTitle: title
    });

  } catch (error) {
    console.error("Error analyzing idea:", error);
    res.status(500).json({
      error: "Failed to analyze idea",
      details: error.message
    });
  }
};

/**
 * Match developers with a startup idea based on required skills
 */
const matchDevelopers = async (req, res) => {
  try {
    const { ideaDescription, requiredSkills, developers } = req.body;

    if (!ideaDescription || !developers || developers.length === 0) {
      return res.status(400).json({ error: "Idea description and developers list are required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const developersInfo = developers.map((dev, index) =>
      `Developer ${index + 1}:
       - Name: ${dev.name || "Anonymous"}
       - Skills: ${dev.skills || "Not specified"}
       - Experience: ${dev.experience || "Not specified"}
       - Bio: ${dev.bio || "Not specified"}`
    ).join("\n\n");

    const prompt = `As a technical recruiter, analyze which developers are the best fit for this startup idea:

Startup Idea: ${ideaDescription}
Required Skills: ${requiredSkills || "Not specified"}

Available Developers:
${developersInfo}

Please provide:
1. Top 3 best matches with reasons why they're suitable
2. Skill gap analysis for each developer
3. Recommended team composition
4. Additional skills needed

Format as a structured analysis.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const matching = response.text();

    res.json({
      success: true,
      matching: matching,
      totalDevelopers: developers.length
    });

  } catch (error) {
    console.error("Error matching developers:", error);
    res.status(500).json({
      error: "Failed to match developers",
      details: error.message
    });
  }
};

/**
 * Evaluate a collaboration proposal
 */
const evaluateProposal = async (req, res) => {
  try {
    const { proposalText, developerSkills, equityOffered, timeline } = req.body;

    if (!proposalText) {
      return res.status(400).json({ error: "Proposal text is required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `As a business advisor, evaluate this collaboration proposal:

Proposal: ${proposalText}
Developer Skills: ${developerSkills || "Not specified"}
Equity Offered: ${equityOffered || "Not specified"}%
Timeline: ${timeline || "Not specified"}

Please provide:
1. Fairness Assessment: Is the equity offer fair given the scope?
2. Risk Analysis: Potential risks for both parties
3. Timeline Feasibility: Is the timeline realistic?
4. Terms Evaluation: Are the terms clear and balanced?
5. Recommendations: Suggestions for improvement
6. Overall Score: Rate from 1-10 with explanation

Provide a balanced, professional evaluation.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const evaluation = response.text();

    res.json({
      success: true,
      evaluation: evaluation
    });

  } catch (error) {
    console.error("Error evaluating proposal:", error);
    res.status(500).json({
      error: "Failed to evaluate proposal",
      details: error.message
    });
  }
};

/**
 * Get market insights and trends for a startup category
 */
const getMarketInsights = async (req, res) => {
  try {
    const { category, ideaTitle } = req.body;

    if (!category) {
      return res.status(400).json({ error: "Category is required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `As a market research analyst, provide insights for the ${category} startup sector${ideaTitle ? ` (specifically for: ${ideaTitle})` : ""}:

Please provide:
1. Current Market Trends: Latest developments and opportunities
2. Competition Landscape: Key players and market dynamics
3. Target Audience: Primary customer segments
4. Growth Potential: Market size and growth projections
5. Challenges: Common obstacles in this sector
6. Success Factors: What makes startups succeed in this space

Provide data-driven, actionable insights.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const insights = response.text();

    res.json({
      success: true,
      insights: insights,
      category: category
    });

  } catch (error) {
    console.error("Error getting market insights:", error);
    res.status(500).json({
      error: "Failed to get market insights",
      details: error.message
    });
  }
};

/**
 * Generate startup name suggestions based on idea
 */
const suggestNames = async (req, res) => {
  try {
    const { description, category, keywords } = req.body;

    if (!description) {
      return res.status(400).json({ error: "Description is required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Generate 10 creative, memorable startup names based on:

Description: ${description}
Category: ${category || "Not specified"}
Keywords: ${keywords || "Not specified"}

Requirements:
- Names should be unique, catchy, and easy to remember
- Ideally 1-2 words
- Should reflect the startup's mission
- Include brief explanation for each name

Provide the list in a clear format.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const suggestions = response.text();

    res.json({
      success: true,
      suggestions: suggestions
    });

  } catch (error) {
    console.error("Error suggesting names:", error);
    res.status(500).json({
      error: "Failed to suggest names",
      details: error.message
    });
  }
};

module.exports = {
  analyzeIdea,
  matchDevelopers,
  evaluateProposal,
  getMarketInsights,
  suggestNames
};
