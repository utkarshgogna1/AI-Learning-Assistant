import { notFound } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { formatDate, calculateScorePercentage } from "@/lib/utils";
import { gapAnalysisChain } from "@/lib/ai";

interface AssessmentResultsPageProps {
  params: {
    id: string;
  };
}

export default async function AssessmentResultsPage({ params }: AssessmentResultsPageProps) {
  const user = await getCurrentUser();
  const { id } = params;
  
  // Fetch the assessment
  const { data: assessment, error: assessmentError } = await supabase
    .from("assessments")
    .select("*")
    .eq("id", id)
    .single();
  
  if (assessmentError || !assessment) {
    notFound();
  }
  
  // Fetch user's progress on this assessment
  const { data: progress, error: progressError } = await supabase
    .from("user_progress")
    .select("*")
    .eq("assessment_id", id)
    .eq("user_id", user.id)
    .single();
  
  if (progressError || !progress) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">{assessment.title}</h1>
          <p className="text-red-600 mb-4">
            You haven't completed this assessment yet.
          </p>
          <Link href={`/assessments/${id}`}>
            <Button>Take Assessment</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  // Fetch user's responses for this assessment
  const { data: responses, error: responsesError } = await supabase
    .from("responses")
    .select(`
      *,
      questions:question_id(
        id, 
        question, 
        options, 
        correct_answer,
        explanation
      )
    `)
    .eq("assessment_id", id)
    .eq("user_id", user.id);
  
  if (responsesError || !responses || responses.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">{assessment.title}</h1>
          <p className="text-red-600 mb-4">
            We couldn't find your responses for this assessment.
          </p>
          <Link href="/assessments">
            <Button>Browse Assessments</Button>
          </Link>
        </div>
      </div>
    );
  }
  
  // Generate knowledge gap analysis
  const formattedResponses = responses.map((response) => ({
    question: response.questions.question,
    userAnswer: response.answered_option,
    correctAnswer: response.questions.correct_answer,
    isCorrect: response.is_correct,
  }));
  
  // Call AI to generate knowledge gap analysis
  let knowledgeGapAnalysis;
  try {
    const result = await gapAnalysisChain.invoke({
      responses: JSON.stringify(formattedResponses),
      topic: assessment.title,
    });
    knowledgeGapAnalysis = result.text;
  } catch (error) {
    console.error("Error generating knowledge gap analysis:", error);
    knowledgeGapAnalysis = "Unable to generate knowledge gap analysis at this time.";
  }
  
  // Calculate statistics
  const totalQuestions = responses.length;
  const correctAnswers = responses.filter((r) => r.is_correct).length;
  const incorrectAnswers = totalQuestions - correctAnswers;
  const score = calculateScorePercentage(correctAnswers, totalQuestions);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          href="/assessments"
          className="text-blue-600 hover:text-blue-800 inline-flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Assessments
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-8">{assessment.title} Results</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Assessment Summary</h2>
          
          <div className="mb-6">
            <div className="text-gray-600 mb-2">Your Score</div>
            <div className="text-5xl font-bold text-blue-600">{score}%</div>
            <div className="text-gray-500 mt-1">
              {correctAnswers} out of {totalQuestions} correct
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Subject</span>
                <span className="font-medium">{assessment.subject}</span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Difficulty</span>
                <span className="font-medium capitalize">{assessment.difficulty}</span>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Completed On</span>
                <span className="font-medium">{formatDate(progress.updated_at)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Knowledge Gap Analysis</h2>
          <div className="prose max-w-none">
            <p className="whitespace-pre-line">{knowledgeGapAnalysis}</p>
          </div>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-4">Question Review</h2>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-10">
        {responses.map((response, index) => (
          <div
            key={response.id}
            className={`p-6 ${
              index < responses.length - 1 ? "border-b" : ""
            }`}
          >
            <div className="flex items-start">
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                  response.is_correct
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {response.is_correct ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-2">
                  {index + 1}. {response.questions.question}
                </h3>
                
                <div className="mb-4">
                  {response.questions.options.map((option: string) => (
                    <div
                      key={option}
                      className={`py-2 pl-3 pr-4 mb-2 rounded-md ${
                        option === response.questions.correct_answer
                          ? "bg-green-50 border border-green-200"
                          : option === response.answered_option &&
                            option !== response.questions.correct_answer
                          ? "bg-red-50 border border-red-200"
                          : "bg-gray-50 border border-gray-200"
                      }`}
                    >
                      <div className="flex items-center">
                        {option === response.questions.correct_answer && (
                          <span className="text-green-600 mr-2">✓</span>
                        )}
                        {option === response.answered_option &&
                          option !== response.questions.correct_answer && (
                            <span className="text-red-600 mr-2">✗</span>
                          )}
                        <span>{option}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="bg-blue-50 p-4 rounded-md text-gray-700">
                  <div className="font-medium mb-1">Explanation:</div>
                  <div>{response.questions.explanation}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex flex-wrap gap-4 justify-center">
        <Link href={`/assessments/${id}`}>
          <Button>Retake Assessment</Button>
        </Link>
        <Link href="/learning-plans/create">
          <Button variant="outline">Create Learning Plan</Button>
        </Link>
        <Link href="/assessments">
          <Button variant="outline">Browse More Assessments</Button>
        </Link>
      </div>
    </div>
  );
} 