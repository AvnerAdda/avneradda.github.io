import { Timestamp } from 'firebase/firestore';

export interface DailyScore {
  score: number;
  maxPossibleScore: number;
  completedAt: Timestamp;
}

export interface UserScore {
  userId: string;
  displayName: string;
  totalScore: number;
  gamesPlayed: number;
  averageScore: number;
  lastPlayed: Timestamp;
  dailyScores: {
    [date: string]: DailyScore;
  };
} 