import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db, isFirebasePermissionError } from './firebase';
import { getUserIP, generateIPHash } from './ipUtils';

export interface IPMetric {
  count: number;
  ips: string[];
  lastUpdated: Date;
}

export const trackIPBasedMetric = async (metricType: string): Promise<boolean> => {
  try {
    const userIP = await getUserIP();
    const ipHash = generateIPHash(userIP);
    
    const metricRef = doc(db, 'ip_metrics', metricType);
    const docSnap = await getDoc(metricRef);
    
    if (!docSnap.exists()) {
      await setDoc(metricRef, {
        count: 1,
        ips: [ipHash],
        lastUpdated: new Date()
      });
      return true;
    }
    
    const data = docSnap.data() as IPMetric;
    
    if (data.ips.includes(ipHash)) {
      return false;
    }
    
    await updateDoc(metricRef, {
      count: increment(1),
      ips: [...data.ips, ipHash],
      lastUpdated: new Date()
    });
    
    return true;
  } catch (error) {
    if (!isFirebasePermissionError(error)) {
      console.error('Error tracking IP-based metric:', error);
    }
    return false;
  }
};

export const getIPMetricCount = async (metricType: string): Promise<number> => {
  try {
    const metricRef = doc(db, 'ip_metrics', metricType);
    const docSnap = await getDoc(metricRef);
    
    if (!docSnap.exists()) {
      return 0;
    }
    
    return docSnap.data().count || 0;
  } catch (error) {
    if (!isFirebasePermissionError(error)) {
      console.error('Error getting IP metric count:', error);
    }
    return 0;
  }
};

export const hasIPInteracted = async (metricType: string): Promise<boolean> => {
  try {
    const userIP = await getUserIP();
    const ipHash = generateIPHash(userIP);
    
    const metricRef = doc(db, 'ip_metrics', metricType);
    const docSnap = await getDoc(metricRef);
    
    if (!docSnap.exists()) {
      return false;
    }
    
    const data = docSnap.data() as IPMetric;
    return data.ips.includes(ipHash);
  } catch (error) {
    if (!isFirebasePermissionError(error)) {
      console.error('Error checking IP interaction:', error);
    }
    return false;
  }
};
