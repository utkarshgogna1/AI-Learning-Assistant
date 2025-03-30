import { notFound } from "next/navigation";
import { AssessmentContainer } from "@/components/assessment/AssessmentContainer";
import { getCurrentUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

interface AssessmentPageProps {
  params: {
    id: string;
  };
}

export default async function AssessmentPage({ params }: AssessmentPageProps) {
  const user = await getCurrentUser();
  const { id } = params;
  
  // Fetch the assessment
  const { data: assessment, error } = await supabase
    .from("assessments")
    .select("*")
    .eq("id", id)
    .single();
  
  if (error || !assessment) {
    notFound();
  }
  
  // Fetch the questions for this assessment
  const { data: questions, error: questionsError } = await supabase
    .from("questions")
    .select("*")
    .eq("assessment_id", id)
    .order("created_at");
  
  if (questionsError || !questions || questions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">{assessment.title}</h1>
          <p className="text-red-600 mb-4">
            This assessment doesn't have any questions yet.
          </p>
          <p className="text-gray-600">
            Please check back later or try another assessment.
          </p>
        </div>
      </div>
    );
  }
  
  // Transform questions to the format expected by the AssessmentContainer
  const formattedQuestions = questions.map((question) => {
    return {
      id: question.id,
      question: question.question,
      options: question.options.map((option: string, index: number) => ({
        id: `option-${index}`,
        text: option,
      })),
      correctAnswerId: `option-${question.options.indexOf(question.correct_answer)}`,
      explanation: question.explanation,
    };
  });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <AssessmentContainer
        assessmentId={id}
        userId={user.id}
        questions={formattedQuestions}
        title={assessment.title}
        description={assessment.description}
      />
    </div>
  );
} 