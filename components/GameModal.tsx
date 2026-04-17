'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../lib/context/AuthContext';
import { db } from '../lib/firebase';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import AiCard from './AiCard';
import { AnalyticsService } from '../lib/analytics';
import LoginModal from './LoginModal';
import { LeaderboardService } from '../lib/services/leaderboardService';
import Leaderboard from './Leaderboard';

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

type GameView = 'quiz' | 'leaderboard';

export default function GameModal({ isOpen, onClose }: GameModalProps) {
  const { user } = useAuth();
  const [view, setView] = useState<GameView>('quiz');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [updatingLeaderboard, setUpdatingLeaderboard] = useState(false);
  const [hasCompletedToday, setHasCompletedToday] = useState(false);
  const [todayScore, setTodayScore] = useState<{score: number, maxScore: number} | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const checkTodayCompletion = useCallback(async () => {
    if (!user) return;
    
    try {
      const userScoreRef = collection(db, 'user_scores');
      const userScoreDoc = await getDocs(query(userScoreRef, where('userId', '==', user.uid)));
      
      if (!userScoreDoc.empty) {
        const userData = userScoreDoc.docs[0].data();
        const today = LeaderboardService.formatDate(new Date());
        const todayScore = userData.dailyScores?.[today];
        
        if (todayScore) {
          setHasCompletedToday(true);
          setTodayScore({
            score: todayScore.score,
            maxScore: todayScore.maxPossibleScore
          });
        }
      }
    } catch (error) {
      console.error('Error checking completion status:', error);
    }
  }, [user]);

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      await checkTodayCompletion();
      setLastRefresh(new Date());
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const fetchDailyQuestions = async () => {
      if (!user) return;

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

    if (isOpen && user) {
      fetchDailyQuestions();
      checkTodayCompletion();
    }
  }, [isOpen, user, checkTodayCompletion]);

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

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setSubmitted(false);
    } else {
      setGameCompleted(true);
      // Update leaderboard when game is completed
      if (user) {
        setUpdatingLeaderboard(true);
        try {
          await LeaderboardService.updateUserScore(
            user.uid,
            user.displayName || 'Anonymous',
            score,
            questions.length
          );
        } catch (error) {
          console.error('Error updating leaderboard:', error);
        } finally {
          setUpdatingLeaderboard(false);
        }
      }
      AnalyticsService.trackGameAction('complete_game', { finalScore: score });
    }
  };

  if (!isOpen) return null;

  if (!user) {
    return <LoginModal isOpen={true} onClose={onClose} />;
  }

  const renderQuizContent = () => {
    if (hasCompletedToday) {
      return (
        <div className="text-center space-y-6 py-8">
          <div className="relative">
            <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-white">
                {Math.round((todayScore?.score || 0) / (todayScore?.maxScore || 1) * 100)}%
              </span>
            </div>
            <button
              onClick={handleRefresh}
              className="absolute -right-2 -top-2 p-2 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
              disabled={isRefreshing}
            >
              <svg 
                className={`w-4 h-4 text-gray-400 ${isRefreshing ? 'animate-spin' : 'hover:text-white'}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">You&apos;ve completed today&apos;s quiz!</h2>
            <p className="text-gray-400">
              Today&apos;s score: {todayScore?.score || 0}/{todayScore?.maxScore || 0}
            </p>
            <p className="text-sm text-gray-400">
              Last checked: {lastRefresh.toLocaleTimeString()}
            </p>
          </div>
          <div className="space-y-3">
            <p className="text-gray-400">
              Come back tomorrow for new questions!
            </p>
            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setView('leaderboard')}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity"
              >
                View Leaderboard
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gray-800 rounded-lg text-gray-400 font-semibold hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-500">
            Daily AI Quiz
          </h1>
          <p className="text-gray-400">
            Test your knowledge with daily AI/ML questions!
          </p>
          <div className="h-1 w-32 mx-auto bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full" />
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
            <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full flex items-center justify-center">
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
            {updatingLeaderboard && (
              <div className="text-sm text-blue-400">
                Updating leaderboard...
              </div>
            )}
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity"
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
              <div className={`p-4 transition-opacity duration-200 ${submitted ? 'opacity-30' : 'opacity-100'}`}>
                <h2 className="text-xl text-white font-semibold">
                  {questions[currentQuestionIndex].question}
                </h2>
                <span className="inline-block mt-2 px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300">
                  {questions[currentQuestionIndex].category}
                </span>
              </div>

              <div className={`grid gap-3 transition-opacity duration-200 ${submitted ? 'opacity-30' : 'opacity-100'}`}>
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
                  className="w-full p-4 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  Submit Answer
                </button>
              )}

              {showExplanation && (
                <div className="p-4 bg-gray-800/50 rounded-lg space-y-3 transform transition-all duration-300 scale-100 opacity-100">
                  <h3 className="font-semibold text-white">Explanation:</h3>
                  <p className="text-gray-300">
                    {questions[currentQuestionIndex].explanation}
                  </p>
                </div>
              )}

              {submitted && (
                <button
                  onClick={handleNextQuestion}
                  className="w-full p-4 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Complete Quiz'}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="min-h-screen px-4 text-center">
        <div className="fixed inset-0" onClick={onClose} />
        
        <div className="inline-block w-full max-w-2xl my-8 text-left align-middle transition-all transform">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 text-gray-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex space-x-2 mb-4 justify-center">
            <button
              onClick={() => setView('quiz')}
              className={`px-6 py-2 rounded-lg transition-all duration-200 ${
                view === 'quiz'
                  ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              Quiz
            </button>
            <button
              onClick={() => setView('leaderboard')}
              className={`px-6 py-2 rounded-lg transition-all duration-200 ${
                view === 'leaderboard'
                  ? 'bg-gradient-to-r from-blue-500 to-emerald-500 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              Leaderboard
            </button>
          </div>

          <div className="transition-all duration-200">
            {view === 'leaderboard' ? (
              <Leaderboard />
            ) : (
              <AiCard>
                {renderQuizContent()}
              </AiCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 