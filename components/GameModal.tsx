'use client';

import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import AiCard from './AiCard';
import { AnalyticsService } from '../lib/analytics';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
  date: Timestamp;
}

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GameModal({ isOpen, onClose }: GameModalProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);

  useEffect(() => {
    const fetchDailyQuestions = async () => {
      try {
        // Get today's date (start and end)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const questionsRef = collection(db, 'daily_questions');
        const q = query(
          questionsRef,
          where('date', '>=', today),
          where('date', '<', tomorrow)
        );

        const snapshot = await getDocs(q);
        const fetchedQuestions = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Question[];

        setQuestions(fetchedQuestions);
        AnalyticsService.trackGameAction('start_game');
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchDailyQuestions();
    }
  }, [isOpen]);

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);

    const isCorrect = answerIndex === questions[currentQuestionIndex].correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }

    AnalyticsService.trackGameAction('answer_question', {
      questionId: questions[currentQuestionIndex].id,
      isCorrect
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setGameCompleted(true);
      AnalyticsService.trackGameAction('complete_game', { finalScore: score });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
      <div className="min-h-screen px-4 text-center">
        <div className="fixed inset-0" onClick={onClose} />
        
        <div className="inline-block w-full max-w-2xl my-8 text-left align-middle transition-all transform">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <AiCard>
            <div className="space-y-8">
              {/* Header Section */}
              <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                  Daily AI Quiz
                </h1>
                <p className="text-gray-400">
                  Test your knowledge with todays AI/ML questions!
                </p>
                <div className="h-1 w-32 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-4 text-gray-400">Loading questions...</p>
                </div>
              ) : questions.length === 0 ? (
                <div className="text-center py-8">
                  <h2 className="text-xl text-gray-400">No questions available for today</h2>
                </div>
              ) : gameCompleted ? (
                <div className="text-center space-y-6">
                  <h2 className="text-2xl font-bold text-white">Game Completed!</h2>
                  <p className="text-xl text-gray-300">
                    Your score: {score}/{questions.length}
                  </p>
                  <p className="text-gray-400">Come back tomorrow for new questions!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between text-gray-400">
                    <span>Question {currentQuestionIndex + 1}/{questions.length}</span>
                    <span>Score: {score}</span>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-xl text-white font-semibold">
                      {questions[currentQuestionIndex].question}
                    </h2>

                    <div className="space-y-3">
                      {questions[currentQuestionIndex].options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleAnswerSelect(index)}
                          disabled={selectedAnswer !== null}
                          className={`w-full p-4 rounded-lg transition-all duration-200 ${
                            selectedAnswer === null
                              ? 'bg-gray-800 hover:bg-gray-700'
                              : index === questions[currentQuestionIndex].correctAnswer
                              ? 'bg-green-600'
                              : selectedAnswer === index
                              ? 'bg-red-600'
                              : 'bg-gray-800'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>

                    {showExplanation && (
                      <div className="mt-4 p-4 bg-gray-800 rounded-lg">
                        <p className="text-gray-300">
                          {questions[currentQuestionIndex].explanation}
                        </p>
                      </div>
                    )}

                    {selectedAnswer !== null && (
                      <button
                        onClick={handleNextQuestion}
                        className="w-full p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity"
                      >
                        {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Game'}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </AiCard>
        </div>
      </div>
    </div>
  );
} 