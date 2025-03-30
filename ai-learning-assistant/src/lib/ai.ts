import { OpenAI } from '@langchain/openai';
import { PromptTemplate } from 'langchain/prompts';
import { LLMChain } from 'langchain/chains';
import { Pinecone } from '@pinecone-database/pinecone';

// Initialize OpenAI model
export const openai = new OpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: 'gpt-4',
  temperature: 0.7,
});

// Initialize Pinecone client for vector storage
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
  environment: process.env.PINECONE_ENVIRONMENT!,
});

export const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);

// Study plan generation prompt template
const studyPlanPromptTemplate = new PromptTemplate({
  inputVariables: ["topic", "currentLevel", "goals"],
  template: `Create a personalized learning plan for a student who wants to learn about {topic}.
  Their current knowledge level is {currentLevel}.
  Their learning goals are: {goals}.
  
  The plan should include:
  1. Key concepts to master (in order of progression)
  2. Recommended learning resources for each concept
  3. Practice exercises or activities
  4. Estimated time to complete each section
  5. Milestones to track progress
  
  Format the plan in a structured manner with clear sections.`,
});

// Create LLM chain for generating study plans
export const studyPlanChain = new LLMChain({
  llm: openai,
  prompt: studyPlanPromptTemplate,
});

// Quiz generation prompt template
const quizGenerationTemplate = new PromptTemplate({
  inputVariables: ["topic", "difficulty", "numQuestions"],
  template: `Generate {numQuestions} multiple-choice questions about {topic} at {difficulty} difficulty level.
  
  For each question:
  1. Provide the question text
  2. Provide 4 possible answers (only one should be correct)
  3. Indicate which answer is correct
  4. Provide a brief explanation of why the correct answer is right
  
  Return the quiz in JSON format with the following structure:
  {
    "questions": [
      {
        "question": "Question text",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswerIndex": 0, // Index of the correct answer (0-based)
        "explanation": "Explanation of why the correct answer is right"
      }
    ]
  }`,
});

// Create LLM chain for generating quizzes
export const quizGenerationChain = new LLMChain({
  llm: openai,
  prompt: quizGenerationTemplate,
});

// Explanation generation prompt template
const explanationTemplate = new PromptTemplate({
  inputVariables: ["concept", "currentLevel"],
  template: `Explain the concept of {concept} to a student with {currentLevel} level of understanding.
  
  Your explanation should:
  1. Start with a clear, concise definition
  2. Use simple language and analogies appropriate for their level
  3. Include practical examples or applications
  4. Build upon fundamental concepts they would already know
  5. Avoid unnecessary jargon
  
  Keep your explanation comprehensive but easy to understand.`,
});

// Create LLM chain for generating explanations
export const explanationChain = new LLMChain({
  llm: openai,
  prompt: explanationTemplate,
});

// Knowledge gap analysis prompt template
const gapAnalysisTemplate = new PromptTemplate({
  inputVariables: ["responses", "topic"],
  template: `Analyze the following student's quiz responses on {topic} to identify knowledge gaps:
  
  {responses}
  
  Provide:
  1. Key concepts the student seems to misunderstand
  2. Specific subtopics they should focus on
  3. Recommendations for how to address these gaps
  4. Strengths they demonstrated
  
  Format your analysis in a clear, structured way that would be helpful for creating a personalized study plan.`,
});

// Create LLM chain for knowledge gap analysis
export const gapAnalysisChain = new LLMChain({
  llm: openai,
  prompt: gapAnalysisTemplate,
});

// Define OpenAI function schema for quiz generation
export const quizGenerationFunctionSchema = {
  name: "generateQuiz",
  description: "Generate a multiple-choice quiz on a specific topic",
  parameters: {
    type: "object",
    properties: {
      topic: {
        type: "string",
        description: "The topic to generate questions about",
      },
      difficulty: {
        type: "string",
        enum: ["beginner", "intermediate", "advanced"],
        description: "The difficulty level of the questions",
      },
      numQuestions: {
        type: "number",
        description: "Number of questions to generate",
      },
    },
    required: ["topic", "difficulty", "numQuestions"],
  },
};

// Function to call OpenAI directly with function calling
export async function generateQuizWithFunctionCalling({
  topic,
  difficulty,
  numQuestions,
}: {
  topic: string;
  difficulty: string;
  numQuestions: number;
}) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'user',
          content: `Generate a ${difficulty} level quiz about ${topic} with ${numQuestions} multiple-choice questions.`,
        },
      ],
      functions: [quizGenerationFunctionSchema],
      function_call: { name: 'generateQuiz' },
    }),
  });

  const data = await response.json();
  
  if (!data.choices || data.choices.length === 0) {
    throw new Error('Failed to generate quiz');
  }

  const functionCall = data.choices[0].message.function_call;
  
  if (!functionCall || functionCall.name !== 'generateQuiz') {
    throw new Error('Unexpected response format');
  }

  try {
    const args = JSON.parse(functionCall.arguments);
    return args;
  } catch (error) {
    throw new Error('Failed to parse quiz data');
  }
} 