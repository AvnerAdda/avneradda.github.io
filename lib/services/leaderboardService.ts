import { db } from '../firebase';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  orderBy, 
  limit as firebaseLimit, 
  getDocs,
  Timestamp,
  updateDoc
} from 'firebase/firestore';
import { UserScore, DailyScore } from '../types/leaderboard';

export class LeaderboardService {
  static formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  static async updateUserScore(
    userId: string,
    displayName: string,
    score: number,
    totalQuestions: number
  ): Promise<void> {
    const userScoreRef = doc(db, 'user_scores', userId);
    const today = this.formatDate(new Date());

    const userScoreDoc = await getDoc(userScoreRef);
    const currentData = userScoreDoc.data() as UserScore | undefined;

    const dailyScore: DailyScore = {
      score,
      maxPossibleScore: totalQuestions,
      completedAt: Timestamp.now(),
    };

    if (!currentData) {
      // New user
      const newUserScore: UserScore = {
        userId,
        displayName,
        totalScore: score,
        gamesPlayed: 1,
        averageScore: score,
        lastPlayed: Timestamp.now(),
        dailyScores: {
          [today]: dailyScore
        }
      };
      await setDoc(userScoreRef, newUserScore);
    } else {
      // Existing user
      const totalScore = currentData.totalScore + score;
      const gamesPlayed = currentData.gamesPlayed + 1;
      
      await updateDoc(userScoreRef, {
        totalScore,
        gamesPlayed,
        averageScore: totalScore / gamesPlayed,
        lastPlayed: Timestamp.now(),
        displayName, // Update in case it changed
        [`dailyScores.${today}`]: dailyScore
      });
    }
  }

  static async getTopPlayers(count: number = 10): Promise<UserScore[]> {
    const scoresRef = collection(db, 'user_scores');
    const q = query(scoresRef, orderBy('averageScore', 'desc'), firebaseLimit(count));
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as UserScore);
  }

  static async getDailyTopPlayers(date: Date, count: number = 10): Promise<UserScore[]> {
    const dateStr = this.formatDate(date);
    const scoresRef = collection(db, 'user_scores');
    const q = query(
      scoresRef,
      orderBy(`dailyScores.${dateStr}.score`, 'desc'),
      firebaseLimit(count)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as UserScore);
  }
} 