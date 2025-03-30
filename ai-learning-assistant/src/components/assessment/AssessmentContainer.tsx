"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { QuestionCard } from "./QuestionCard";
import { Button } from "@/components/ui/button";
import { calculateScorePercentage } from "@/lib/utils";

type Question = {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  correctAnswerId: string;
  explanation: string;
};

type AssessmentContainerProps = {
  assessmentId: string;
  userId: string;
  questions: Question[];
  title: string;
  description: string;
};

export function AssessmentContainer({
  assessmentId,
  userId,
  questions,
  title,
  description,
}: AssessmentContainerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<
    { questionId: string; answerId: string; isCorrect: boolean }[]
  >([]);
  const [assessmentCompleted, setAssessmentCompleted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const progress = Math.round(
    ((currentQuestionIndex + (assessmentCompleted ? 1 : 0)) / totalQuestions) * 100
  );

  // Handle answer selection
  const handleAnswerSelect = (answerId: string, isCorrect: boolean) => {
    const answer = {
      questionId: currentQuestion.id,
      answerId,
      isCorrect,
    };

    setUserAnswers((prev) => [...prev, answer]);
  };

  // Move to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setAssessmentCompleted(true);
    }
  };

  // Save assessment results to database
  const saveResults = async () => {
    try {
      setIsSaving(true);

      // Calculate score
      const correctAnswers = userAnswers.filter((answer) => answer.isCorrect).length;
      const score = calculateScorePercentage(correctAnswers, totalQuestions);

      // Save user progress
      const { error: progressError } = await supabase
        .from("user_progress")
        .upsert({
          user_id: userId,
          assessment_id: assessmentId,
          progress: 100,
          score,
          completed: true,
          updated_at: new Date().toISOString(),
        });

      if (progressError) {
        throw progressError;
      }

      // Save individual responses
      const responses = userAnswers.map((answer) => ({
        user_id: userId,
        question_id: answer.questionId,
        assessment_id: assessmentId,
        answered_option: answer.answerId,
        is_correct: answer.isCorrect,
        created_at: new Date().toISOString(),
      }));

      const { error: responsesError } = await supabase
        .from("responses")
        .insert(responses);

      if (responsesError) {
        throw responsesError;
      }

      // Check for achievement: first assessment completed
      const { data: existingProgress } = await supabase
        .from("user_progress")
        .select("id")
        .eq("user_id", userId)
        .eq("completed", true);

      if (existingProgress?.length === 1) {
        // This is the first completed assessment
        await supabase.from("achievements").insert({
          user_id: userId,
          achievement_type: "First Assessment Completed",
          achievement_data: { assessment_id: assessmentId },
          created_at: new Date().toISOString(),
        });
      }

      // Check for achievement: perfect score
      if (score === 100) {
        await supabase.from("achievements").insert({
          user_id: userId,
          achievement_type: "Perfect Score",
          achievement_data: { assessment_id: assessmentId, score },
          created_at: new Date().toISOString(),
        });
      }

      router.push(`/assessments/${assessmentId}/results`);
    } catch (error) {
      console.error("Error saving results:", error);
      alert("There was an error saving your results. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Show results summary
  if (assessmentCompleted) {
    const correctAnswers = userAnswers.filter((answer) => answer.isCorrect).length;
    const score = calculateScorePercentage(correctAnswers, totalQuestions);

    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6">Assessment Completed!</h2>

        <div className="mb-6">
          <div className="text-gray-600 mb-2">Your Score</div>
          <div className="text-5xl font-bold text-blue-600">{score}%</div>
          <div className="text-gray-500 mt-1">
            {correctAnswers} out of {totalQuestions} correct
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Summary</h3>
          <p className="text-gray-600">
            You've completed the "{title}" assessment. Your results have been
            saved, and you can review your answers and explanations below.
          </p>
        </div>

        <Button onClick={saveResults} disabled={isSaving} className="w-full">
          {isSaving ? "Saving..." : "View Detailed Results"}
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold">{title}</h2>
          <span className="text-gray-500 text-sm">{progress}% complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <QuestionCard
        question={currentQuestion.question}
        options={currentQuestion.options}
        explanation={currentQuestion.explanation}
        correctAnswerId={currentQuestion.correctAnswerId}
        onAnswerSelect={handleAnswerSelect}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={totalQuestions}
      />

      <div className="mt-4 flex justify-end">
        {userAnswers.find(
          (answer) => answer.questionId === currentQuestion.id
        ) && (
          <Button onClick={handleNextQuestion}>
            {currentQuestionIndex < totalQuestions - 1
              ? "Next Question"
              : "Complete Assessment"}
          </Button>
        )}
      </div>
    </div>
  );
} 