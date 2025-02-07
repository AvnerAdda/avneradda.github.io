import { Analytics } from 'firebase/analytics';
import { analytics } from './firebase';
import { logEvent } from 'firebase/analytics';

// Add type assertion to fix the error
const analyticsInstance = analytics as Analytics;

export const AnalyticsService = {
  // Page Views
  trackPageView: (page: string) => {
    if (!analytics) return;
    logEvent(analytics, 'page_view', {
      page_title: page,
      page_location: window.location.href,
    });
  },

  // Profile Interactions
  trackProfileInteraction: (action: string) => {
    if (!analytics) return;
    logEvent(analytics, 'profile_interaction', {
      action_type: action,
      timestamp: new Date().toISOString(),
    });
  },

  // Recruiter Actions
  trackRecruiterAction: (action: string, data?: any) => {
    if (!analytics) return;
    logEvent(analytics, 'recruiter_action', {
      action_type: action,
      ...data,
      timestamp: new Date().toISOString(),
    });
  },

  // Chatbot Interactions
  trackChatbotInteraction: (action: string, data?: any) => {
    if (!analytics) return;
    logEvent(analytics, 'chatbot_interaction', {
      action_type: action,
      ...data,
      timestamp: new Date().toISOString(),
    });
  },

  // Document Actions
  trackDocumentAction: (action: string, documentType: string) => {
    if (!analytics) return;
    logEvent(analytics, 'document_action', {
      action_type: action,
      document_type: documentType,
      timestamp: new Date().toISOString(),
    });
  }
}; 