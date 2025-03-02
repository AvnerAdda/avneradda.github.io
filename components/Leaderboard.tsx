'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../lib/context/AuthContext';
import { LeaderboardService } from '../lib/services/leaderboardService';
import { UserScore } from '../lib/types/leaderboard';
import AiCard from './AiCard';

type LeaderboardTab = 'daily' | 'allTime';

export default function Leaderboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<LeaderboardTab>('daily');
  const [dailyLeaders, setDailyLeaders] = useState<UserScore[]>([]);
  const [allTimeLeaders, setAllTimeLeaders] = useState<UserScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const [daily, allTime] = await Promise.all([
          LeaderboardService.getDailyTopPlayers(new Date()),
          LeaderboardService.getTopPlayers()
        ]);
        setDailyLeaders(daily);
        setAllTimeLeaders(allTime);
      } catch (err) {
        setError('Failed to load leaderboard data');
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const renderLeaderboardRow = (player: UserScore, index: number) => {
    const isCurrentUser = user && player.userId === user.uid;
    return (
      <div
        key={player.userId}
        className={`flex items-center p-4 ${
          index % 2 === 0 ? 'bg-gray-800/50' : 'bg-gray-800/30'
        } ${isCurrentUser ? 'border-l-4 border-blue-500' : ''}`}
      >
        <div className="flex-none w-12 text-2xl font-bold text-gray-400">
          #{index + 1}
        </div>
        <div className="flex-grow">
          <div className="font-semibold text-white">
            {player.displayName}
            {isCurrentUser && (
              <span className="ml-2 text-sm text-blue-400">(You)</span>
            )}
          </div>
          <div className="text-sm text-gray-400">
            Games: {player.gamesPlayed}
          </div>
        </div>
        <div className="flex-none text-right">
          <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            {activeTab === 'daily' 
              ? `${player.dailyScores[LeaderboardService.formatDate(new Date())]?.score || 0}/${
                  player.dailyScores[LeaderboardService.formatDate(new Date())]?.maxPossibleScore || 0
                }`
              : `${Math.round(player.averageScore)}%`
            }
          </div>
          <div className="text-sm text-gray-400">
            {activeTab === 'daily' ? 'Today\'s Score' : 'Average Score'}
          </div>
        </div>
      </div>
    );
  };

  return (
    <AiCard>
      <div className="p-6 space-y-6">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Leaderboard
          </h2>
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
        </div>

        <div className="flex space-x-2 p-1 bg-gray-800 rounded-lg">
          <button
            onClick={() => setActiveTab('daily')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              activeTab === 'daily'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setActiveTab('allTime')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              activeTab === 'allTime'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            All Time
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading leaderboard...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-400">
            {error}
          </div>
        ) : (activeTab === 'daily' ? dailyLeaders : allTimeLeaders).length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No scores recorded yet
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {(activeTab === 'daily' ? dailyLeaders : allTimeLeaders).map(
              (player, index) => renderLeaderboardRow(player, index)
            )}
          </div>
        )}
      </div>
    </AiCard>
  );
} 