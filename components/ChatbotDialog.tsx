"use client";

import { useState, useEffect, useRef } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, onSnapshot, query, orderBy, getDocs, deleteDoc, where, updateDoc, increment } from 'firebase/firestore';
import Image from 'next/image';
import { ChatState, initialChatState, chatOptions, UserType, RecruiterInfo, UserUsage, RecruiterFilterCriteria } from '../lib/chatbot/chatState';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';
import { v4 as uuidv4 } from 'uuid';
import { Timestamp } from 'firebase/firestore';
import RecruiterFilter from './RecruiterFilter';

interface ChatMessage {
  prompt?: string;
  displayPrompt?: string;
  response?: string;
  timestamp: any;
  isOption?: boolean;
  sessionId: string;
}

interface ChatbotDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FileUploadProps {
  onUploadComplete: (url: string) => void;
  disabled?: boolean;
}

interface ChatOption {
  id: string;
  text: string;
  action: 'SET_RECRUITER' | 'SET_VISITOR';
}

interface VisitorContactInfo {
  name: string;
  email: string;
  message: string;
}

interface InitialFormData {
  email: string;
}

const INITIAL_OPTIONS: ChatOption[] = [
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
];

// Add this custom component for markdown messages
const MarkdownMessage = ({ content }: { content: string }) => {
  return (
    <MarkdownPreview 
      source={content}
      style={{
        backgroundColor: 'transparent',
        color: 'rgb(229 231 235)', // text-gray-200
        fontSize: '0.875rem', // text-sm
      }}
      wrapperElement={{
        "data-color-mode": "dark"
      }}
    />
  );
};

const FileUploadButton = ({ onUploadComplete, disabled }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a PDF or Word document');
      return;
    }

    setUploading(true);
    try {
      const storageRef = ref(storage, `job-descriptions/${Date.now()}-${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      onUploadComplete(downloadURL);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <label className={`px-2 py-1.5 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 
      transition-colors cursor-pointer ${disabled || uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
        disabled={disabled || uploading}
        className="hidden"
      />
      {uploading ? (
        <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
      ) : (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor" 
          className="w-5 h-5 text-gray-400"
        >
          <path d="M9.25 13.25a.75.75 0 001.5 0V4.636l2.955 3.129a.75.75 0 001.09-1.03l-4.25-4.5a.75.75 0 00-1.09 0l-4.25 4.5a.75.75 0 101.09 1.03L9.25 4.636v8.614z" />
          <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
        </svg>
      )}
    </label>
  );
};

const RecruiterForm = ({ onSubmit, disabled }: { onSubmit: (data: RecruiterInfo) => void, disabled?: boolean }) => {
  const [step, setStep] = useState<'personal' | 'job'>('personal');
  const [formData, setFormData] = useState<RecruiterInfo>({
    name: '',
    email: '',
    company: '',
    jobRole: '',
  });
  const [fileUrl, setFileUrl] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNextStep = () => {
    if (step === 'personal' && formData.name && formData.email) {
      setStep('job');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.match('application/pdf|application/msword|application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      alert('Please upload a PDF or Word document');
      return;
    }

    setUploading(true);
    try {
      const storageRef = ref(storage, `job-descriptions/${Date.now()}-${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setFileUrl(downloadURL);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, jobDescription: fileUrl || undefined });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {step === 'personal' ? (
        <div className="space-y-3">
          <h3 className="text-base font-medium text-gray-200">Personal Information</h3>
          <div className="space-y-2">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-transparent border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-200 
                placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
              required
              disabled={disabled}
            />
            <input
              type="email"
              name="email"
              placeholder="Professional Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-transparent border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-200 
                placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
              required
              disabled={disabled}
            />
          </div>
          <button
            type="button"
            onClick={handleNextStep}
            disabled={disabled || !formData.name || !formData.email}
            className="w-full px-4 py-1.5 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 
              transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <h3 className="text-base font-medium text-gray-200">Job Information</h3>
          <div className="space-y-2">
            <input
              type="text"
              name="company"
              placeholder="Company"
              value={formData.company}
              onChange={handleChange}
              className="w-full bg-transparent border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-200 
                placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
              required
              disabled={disabled}
            />
            <input
              type="text"
              name="jobRole"
              placeholder="Job Role"
              value={formData.jobRole}
              onChange={handleChange}
              className="w-full bg-transparent border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-200 
                placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
              required
              disabled={disabled}
            />
            
            <div className="flex items-center gap-2">
              <label className={`flex items-center gap-2 px-3 py-1.5 text-sm text-gray-400 
                border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-800/50 transition-colors
                ${disabled || uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  disabled={disabled || uploading}
                  className="hidden"
                />
                {uploading ? (
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                      <path d="M9.25 13.25a.75.75 0 001.5 0V4.636l2.955 3.129a.75.75 0 001.09-1.03l-4.25-4.5a.75.75 0 00-1.09 0l-4.25 4.5a.75.75 0 101.09 1.03L9.25 4.636v8.614z" />
                      <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                    </svg>
                    Upload Job Description (Optional)
                  </>
                )}
              </label>
              {fileUrl && (
                <span className="text-xs text-green-400">File uploaded ✓</span>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStep('personal')}
              className="flex-1 px-4 py-1.5 border border-gray-700 text-gray-400 rounded-lg 
                hover:bg-gray-800/50 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={disabled || uploading || !formData.company || !formData.jobRole}
              className="flex-1 px-4 py-1.5 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 
                transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </form>
  );
};

// Add this function at the top level
const createFirestoreQuery = (sessionId: string) => {
  // First try with the composite index
  try {
    return query(
      collection(db, 'chatbot_interactions'),
      where('sessionId', '==', sessionId),
      orderBy('timestamp', 'asc')
    );
  } catch (error) {
    // Fallback to simple query if index doesn't exist
    console.warn('Falling back to simple query - please create the required index');
    return query(
      collection(db, 'chatbot_interactions'),
      where('sessionId', '==', sessionId)
    );
  }
};

const VisitorTopics = ({ onSelect, disabled }: { 
  onSelect: (topic: string, prompt?: string) => void, 
  disabled?: boolean 
}) => {
  return (
    <div className="space-y-2 py-2">
      {chatOptions.visitor.topics.map((topic) => (
        <button
          key={topic.id}
          onClick={() => onSelect(topic.id, topic.prompt)}
          disabled={disabled}
          className="w-full text-left px-3 py-1.5 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 
            transition-colors text-sm text-gray-200 disabled:opacity-50"
        >
          {topic.text}
        </button>
      ))}
    </div>
  );
};

const ContactForm = ({ onSubmit, disabled }: { 
  onSubmit: (data: VisitorContactInfo) => void, 
  disabled?: boolean 
}) => {
  const [formData, setFormData] = useState<VisitorContactInfo>({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <input
        type="text"
        placeholder="Your Name"
        value={formData.name}
        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        className="w-full bg-transparent border-b border-gray-700 px-2 py-1.5 text-sm"
        required
        disabled={disabled}
      />
      <input
        type="email"
        placeholder="Your Email"
        value={formData.email}
        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
        className="w-full bg-transparent border-b border-gray-700 px-2 py-1.5 text-sm"
        required
        disabled={disabled}
      />
      <textarea
        placeholder="Your Message"
        value={formData.message}
        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
        className="w-full bg-transparent border border-gray-700 rounded-lg px-2 py-1.5 text-sm"
        rows={3}
        required
        disabled={disabled}
      />
      <button
        type="submit"
        disabled={disabled}
        className="w-full px-3 py-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
      >
        Send Message
      </button>
    </form>
  );
};

const InitialEmailForm = ({ onSubmit, disabled }: { 
  onSubmit: (data: InitialFormData) => void, 
  disabled?: boolean 
}) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <input
        type="email"
        placeholder="Your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full bg-transparent border-b border-gray-700 px-2 py-1.5 text-sm text-gray-200 
          placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
        required
        disabled={disabled}
      />
      <button
        type="submit"
        disabled={disabled || !email}
        className="w-full px-3 py-2 rounded-lg bg-blue-500/10 text-blue-400 
          hover:bg-blue-500/20 transition-colors disabled:opacity-50"
      >
        Continue
      </button>
    </form>
  );
};

// Add this validation function near the top of the file
const isValidQuestion = (text: string) => {
  return text.trim().endsWith('?');
};

export default function ChatbotDialog({ isOpen, onClose }: ChatbotDialogProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [chatState, setChatState] = useState<ChatState>(initialChatState);
  const [sessionId, setSessionId] = useState<string>('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Modify the session initialization
  useEffect(() => {
    const initializeSession = async () => {
      setIsClearing(true);
      try {
        // Generate new session ID when dialog opens
        const newSessionId = uuidv4();
        setSessionId(newSessionId);
        
        // Set initial state to INITIAL stage (not EMAIL_VERIFICATION)
        setChatState({
          ...initialChatState,
          stage: 'INITIAL'  // Changed from 'EMAIL_VERIFICATION'
        });
        
        // Add initial message with options
        setMessages([{
          response: "Hello! Please select an option:",
          timestamp: new Date(),
          isOption: true,
          sessionId: newSessionId
        }]);
        
      } finally {
        setIsClearing(false);
      }
    };

    if (isOpen) {
      initializeSession();
    }
  }, [isOpen]);

  // Modify the messages listener
  useEffect(() => {
    if (!sessionId) return;

    // Create queries for both collections
    const chatQuery = query(
      collection(db, 'chatbot_interactions'),
      where('sessionId', '==', sessionId),
      orderBy('timestamp', 'asc')
    );

    const generateQuery = query(
      collection(db, 'generate'),
      where('sessionId', '==', sessionId),
      orderBy('timestamp', 'asc')
    );

    // Listen to both collections
    const unsubscribeChatbot = onSnapshot(chatQuery, (chatSnapshot) => {
      const chatMessages = chatSnapshot.docs.map(doc => ({
        ...(doc.data() as ChatMessage),
        timestamp: doc.data().timestamp?.toDate()
      }));

      const unsubscribeGenerate = onSnapshot(generateQuery, (generateSnapshot) => {
        const generateMessages = generateSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            prompt: data.displayPrompt || data.prompt,
            response: data.response,
            timestamp: data.timestamp?.toDate(),
            sessionId: data.sessionId
          } as ChatMessage;
        });

        // Combine and sort all messages by timestamp
        const allMessages = [...chatMessages, ...generateMessages]
          .sort((a, b) => a.timestamp - b.timestamp);

        // Only show messages after email verification
        if (chatState.stage !== 'EMAIL_VERIFICATION') {
          setMessages(allMessages);
        }
        
        setIsLoading(false);
      });

      return () => {
        unsubscribeGenerate();
      };
    });

    return () => {
      unsubscribeChatbot();
    };
  }, [chatState.stage, sessionId]);

  const formatTimestamp = (timestamp: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(timestamp);
  };

  const handleOptionSelect = async (userType: UserType) => {
    if (userType === 'RECRUITER') {
      setChatState({
        userType,
        stage: 'RECRUITER_FILTER',
        questionCount: 0,
        maxQuestions: chatOptions.recruiter.maxQuestions,
        allowFileUpload: chatOptions.recruiter.allowFileUpload
      });
      
      await addDoc(collection(db, 'chatbot_interactions'), {
        response: chatOptions.recruiter.filterMessage,
        timestamp: new Date(),
        sessionId
      });
    } else {
      setChatState({
        userType,
        stage: 'EMAIL_VERIFICATION',
        questionCount: 0,
        maxQuestions: chatOptions.visitor.maxQuestions,
        allowFileUpload: chatOptions.visitor.allowFileUpload
      });
      
      await addDoc(collection(db, 'chatbot_interactions'), {
        response: "Before we continue, please provide your email:",
        timestamp: new Date(),
        sessionId
      });
    }
  };

  const handleTopicSelect = async (topicId: string, prompt?: string) => {
    if (topicId === 'contact') {
      setChatState(prev => ({
        ...prev,
        stage: 'CONTACT_FORM'
      }));
      
      await addDoc(collection(db, 'chatbot_interactions'), {
        response: "Please provide your contact information:",
        timestamp: new Date(),
        sessionId
      });
    } else {
      setChatState(prev => ({
        ...prev,
        stage: 'TYPING_ENABLED'
      }));

      if (prompt) {
        await addDoc(collection(db, 'chatbot_interactions'), {
          response: prompt,
          timestamp: new Date(),
          sessionId
        });
      }
    }
  };

  const handleRecruiterFormSubmit = async (data: RecruiterInfo) => {
    setIsLoading(true);
    try {
      // Create submission object without undefined values
      const submissionData = {
        name: data.name,
        email: data.email,
        company: data.company,
        jobRole: data.jobRole,
        timestamp: new Date(),
        status: 'pending',
        notes: '',
        sessionId,
        // Only include jobDescription if it exists
        ...(data.jobDescription ? { jobDescription: data.jobDescription } : {})
      };

      // Store recruiter form data
      await addDoc(collection(db, 'recruiter_submissions'), submissionData);

      // Only send analysis message if there's a job description
      if (data.jobDescription) {
        await addDoc(collection(db, 'generate'), {
          prompt: `I have a job opportunity as ${data.jobRole} at ${data.company}. Here's the job description: ${data.jobDescription}. 
                  Please analyze this job description and provide a structured assessment of Avner's fit for this role using the following format:
                  🎯 Role Overview:
                  - Brief summary of the position (1 short sentence)
                  - Top 3 reasons why Avner would be a good fit for this role
                  - Top 3 reasons why Avner would not be a good fit for this role
                  Keep the analysis honest, specific, and concise`,
          displayPrompt: `I have a job opportunity as ${data.jobRole} at ${data.company}. Please analyze the job description and explain why Avner would be a good fit for this role.`,
          timestamp: new Date(),
          sessionId
        });
      }
      
      // Add follow-up message
      await addDoc(collection(db, 'chatbot_interactions'), {
        response: `Thank you ${data.name} for sharing this opportunity! ${
          data.jobDescription 
            ? "Wait a minute, I'll analyze the role and provide my assessment above."
            : ""
        } Would you like to schedule a meeting to discuss this opportunity in more detail?`,
        timestamp: new Date(),
        sessionId
      });
      
      setChatState(prev => ({
        ...prev,
        stage: 'MEETING_SETUP',
        recruiterInfo: data
      }));
    } catch (error) {
      console.error('Error submitting form:', error);
      await addDoc(collection(db, 'chatbot_interactions'), {
        response: "I apologize, but I encountered an error while processing your request. Please try again.",
        timestamp: new Date(),
        sessionId
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactSubmit = async (data: VisitorContactInfo) => {
    setIsLoading(true);
    try {
      await addDoc(collection(db, 'contact_requests'), {
        ...data,
        timestamp: new Date(),
        sessionId
      });

      await addDoc(collection(db, 'chatbot_interactions'), {
        response: `Thank you ${data.name}! I'll make sure to get back to you soon at ${data.email}.`,
        timestamp: new Date(),
        sessionId
      });

      setChatState(prev => ({
        ...prev,
        stage: 'CLOSED'
      }));
    } catch (error) {
      console.error('Error:', error);
      await addDoc(collection(db, 'chatbot_interactions'), {
        response: "Sorry, there was an error submitting your contact information. Please try again.",
        timestamp: new Date(),
        sessionId
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (fileUrl: string) => {
    setIsLoading(true);
    try {
      // Add follow-up message
      await addDoc(collection(db, 'chatbot_interactions'), {
        response: "I've analyzed the job description. Would you like to schedule a meeting to discuss this opportunity further?",
        timestamp: new Date(),
        sessionId
      });
      
      setChatState(prev => ({
        ...prev,
        stage: 'MEETING_SETUP',
        recruiterInfo: {
          ...prev.recruiterInfo!,
          jobDescription: fileUrl
        }
      }));
    } catch (error) {
      console.error('Error processing file:', error);
      await addDoc(collection(db, 'chatbot_interactions'), {
        response: "Sorry, I couldn't process the file. Please try uploading it again.",
        timestamp: new Date(),
        sessionId
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkUserUsage = async (email: string): Promise<boolean> => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const usageRef = collection(db, 'user_usage');
    const q = query(usageRef, where('email', '==', email));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      // First time user
      await addDoc(usageRef, {
        email,
        requestCount: 1,
        lastReset: today,  // Firestore will automatically convert to Timestamp
        createdAt: new Date()
      });
      return true;
    }

    const usage = snapshot.docs[0];
    const userData = usage.data() as UserUsage;
    // Fix: Handle Firestore Timestamp properly
    const lastReset = (userData.lastReset instanceof Timestamp) 
      ? userData.lastReset.toDate() 
      : new Date(userData.lastReset);

    if (lastReset < today) {
      // Reset counter for new day
      await updateDoc(usage.ref, {
        requestCount: 1,
        lastReset: today
      });
      return true;
    }

    if (userData.requestCount >= 3) {
      return false;
    }

    // Increment counter
    await updateDoc(usage.ref, {
      requestCount: increment(1)
    });
    return true;
  };

  const handleEmailSubmit = async (data: InitialFormData) => {
    setIsLoading(true);
    try {
      const canProceed = await checkUserUsage(data.email);
      if (!canProceed) {
        await addDoc(collection(db, 'chatbot_interactions'), {
          response: "I apologize, but you've reached the maximum number of chat sessions for today. Please try again tomorrow.",
          timestamp: new Date(),
          sessionId
        });
        setChatState(prev => ({ ...prev, stage: 'CLOSED' }));
        return;
      }

      if (chatState.userType === 'VISITOR') {
        setChatState(prev => ({
          ...prev,
          stage: 'VISITOR_TOPICS',
          userEmail: data.email
        }));
        
        await addDoc(collection(db, 'chatbot_interactions'), {
          response: "Great! How can I help you today?",
          timestamp: new Date(),
          sessionId
        });
      }
    } catch (error) {
      console.error('Error:', error);
      await addDoc(collection(db, 'chatbot_interactions'), {
        response: "Sorry, there was an error. Please try again.",
        timestamp: new Date(),
        sessionId
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterComplete = async (criteria: RecruiterFilterCriteria) => {
    const allCriteriaMet = 
      criteria.hasCompellingOffer || 
      (criteria.isIsraelBased && 
       criteria.isSeniorRole && 
       criteria.isAIFocused && 
       criteria.hasCloudTech);
    
    if (allCriteriaMet) {
      setChatState(prev => ({
        ...prev,
        stage: 'RECRUITER_FORM',
        recruiterFilterCriteria: criteria
      }));
      
      await addDoc(collection(db, 'chatbot_interactions'), {
        response: "Great! Please provide your information to proceed:",
        timestamp: new Date(),
        sessionId
      });
    } else {
      await addDoc(collection(db, 'chatbot_interactions'), {
        response: "I appreciate your interest, but it seems this opportunity might not be the best fit. Feel free to reach out when you have positions that better align with my criteria.",
        timestamp: new Date(),
        sessionId
      });
      
      setChatState(prev => ({
        ...prev,
        stage: 'CLOSED'
      }));
    }
  };

  const canType = chatState.stage === 'TYPING_ENABLED';
  const showOptions = chatState.stage === 'INITIAL';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputRef.current || isLoading) return;

    const userInput = inputRef.current.value.trim();
    
    if (!isValidQuestion(userInput)) {
      setError('Please end your question with a question mark (?)');
      return;
    }
    
    setError('');
    setIsLoading(true);
    
    try {
      // Add the user's question to generate collection for LLM processing
      await addDoc(collection(db, 'generate'), {
        prompt: userInput,
        displayPrompt: userInput,
        timestamp: new Date(),
        sessionId
      });

      // Add the follow-up message to chatbot_interactions
      await addDoc(collection(db, 'chatbot_interactions'), {
        response: "Wait for me to answer... In any case, would you like to get in touch with Avner directly?",
        timestamp: new Date(),
        sessionId
      });

      setChatState(prev => ({ 
        ...prev, 
        stage: 'CONTACT_FORM',
        questionCount: prev.questionCount + 1 
      }));

    } catch (error) {
      console.error('Error:', error);
      await addDoc(collection(db, 'chatbot_interactions'), {
        response: "Sorry, there was an error processing your question. Please try again.",
        timestamp: new Date(),
        sessionId
      });
    } finally {
      setIsLoading(false);
      inputRef.current.value = '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] transition-all duration-300">
      <div 
        className="bg-gradient-to-b from-gray-900/95 to-gray-800/95 backdrop-blur-md rounded-2xl 
          w-full max-w-2xl shadow-2xl relative overflow-hidden border border-gray-700/50
          transform transition-all duration-300 flex flex-col h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-30">
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400/80 rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
                <div className="w-3 h-3 bg-blue-400/80 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="w-3 h-3 bg-blue-400/80 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
              </div>
              <span className="text-sm text-blue-400/80 font-medium">Processing...</span>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="relative h-[72px] flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm" />
          <div className="relative p-4 border-b border-gray-700/50 h-full">
            <div className="flex items-center gap-4 h-full">
              <div className="relative h-10 w-10 group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
                <Image
                  src="/images/profile-picture.jpg"
                  alt="AI Assistant"
                  width={40}
                  height={40}
                  className="rounded-full object-cover relative z-10 border-2 border-gray-700/50"
                />
              </div>
              <div>
                <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  AI Assistant
                </h2>
                <p className="text-sm text-gray-400">Ask me anything about Avner</p>
              </div>
              <button
                onClick={onClose}
                className="ml-auto p-2 rounded-lg hover:bg-gray-700/50 transition-colors group"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400 group-hover:text-gray-200 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Chat messages - Flexible height */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth">
          {isClearing ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          ) : (
            <>
              {/* Initial Options */}
              {chatState.stage === 'INITIAL' && (
                <div className="flex items-start gap-3 mb-6">
                  <div className="flex-shrink-0 relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
                    <Image
                      src="/images/profile-picture.jpg"
                      alt="AI Assistant"
                      width={36}
                      height={36}
                      className="rounded-full object-cover relative z-10 border-2 border-gray-700/50"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 rounded-2xl p-4 backdrop-blur-sm border border-gray-700/50">
                      <p className="text-gray-200 mb-4">Hello! Please select an option:</p>
                      <div className="space-y-2">
                        {INITIAL_OPTIONS.map((option) => (
                          <button
                            key={option.id}
                            onClick={() => handleOptionSelect(option.action === 'SET_RECRUITER' ? 'RECRUITER' : 'VISITOR')}
                            disabled={isLoading}
                            className="w-full text-left px-4 py-3 rounded-xl bg-gradient-to-r from-gray-700/50 to-gray-600/50 
                              hover:from-blue-600/20 hover:to-purple-600/20 transition-all duration-300
                              text-sm text-gray-200 relative z-20 disabled:opacity-50 disabled:cursor-not-allowed
                              border border-gray-600/30 hover:border-blue-500/30 group"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-lg group-hover:scale-110 transition-transform duration-300">
                                {option.id === 'recruiter' ? '💼' : '👋'}
                              </span>
                              {option.text}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Regular Messages */}
              {messages.map((message, index) => (
                <div key={index} className="relative z-10">
                  {message.prompt && !message.isOption && (
                    <div className="flex flex-col items-end gap-2 mb-6">
                      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl px-4 py-3 max-w-[80%]
                        backdrop-blur-sm border border-blue-500/30">
                        <MarkdownMessage content={message.displayPrompt || message.prompt} />
                      </div>
                      {message.timestamp && (
                        <span className="text-xs text-gray-500 mr-1">
                          {formatTimestamp(message.timestamp)}
                        </span>
                      )}
                    </div>
                  )}
                  {message.response && !message.isOption && (
                    <div className="flex items-start gap-3 mb-6">
                      <div className="flex-shrink-0 relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
                        <Image
                          src="/images/profile-picture.jpg"
                          alt="AI Assistant"
                          width={36}
                          height={36}
                          className="rounded-full object-cover relative z-10 border-2 border-gray-700/50"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="bg-gradient-to-r from-gray-800/80 to-gray-700/80 rounded-2xl p-4 backdrop-blur-sm 
                          border border-gray-700/50 max-w-[80%]">
                          <MarkdownMessage content={message.response} />
                        </div>
                        {message.timestamp && (
                          <span className="text-xs text-gray-500 ml-1 mt-1 block">
                            {formatTimestamp(message.timestamp)}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Forms Section - Fixed height */}
        <div className="border-t border-gray-700/50 bg-gradient-to-b from-gray-800/50 to-gray-900/50 backdrop-blur-sm flex-shrink-0">
          {chatState.stage === 'RECRUITER_FILTER' && (
            <div className="h-[280px] overflow-y-auto">
              <RecruiterFilter
                onComplete={handleFilterComplete}
                disabled={isLoading}
              />
            </div>
          )}

          {chatState.stage === 'RECRUITER_FORM' && (
            <div className="h-[280px] overflow-y-auto p-6">
              <RecruiterForm onSubmit={handleRecruiterFormSubmit} disabled={isLoading} />
            </div>
          )}

          {chatState.stage === 'MEETING_SETUP' && (
            <div className="h-[72px] p-6">
              <button
                onClick={async () => {
                  try {
                    // Create meeting request
                    await addDoc(collection(db, 'meeting_requests'), {
                      sessionId,
                      timestamp: new Date(),
                      status: 'pending'
                    });
                    
                    // Add response message
                    await addDoc(collection(db, 'chatbot_interactions'), {
                      response: "I'll have Avner review your request and get back to you soon with available meeting times. Thank you for your interest!",
                      timestamp: new Date(),
                      sessionId
                    });
                    
                    setChatState(prev => ({ ...prev, stage: 'CLOSED' }));
                  } catch (error) {
                    console.error('Error scheduling meeting:', error);
                    await addDoc(collection(db, 'chatbot_interactions'), {
                      response: "I apologize, but I encountered an error while processing your request. Please try again.",
                      timestamp: new Date(),
                      sessionId
                    });
                  }
                }}
                className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 
                  hover:from-blue-600/30 hover:to-purple-600/30 text-blue-400 font-medium
                  transition-all duration-300 border border-blue-500/30 hover:border-blue-500/50"
              >
                Schedule a Meeting
              </button>
            </div>
          )}

          {chatState.stage === 'VISITOR_TOPICS' && (
            <div className="h-[180px] p-4">
              <VisitorTopics 
                onSelect={handleTopicSelect}
                disabled={isLoading}
              />
              {chatState.questionCount > 0 && (
                <div className="text-xs text-gray-400 mt-2 px-1">
                  {`Questions remaining: ${chatState.maxQuestions - chatState.questionCount}`}
                </div>
              )}
            </div>
          )}

          {chatState.stage === 'CONTACT_FORM' && (
            <div className="h-[280px] overflow-y-auto">
              <ContactForm 
                onSubmit={handleContactSubmit}
                disabled={isLoading}
              />
            </div>
          )}

          {chatState.stage === 'EMAIL_VERIFICATION' && (
            <div className="h-[120px]">
              <InitialEmailForm 
                onSubmit={handleEmailSubmit}
                disabled={isLoading}
              />
            </div>
          )}

          {chatState.stage === 'TYPING_ENABLED' && (
            <div className="h-[88px] flex-shrink-0">
              <form onSubmit={handleSubmit} className="p-4 space-y-2 h-full">
                <div className="relative">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder={
                      chatState.userType === 'VISITOR' 
                        ? "Ask your question (end with ?)" 
                        : "Type your message..."
                    }
                    className={`w-full bg-transparent border ${
                      error ? 'border-red-500/50' : 'border-gray-700'
                    } rounded-lg px-4 py-2 pr-24 text-sm text-gray-200 
                      placeholder-gray-500 focus:outline-none focus:border-blue-500/50`}
                    disabled={!canType || isLoading}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {chatState.allowFileUpload && (
                      <FileUploadButton
                        onUploadComplete={handleFileUpload}
                        disabled={isLoading}
                      />
                    )}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 
                        hover:bg-blue-500/20 transition-colors disabled:opacity-50 
                        disabled:cursor-not-allowed"
                    >
                      Send
                    </button>
                  </div>
                </div>
                {error && (
                  <p className="text-xs text-red-400 px-1">
                    {error}
                  </p>
                )}
                {chatState.userType === 'VISITOR' && chatState.questionCount > 0 && (
                  <div className="text-xs text-gray-400 px-1">
                    {`Questions remaining: ${chatState.maxQuestions - chatState.questionCount}`}
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 