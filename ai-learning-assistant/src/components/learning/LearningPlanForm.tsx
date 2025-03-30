"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { studyPlanChain } from "@/lib/ai";

interface FormData {
  topic: string;
  currentLevel: string;
  goals: string;
  userId: string;
}

export function LearningPlanForm({ userId }: { userId: string }) {
  const [formData, setFormData] = useState<FormData>({
    topic: "",
    currentLevel: "beginner",
    goals: "",
    userId,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Generate learning plan using AI
      const result = await studyPlanChain.invoke({
        topic: formData.topic,
        currentLevel: formData.currentLevel,
        goals: formData.goals,
      });
      
      // Save learning plan to database
      const { error: dbError } = await supabase.from("learning_plans").insert([
        {
          user_id: userId,
          topic: formData.topic,
          plan_data: {
            plan: result.text,
            currentLevel: formData.currentLevel,
            goals: formData.goals,
            generatedAt: new Date().toISOString(),
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);
      
      if (dbError) {
        throw dbError;
      }
      
      // Redirect to learning plans list
      router.push("/learning-plans");
      router.refresh();
    } catch (err: any) {
      console.error("Error creating learning plan:", err);
      setError(err.message || "Failed to create learning plan. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create a Personalized Learning Plan</h2>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1">
            What topic do you want to learn about?
          </label>
          <input
            type="text"
            id="topic"
            name="topic"
            required
            value={formData.topic}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Machine Learning, JavaScript, Quantum Physics"
          />
        </div>
        
        <div>
          <label htmlFor="currentLevel" className="block text-sm font-medium text-gray-700 mb-1">
            What is your current knowledge level on this topic?
          </label>
          <select
            id="currentLevel"
            name="currentLevel"
            value={formData.currentLevel}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="beginner">Beginner - Little to no knowledge</option>
            <option value="intermediate">Intermediate - Some knowledge but need to improve</option>
            <option value="advanced">Advanced - Solid understanding but want to master</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="goals" className="block text-sm font-medium text-gray-700 mb-1">
            What are your learning goals?
          </label>
          <textarea
            id="goals"
            name="goals"
            required
            value={formData.goals}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Build a web application, prepare for a certification exam, teach others"
          ></textarea>
        </div>
        
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Generating Plan..." : "Create Learning Plan"}
        </Button>
      </form>
      
      <div className="mt-6 text-sm text-gray-500">
        <p>
          Our AI will analyze your input and create a personalized learning plan 
          with recommended resources, practice exercises, and milestones.
        </p>
      </div>
    </div>
  );
} 