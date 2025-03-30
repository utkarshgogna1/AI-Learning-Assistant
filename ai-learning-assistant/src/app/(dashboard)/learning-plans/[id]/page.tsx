import { notFound } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { LearningPlanView } from "@/components/learning/LearningPlanView";

interface LearningPlanPageProps {
  params: {
    id: string;
  };
}

export default async function LearningPlanPage({ params }: LearningPlanPageProps) {
  const user = await getCurrentUser();
  const { id } = params;
  
  // Fetch the learning plan
  const { data: learningPlan, error } = await supabase
    .from("learning_plans")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();
  
  if (error || !learningPlan) {
    notFound();
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/learning-plans"
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
          Back to Learning Plans
        </Link>
      </div>
      
      <LearningPlanView
        id={learningPlan.id}
        topic={learningPlan.topic}
        planData={learningPlan.plan_data}
        createdAt={learningPlan.created_at}
      />
      
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-6">Recommended Next Steps</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3">Take an Assessment</h3>
            <p className="text-gray-600 mb-4">
              Test your knowledge on this topic with an interactive assessment.
            </p>
            <Link href={`/assessments?topic=${encodeURIComponent(learningPlan.topic)}`}>
              <Button variant="outline" className="w-full">
                Find Assessments
              </Button>
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3">Track Your Progress</h3>
            <p className="text-gray-600 mb-4">
              Mark topics as completed to track your learning journey.
            </p>
            <Button variant="outline" className="w-full">
              Update Progress
            </Button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3">Update Learning Plan</h3>
            <p className="text-gray-600 mb-4">
              Modify your learning plan as you progress or your goals change.
            </p>
            <Link href={`/learning-plans/${id}/update`}>
              <Button variant="outline" className="w-full">
                Update Plan
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 