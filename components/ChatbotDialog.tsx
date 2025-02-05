"use client";

import { useState, useEffect, useRef } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, onSnapshot, query, orderBy, getDocs, deleteDoc, where, updateDoc, increment } from 'firebase/firestore';
import Image from 'next/image';
import { ChatState, initialChatState, chatOptions, UserType, RecruiterInfo, UserUsage } from '../lib/chatbot/chatState';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';
import { v4 as uuidv4 } from 'uuid';
import { Timestamp } from 'firebase/firestore';

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
  const [formData, setFormData] = useState<RecruiterInfo>({
    name: '',
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
    if (!fileUrl) {
      alert('Please upload a job description file');
      return;
    }
    onSubmit({ ...formData, jobDescription: fileUrl });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full bg-transparent border-b border-gray-700 px-2 py-1.5 text-sm text-gray-200 
            placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
          required
          disabled={disabled}
        />
        <input
          type="text"
          name="company"
          placeholder="Company"
          value={formData.company}
          onChange={handleChange}
          className="w-full bg-transparent border-b border-gray-700 px-2 py-1.5 text-sm text-gray-200 
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
          className="w-full bg-transparent border-b border-gray-700 px-2 py-1.5 text-sm text-gray-200 
            placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
          required
          disabled={disabled}
        />
        
        <div className="flex items-center gap-2 pt-2">
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
                Upload Job Description
              </>
            )}
          </label>
          {fileUrl && (
            <span className="text-xs text-green-400">File uploaded ✓</span>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={disabled || uploading || !fileUrl || !formData.name || !formData.company || !formData.jobRole}
        className="w-full px-3 py-2 text-sm text-blue-400 border border-blue-500/20 rounded-lg 
          hover:bg-blue-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue
      </button>
    </form>
  );
};

// Add this function at the top level
const createFirestoreQuery = (sessionId: string) => {
  // First try with the composite index
  try {
    return query(
      collection(db, 'generate'),
      where('sessionId', '==', sessionId),
      orderBy('timestamp', 'asc')
    );
  } catch (error) {
    // Fallback to simple query if index doesn't exist
    console.warn('Falling back to simple query - please create the required index');
    return query(
      collection(db, 'generate'),
      where('sessionId', '==', sessionId)
    );
  }
};

const VisitorTopics = ({ onSelect, disabled }: { 
  onSelect: (topic: string, prompt?: string) => void, 
  disabled?: boolean 
}) => {
  return (
    <div className="space-y-2 p-4">
      {chatOptions.visitor.topics.map((topic) => (
        <button
          key={topic.id}
          onClick={() => onSelect(topic.id, topic.prompt)}
          disabled={disabled}
          className="w-full text-left px-3 py-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 
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

export default function ChatbotDialog({ isOpen, onClose }: ChatbotDialogProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [chatState, setChatState] = useState<ChatState>(initialChatState);
  const [sessionId, setSessionId] = useState<string>('');

  // Modify the session initialization
  useEffect(() => {
    const initializeSession = async () => {
      setIsClearing(true);
      try {
        // Generate new session ID when dialog opens
        const newSessionId = uuidv4();
        setSessionId(newSessionId);
        
        // Set initial state with EMAIL_VERIFICATION stage
        setChatState({
          ...initialChatState,
          stage: 'EMAIL_VERIFICATION'  // Make sure we start with email verification
        });
        
        // Don't show initial message until email is verified
        setMessages([]);
        
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

    const q = query(
      collection(db, 'generate'),
      where('sessionId', '==', sessionId),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const newMessages = snapshot.docs
          .map(doc => ({
            ...(doc.data() as ChatMessage),
            timestamp: doc.data().timestamp?.toDate()
          }))
          .sort((a, b) => a.timestamp - b.timestamp);
        
        // Only show messages after email verification
        if (chatState.stage !== 'EMAIL_VERIFICATION') {
          setMessages(newMessages);
        }
        
        setIsLoading(false);
      },
      (error) => {
        console.error('Error in snapshot listener:', error);
        // Fallback to simpler query if index is building
        if (error.code === 'failed-precondition') {
          const fallbackQuery = query(
            collection(db, 'generate'),
            where('sessionId', '==', sessionId)
          );
          
          onSnapshot(fallbackQuery, (snapshot) => {
            const newMessages = snapshot.docs
              .map(doc => ({
                ...(doc.data() as ChatMessage),
                timestamp: doc.data().timestamp?.toDate()
              }))
              .sort((a, b) => a.timestamp - b.timestamp);
            
            if (chatState.stage === 'INITIAL') {
              setMessages([
                {
                  response: "Hello! Please select an option:",
                  timestamp: new Date(),
                  isOption: true,
                  sessionId
                },
                ...newMessages
              ]);
            } else {
              setMessages(newMessages);
            }
            
            setIsLoading(false);
          });
        }
      }
    );

    return () => unsubscribe();
  }, [chatState.stage, sessionId]);

  const formatTimestamp = (timestamp: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(timestamp);
  };

  const handleOptionSelect = async (userType: UserType) => {
    setIsLoading(true);
    
    if (userType === 'RECRUITER') {
      setChatState({
        userType,
        stage: 'RECRUITER_FORM',
        questionCount: 0,
        maxQuestions: chatOptions.recruiter.maxQuestions,
        allowFileUpload: chatOptions.recruiter.allowFileUpload
      });
      
      // Add a message to show the form is ready
      await addDoc(collection(db, 'generate'), {
        response: "Please fill out the following information:",
        timestamp: new Date(),
        sessionId
      });
      
      setIsLoading(false);
    } else {
      setChatState({
        userType,
        stage: 'VISITOR_TOPICS',
        questionCount: 0,
        maxQuestions: chatOptions.visitor.maxQuestions,
        allowFileUpload: chatOptions.visitor.allowFileUpload
      });
      
      await addDoc(collection(db, 'generate'), {
        response: "Great! What would you like to know about Avner?",
        timestamp: new Date(),
        sessionId
      });
      
      setIsLoading(false);
    }
  };

  const handleTopicSelect = async (topicId: string, prompt?: string) => {
    if (topicId === 'contact') {
      setChatState(prev => ({ ...prev, stage: 'CONTACT_FORM' }));
      return;
    }

    setIsLoading(true);
    try {
      // Add the user's selection as a message
      await addDoc(collection(db, 'generate'), {
        prompt: prompt,
        displayPrompt: chatOptions.visitor.topics.find(t => t.id === topicId)?.text,
        timestamp: new Date(),
        sessionId
      });
      
      // After response, show topics again instead of enabling typing
      setChatState(prev => ({
        ...prev,
        stage: 'VISITOR_TOPICS',
        questionCount: prev.questionCount + 1
      }));

      // If max questions reached, add a final message
      if (chatState.questionCount + 1 >= chatState.maxQuestions) {
        await addDoc(collection(db, 'generate'), {
          response: "I hope I've been helpful! Would you like to get in touch with Avner directly?",
          timestamp: new Date(),
          sessionId
        });
        setChatState(prev => ({ ...prev, stage: 'CONTACT_FORM' }));
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecruiterFormSubmit = async (data: RecruiterInfo) => {
    setIsLoading(true);
    try {
      // Store recruiter form data
      await addDoc(collection(db, 'recruiter_submissions'), {
        ...data,
        timestamp: new Date(),
        status: 'pending',
        notes: '',
        sessionId
      });

      // Send analysis message with hidden URL
      await addDoc(collection(db, 'generate'), {
        prompt: `I have a job opportunity as ${data.jobRole} at ${data.company}. Here's the job description: ${data.jobDescription}. 
                Please analyze this job description and provide a structured assessment of Avner's fit for this role using the following format:
                🎯 Role Overview:
                Brief summary of the position (1 short sentence)
                ⭐ Technical Skills Match: Rate 1-5 stars (★)
                ⭐ Experience Relevance: Rate 1-5 stars (★)
                ⭐ Industry Background: Rate 1-5 stars (★)
                ⭐ Soft Skills Alignment: Rate 1-5 stars (★)
                ⭐ Overall Match: Rate 1-5 stars (★)
                ⭐ Growth Areas: Rate 1-5 stars (★)
                Overall, rate the match from 1-5 stars (★)
                Keep the analysis honest, specific, and concise`,
        displayPrompt: `I have a job opportunity as ${data.jobRole} at ${data.company}. Please analyze the job description and explain why Avner would be a good fit for this role.`,
        timestamp: new Date(),
        sessionId
      });
      
      // Add follow-up message
      await addDoc(collection(db, 'generate'), {
        response: `Thank you ${data.name} for sharing this opportunity! Wait a minute, I'll analyze the role and provide my assessment above. 
                  Would you like to schedule a meeting to discuss this opportunity in more detail?`,
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
      await addDoc(collection(db, 'generate'), {
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

      await addDoc(collection(db, 'generate'), {
        response: `Thanks ${data.name}! I've forwarded your message to Avner. He'll get back to you soon at ${data.email}.`,
        timestamp: new Date(),
        sessionId
      });

      setChatState(prev => ({ ...prev, stage: 'CLOSED' }));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (fileUrl: string) => {
    setIsLoading(true);
    try {
      await addDoc(collection(db, 'generate'), {
        prompt: `Please analyze this job description and explain why you would be a good fit: ${fileUrl}`,
        timestamp: new Date(),
        sessionId
      });
      
      await addDoc(collection(db, 'generate'), {
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
      await addDoc(collection(db, 'generate'), {
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
        await addDoc(collection(db, 'generate'), {
          response: "I apologize, but you've reached the maximum number of chat sessions for today. Please try again tomorrow.",
          timestamp: new Date(),
          sessionId
        });
        setChatState(prev => ({ ...prev, stage: 'CLOSED' }));
        return;
      }

      // Store email in state for future reference
      setChatState(prev => ({ 
        ...prev, 
        stage: 'INITIAL',
        userEmail: data.email 
      }));

      // Add welcome message
      await addDoc(collection(db, 'generate'), {
        response: "👋 Hi there! I'm Avner's AI Assistant. How can I help you today?",
        timestamp: new Date(),
        isOption: true,
        sessionId
      });
    } catch (error) {
      console.error('Error:', error);
      await addDoc(collection(db, 'generate'), {
        response: "Sorry, there was an error. Please try again.",
        timestamp: new Date(),
        sessionId
      });
    } finally {
      setIsLoading(false);
    }
  };

  const canType = chatState.stage === 'TYPING_ENABLED';
  const showOptions = chatState.stage === 'INITIAL';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
      <div 
        className="bg-gray-900/95 backdrop-blur-sm rounded-2xl w-full max-w-xl shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modified: Better loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-30">
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
              <span className="text-sm text-gray-400">Thinking...</span>
            </div>
          </div>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 transition-colors z-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="p-3 border-b border-gray-800/50">
          <div className="flex items-center gap-3">
            <div className="relative h-8 w-8">
              <Image
                src="/images/profile-picture.jpg"
                alt="AI Assistant"
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-200">AI Assistant</h2>
              <p className="text-xs text-gray-400">Ask me anything about Avner</p>
            </div>
          </div>
        </div>

        {/* Chat messages */}
        <div className="h-[300px] overflow-y-auto p-4 space-y-4 scroll-smooth">
          {isClearing ? (
            <div className="flex items-center justify-center h-full">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <div key={index} className="relative z-10">
                  {message.prompt && !message.isOption && (
                    <div className="flex flex-col items-end gap-1 mb-2">
                      <div className="bg-blue-500/10 rounded-lg px-3 py-1.5 max-w-[80%]">
                        <MarkdownMessage content={
                          // @ts-ignore (add displayPrompt to ChatMessage interface)
                          message.displayPrompt || message.prompt
                        } />
                      </div>
                      {message.timestamp && (
                        <span className="text-xs text-gray-500">
                          {formatTimestamp(message.timestamp)}
                        </span>
                      )}
                    </div>
                  )}
                  {message.response && (
                    <div className="flex items-start gap-2 mb-2">
                      <Image
                        src="/images/profile-picture.jpg"
                        alt="AI Assistant"
                        width={24}
                        height={24}
                        className="rounded-full mt-1"
                      />
                      <div className="flex-1">
                        <div className="bg-gray-800/50 rounded-lg px-3 py-1.5 max-w-[80%]">
                          <MarkdownMessage content={message.response} />
                          {message.isOption && chatState.stage === 'INITIAL' && (
                            <div className="flex flex-col gap-2 mt-3">
                              {INITIAL_OPTIONS.map((option) => (
                                <button
                                  key={option.id}
                                  onClick={() => handleOptionSelect(option.action === 'SET_RECRUITER' ? 'RECRUITER' : 'VISITOR')}
                                  disabled={isLoading}
                                  className="text-left px-3 py-2 rounded-lg bg-gray-700/50 hover:bg-gray-700/70 
                                    transition-colors text-sm text-gray-200 relative z-20 disabled:opacity-50
                                    disabled:cursor-not-allowed"
                                >
                                  {option.text}
                                </button>
                              ))}
                            </div>
                          )}
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
              <div ref={messagesEndRef} /> {/* Scroll anchor */}
            </>
          )}
        </div>

        {/* Input Section */}
        <div className="border-t border-gray-800/50">
          {chatState.stage === 'RECRUITER_FORM' && (
            <div className="p-4">
              <RecruiterForm 
                onSubmit={handleRecruiterFormSubmit} 
                disabled={isLoading} 
              />
            </div>
          )}

          {chatState.stage === 'MEETING_SETUP' && (
            <div className="p-4">
              <button
                onClick={async () => {
                  await addDoc(collection(db, 'generate'), {
                    response: "I'll have Avner review your request and get back to you soon with available meeting times. Thank you for your interest!",
                    timestamp: new Date(),
                    sessionId
                  });
                  setChatState(prev => ({ ...prev, stage: 'CLOSED' }));
                }}
                className="w-full px-3 py-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 
                  transition-colors"
              >
                Schedule a Meeting
              </button>
            </div>
          )}

          {chatState.stage === 'VISITOR_TOPICS' && (
            <div className="p-4">
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
            <ContactForm 
              onSubmit={handleContactSubmit}
              disabled={isLoading}
            />
          )}

          {chatState.stage === 'EMAIL_VERIFICATION' && (
            <InitialEmailForm 
              onSubmit={handleEmailSubmit}
              disabled={isLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
} 