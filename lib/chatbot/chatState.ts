import { Timestamp } from 'firebase/firestore';

export type UserType = 'RECRUITER' | 'VISITOR' | null;
export type ChatStage = 
  | 'INITIAL' 
  | 'RECRUITER_FORM' 
  | 'TYPING_ENABLED' 
  | 'MEETING_SETUP' 
  | 'CLOSED'
  | 'VISITOR_TOPICS'
  | 'CONTACT_FORM'
  | 'EMAIL_VERIFICATION';

export interface RecruiterInfo {
  name: string;
  email: string;
  company: string;
  jobRole: string;
  jobDescription?: string;
}

export interface ChatState {
  userType: UserType;
  stage: ChatStage;
  questionCount: number;
  maxQuestions: number;
  allowFileUpload: boolean;
  recruiterInfo?: RecruiterInfo;
  userEmail?: string;
}

export interface UserUsage {
  email: string;
  requestCount: number;
  lastReset: Date | Timestamp;
  createdAt: Date | Timestamp;
}

export const chatOptions = {
  recruiter: {
    maxQuestions: 5,
    allowFileUpload: true
  },
  visitor: {
    maxQuestions: 2,
    allowFileUpload: false,
    topics: [
      {
        id: 'experience',
        text: "Tell me about Avner's experience",
        prompt: "Please provide an overview of Avner's professional experience and key achievements, make it short (max 10 sentences)."
      },
      {
        id: 'skills',
        text: "What are Avner's technical skills?",
        prompt: "What are Avner's main technical skills and areas of expertise? make it short (max 10 sentences)."
      },
      {
        id: 'projects',
        text: "Show me some notable projects",
        prompt: "Can you highlight some of Avner's most notable projects and their impact? make it short (max 10 sentences)."
      },
      {
        id: 'contact',
        text: "I'd like to get in touch",
        action: 'SHOW_CONTACT'
      }
    ]
  },
  initial: [
    {
      id: 'recruiter',
      text: "I'm a recruiter with a job opportunity",
      action: 'SET_RECRUITER'
    },
    {
      id: 'visitor',
      text: "I'd like to learn more about Avner",
      action: 'SET_VISITOR'
    }
  ]
};

export const initialChatState: ChatState = {
  userType: null,
  stage: 'INITIAL',
  questionCount: 0,
  maxQuestions: chatOptions.visitor.maxQuestions,
  allowFileUpload: false,
  userEmail: undefined
}; 