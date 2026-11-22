import OpenAI from "openai";

// Lazy initialization of OpenAI client
let openai = null;

const getOpenAIClient = () => {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
};

// Mock responses for when OpenAI quota is exceeded
const getMockResponse = (prompt) => {
  const mockResponses = {
    explain: [
      "This topic covers fundamental concepts in the subject. Here's a simple breakdown:\n\n• **Key Concept 1**: Basic understanding of the main idea\n• **Key Concept 2**: How it applies in practice\n• **Example**: Think of it like [simple analogy]\n\nPractice with examples to master this topic!",
      "Let me explain this step by step:\n\n1. **Definition**: What this topic means\n2. **Components**: The main parts involved\n3. **Application**: How it's used in real scenarios\n4. **Common Mistakes**: What to avoid\n\nRemember to break complex ideas into smaller, manageable parts.",
      "Here's a beginner-friendly explanation:\n\n**What it is**: A fundamental concept in [subject]\n**Why it matters**: Helps you understand [related concepts]\n**How to approach it**: Start with basics, then build complexity\n**Practice tip**: Try working through simple examples first",
    ],
    quiz: [
      "Here are 5 practice questions:\n\n1. What is the basic definition of this concept?\n2. Can you explain one real-world application?\n3. What are the key components or steps involved?\n4. How does this relate to other concepts you've learned?\n5. What would happen if this concept wasn't applied correctly?",
      "Quiz Questions:\n\n1. Identify the main purpose of this topic.\n2. List three important characteristics.\n3. Explain how this works in a simple scenario.\n4. What are the common challenges students face?\n5. How can you verify if you've understood this correctly?",
    ],
    summarize: [
      "Key points from your notes:\n\n• Main concept and its importance\n• Critical details to remember\n• Practical applications\n• Study tips for retention",
      "Summary of notes:\n\n**Core Ideas**: The fundamental concepts covered\n**Important Details**: Key facts and relationships\n**Applications**: How this applies in practice\n**Next Steps**: What to focus on next",
    ],
  };

  // Determine response type based on prompt content
  let responseType = "explain";
  if (prompt.includes("quiz") || prompt.includes("questions")) {
    responseType = "quiz";
  } else if (prompt.includes("summarize") || prompt.includes("summary")) {
    responseType = "summarize";
  }

  const responses = mockResponses[responseType];
  return responses[Math.floor(Math.random() * responses.length)];
};

const getChatCompletion = async (prompt) => {
  try {
    const client = getOpenAIClient();
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a friendly AI tutor who explains study topics clearly and concisely.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0].message?.content?.trim();
  } catch (error) {
    // If OpenAI quota exceeded, return mock response
    if (error.status === 429 && error.code === "insufficient_quota") {
      console.log("OpenAI quota exceeded, using mock response");
      return getMockResponse(prompt);
    }
    throw error;
  }
};

export const explainTopic = async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic || topic.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Topic is required",
      });
    }

    const prompt = `Explain the following study topic in a beginner-friendly way with a short example. Keep the answer concise and easy to follow. Topic: ${topic}`;
    const explanation = await getChatCompletion(prompt);

    res.json({
      success: true,
      topic,
      explanation,
    });
  } catch (error) {
    console.error("Explain topic error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate topic explanation",
    });
  }
};

export const generateQuiz = async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic || topic.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Topic is required",
      });
    }

    const prompt = `Create 5 short quiz questions based on the following topic. Provide the question text and make each one clear for a student learning the subject. Topic: ${topic}`;
    const quiz = await getChatCompletion(prompt);

    res.json({
      success: true,
      topic,
      quiz,
    });
  } catch (error) {
    console.error("Generate quiz error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate quiz",
    });
  }
};

export const summarizeNotes = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Content is required",
      });
    }

    const prompt = `Summarize the following notes into key points. Keep the summary short, clear, and beginner-friendly. Notes: ${content}`;
    const summary = await getChatCompletion(prompt);

    res.json({
      success: true,
      summary,
    });
  } catch (error) {
    console.error("Summarize notes error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to summarize notes",
    });
  }
};
