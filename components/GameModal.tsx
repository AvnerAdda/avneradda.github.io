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
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchDailyQuestions = async () => {
      try {
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
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;
    
    setSubmitted(true);
    setShowExplanation(true);

    const isCorrect = selectedAnswer === questions[currentQuestionIndex].correctAnswer;
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
      setSubmitted(false);
    } else {
      setGameCompleted(true);
      AnalyticsService.trackGameAction('complete_game', { finalScore: score });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="min-h-screen px-4 text-center">
        <div className="fixed inset-0" onClick={onClose} />
        
        <div className="inline-block w-full max-w-2xl my-8 text-left align-middle transition-all transform">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 text-gray-400 hover:text-white transition-colors"
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
                  Test your knowledge with daily AI/ML questions!
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
                <div className="text-center space-y-6 py-8">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">{Math.round((score / questions.length) * 100)}%</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white">Quiz Completed!</h2>
                  <p className="text-xl text-gray-300">
                    You scored {score} out of {questions.length}
                  </p>
                  <div className="p-4">
                    <p className="text-gray-400">
                      {score === questions.length 
                        ? "Perfect score! You're an AI expert! 🎉" 
                        : score >= questions.length / 2 
                        ? "Great job! Keep learning and improving! 🌟"
                        : "Keep practicing! The AI field is constantly evolving. 💪"}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity"
                  >
                    Close Quiz
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Question {currentQuestionIndex + 1}/{questions.length}</span>
                    <span className="px-4 py-2 bg-gray-800 rounded-full text-gray-300">Score: {score}</span>
                  </div>

                  <div className="space-y-6">
                    <div className="p-4">
                      <h2 className="text-xl text-white font-semibold">
                        {questions[currentQuestionIndex].question}
                      </h2>
                      <span className="inline-block mt-2 px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300">
                        {questions[currentQuestionIndex].category}
                      </span>
                    </div>

                    <div className="grid gap-3">
                      {questions[currentQuestionIndex].options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => !submitted && handleAnswerSelect(index)}
                          disabled={submitted}
                          className={`p-4 rounded-lg transition-all duration-200 text-left
                            ${submitted 
                              ? index === questions[currentQuestionIndex].correctAnswer
                                ? 'bg-green-600 text-white'
                                : selectedAnswer === index
                                ? 'bg-red-600 text-white'
                                : 'bg-gray-800 text-gray-400'
                              : selectedAnswer === index
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                            }
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-700">
                              {String.fromCharCode(65 + index)}
                            </span>
                            {option}
                          </div>
                        </button>
                      ))}
                    </div>

                    {!submitted && selectedAnswer !== null && (
                      <button
                        onClick={handleSubmit}
                        className="w-full p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity"
                      >
                        Submit Answer
                      </button>
                    )}

                    {showExplanation && (
                      <div className="p-4 bg-gray-800/50 rounded-lg space-y-3">
                        <h3 className="font-semibold text-white">Explanation:</h3>
                        <p className="text-gray-300">
                          {questions[currentQuestionIndex].explanation}
                        </p>
                      </div>
                    )}

                    {submitted && (
                      <button
                        onClick={handleNextQuestion}
                        className="w-full p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity"
                      >
                        {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Complete Quiz'}
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