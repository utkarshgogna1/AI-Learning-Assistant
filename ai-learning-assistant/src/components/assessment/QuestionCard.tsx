"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Option = {
  id: string;
  text: string;
};

type QuestionCardProps = {
  question: string;
  options: Option[];
  explanation: string;
  correctAnswerId: string;
  onAnswerSelect: (answerId: string, isCorrect: boolean) => void;
  questionNumber: number;
  totalQuestions: number;
};

export function QuestionCard({
  question,
  options,
  explanation,
  correctAnswerId,
  onAnswerSelect,
  questionNumber,
  totalQuestions,
}: QuestionCardProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  
  const handleOptionSelect = (optionId: string) => {
    if (answered) return;
    setSelectedOptionId(optionId);
  };
  
  const handleSubmit = () => {
    if (!selectedOptionId || answered) return;
    
    const isCorrect = selectedOptionId === correctAnswerId;
    setAnswered(true);
    onAnswerSelect(selectedOptionId, isCorrect);
  };
  
  const getOptionClass = (optionId: string) => {
    if (!answered) {
      return selectedOptionId === optionId
        ? "border-blue-500 bg-blue-50"
        : "border-gray-200 hover:border-blue-300 hover:bg-blue-50";
    }
    
    if (optionId === correctAnswerId) {
      return "border-green-500 bg-green-50";
    }
    
    if (selectedOptionId === optionId && optionId !== correctAnswerId) {
      return "border-red-500 bg-red-50";
    }
    
    return "border-gray-200 opacity-70";
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm font-medium text-gray-500">
          Question {questionNumber} of {totalQuestions}
        </span>
      </div>
      
      <h3 className="text-xl font-semibold mb-4">{question}</h3>
      
      <div className="space-y-3 mb-6">
        {options.map((option) => (
          <div
            key={option.id}
            className={`border rounded-md p-4 cursor-pointer transition-colors ${getOptionClass(
              option.id
            )}`}
            onClick={() => handleOptionSelect(option.id)}
          >
            {option.text}
          </div>
        ))}
      </div>
      
      {answered && (
        <div className="mt-4">
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="text-blue-600 hover:underline text-sm font-medium focus:outline-none"
          >
            {showExplanation ? "Hide explanation" : "Show explanation"}
          </button>
          
          {showExplanation && (
            <div className="mt-3 p-4 bg-blue-50 rounded-md text-gray-700">
              {explanation}
            </div>
          )}
        </div>
      )}
      
      <div className="flex justify-between mt-6">
        <div></div>
        {!answered ? (
          <Button
            onClick={handleSubmit}
            disabled={!selectedOptionId}
          >
            Submit Answer
          </Button>
        ) : (
          <Button>Next Question</Button>
        )}
      </div>
    </div>
  );
} 