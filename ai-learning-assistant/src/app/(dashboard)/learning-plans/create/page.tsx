import { getCurrentUser } from "@/lib/auth";
import { LearningPlanForm } from "@/components/learning/LearningPlanForm";

export default async function CreateLearningPlanPage() {
  const user = await getCurrentUser();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create Learning Plan</h1>
      
      <div className="mb-8">
        <p className="text-gray-600 mb-4">
          Our AI will analyze your learning needs and create a personalized learning plan
          tailored to your current knowledge level and goals.
        </p>
        
        <div className="bg-blue-50 p-4 rounded-md text-blue-800 text-sm">
          <p className="font-medium">Tip</p>
          <p>
            Be specific about your goals and current knowledge level to get the most
            relevant learning plan. For example, instead of "learn Python", try "learn
            Python for data analysis with some experience in programming".
          </p>
        </div>
      </div>
      
      <LearningPlanForm userId={user.id} />
    </div>
  );
} 