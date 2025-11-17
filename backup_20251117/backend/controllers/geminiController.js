const { GoogleGenAI }  = require("@google/genai");

const ai = new GoogleGenAI({});

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "AI powered class romm (education)is my startup title write the objective in 5 main points",
  });
  console.log(response.text);
}

module.exports = {main}