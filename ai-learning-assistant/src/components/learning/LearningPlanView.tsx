"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type LearningPlanProps = {
  id: string;
  topic: string;
  planData: {
    plan: string;
    currentLevel: string;
    goals: string;
    generatedAt: string;
  };
  createdAt: string;
};

export function LearningPlanView({ id, topic, planData, createdAt }: LearningPlanProps) {
  const [showFullPlan, setShowFullPlan] = useState(false);
  
  // Format the plan text to display sections properly
  const formatPlanDisplay = (plan: string) => {
    // Replace markdown headers with styled divs
    let formattedPlan = plan.replace(
      /^#\s+(.*$)/gm,
      '<div class="text-xl font-bold mt-6 mb-3">$1</div>'
    );
    formattedPlan = formattedPlan.replace(
      /^##\s+(.*$)/gm,
      '<div class="text-lg font-semibold mt-5 mb-2">$1</div>'
    );
    formattedPlan = formattedPlan.replace(
      /^###\s+(.*$)/gm,
      '<div class="text-base font-semibold mt-4 mb-2">$1</div>'
    );
    
    // Format lists
    formattedPlan = formattedPlan.replace(
      /^\d+\.\s+(.*$)/gm,
      '<div class="ml-4 mb-2"><span class="font-medium">•</span> $1</div>'
    );
    formattedPlan = formattedPlan.replace(
      /^-\s+(.*$)/gm,
      '<div class="ml-4 mb-2"><span class="font-medium">•</span> $1</div>'
    );
    
    // Add paragraphs
    formattedPlan = formattedPlan.replace(
      /^(?!<div)(.*$)/gm,
      '<p class="mb-3">$1</p>'
    );
    
    return formattedPlan;
  };
  
  // For initial display, show a limited preview
  const getPreview = (plan: string) => {
    const lines = plan.split('\n').slice(0, 15);
    return lines.join('\n');
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold">{topic}</h2>
          <span className="text-sm text-gray-500">{formatDate(createdAt)}</span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            {planData.currentLevel}
          </span>
        </div>
        
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Learning Goals:</h3>
          <p className="text-gray-700">{planData.goals}</p>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Your Learning Plan</h3>
        
        <div className="prose max-w-none">
          <div
            dangerouslySetInnerHTML={{
              __html: formatPlanDisplay(
                showFullPlan ? planData.plan : getPreview(planData.plan)
              ),
            }}
          />
          
          {!showFullPlan && (
            <button
              onClick={() => setShowFullPlan(true)}
              className="text-blue-600 hover:underline mt-2 font-medium"
            >
              Show Full Plan
            </button>
          )}
        </div>
      </div>
      
      <div className="p-6 bg-gray-50 border-t">
        <div className="flex flex-wrap gap-3">
          <Link href={`/learning-plans/${id}/update`}>
            <Button variant="outline">Update Plan</Button>
          </Link>
          <Link href={`/assessments?topic=${encodeURIComponent(topic)}`}>
            <Button variant="outline">Find Related Assessments</Button>
          </Link>
          <Button variant="outline" onClick={() => window.print()}>
            Print Plan
          </Button>
        </div>
      </div>
    </div>
  );
} 