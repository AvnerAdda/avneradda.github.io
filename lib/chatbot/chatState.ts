import { Timestamp } from 'firebase/firestore';

export type UserType = 'RECRUITER' | 'VISITOR' | null;
export type ChatStage = 
  | 'INITIAL' 
  | 'RECRUITER_FILTER'
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

export interface RecruiterFilterCriteria {
  isIsraelBased: boolean;
  isSeniorRole: boolean;
  isAIFocused: boolean;
  hasCloudTech: boolean;
  hasCompellingOffer: boolean;
}

export interface ChatState {
  userType: UserType;
  stage: ChatStage;
  questionCount: number;
  maxQuestions: number;
  allowFileUpload: boolean;
  recruiterInfo?: RecruiterInfo;
  userEmail?: string;
  recruiterFilterCriteria?: RecruiterFilterCriteria;
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
    allowFileUpload: true,
    filterMessage: `Thank you for your interest in connecting! To ensure we both make the best use of our time, please confirm that your opportunity meets the following criteria:

### Essential Requirements
* Location: Israel-based position (Tel Aviv area big plus)
* Role: (Senior) Data Scientist/ML Engineer position
* Domain: Preferably FinTech, or Enterprise AI solutions

### Technical Focus
* Core focus on ML/AI/Generative AI implementation
* Cloud platforms (AWS/GCP)
* Big Data tools and Python
* Exposure to Large Language Models is a plus

### What I Value
* Transparent communication about the role and company
* Clear growth and learning opportunities
* Collaborative team environment
* Meaningful technical challenges

Please confirm these criteria before proceeding:`,
    filterCriteria: [
      { id: 'isIsraelBased', label: 'Position is based in Israel (Tel Aviv area)' },
      { id: 'isSeniorRole', label: '(Senior) Data Scientist/ML Engineer role' },
      { id: 'isAIFocused', label: 'Core focus on ML/AI implementation' },
      { id: 'hasCloudTech', label: 'Includes cloud platforms (AWS/GCP)' },
      { 
        id: 'hasCompellingOffer', 
        label: 'I do not meet all criteria but have a compelling opportunity',
        overrideOthers: true
      }
    ]
  },
  visitor: {
    maxQuestions: 1,
    allowFileUpload: false,
    topics: [
      {
        id: 'open_question',
        text: "Ask me anything about Avner",
        prompt: "Feel free to ask any question about Avner's experience, skills, or projects."
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