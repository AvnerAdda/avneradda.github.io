"use client";

import dynamic from 'next/dynamic';

const ChatbotDialogWrapper = dynamic(() => import('./ChatbotDialogWrapper'), {
  ssr: false,
  loading: () => null,
});

const FloatingResumeButton = dynamic(() => import('./FloatingResumeButton'), {
  ssr: false,
  loading: () => null,
});

const FloatingChatButton = dynamic(() => import('./FloatingChatButton'), {
  ssr: false,
  loading: () => null,
});

export default function ClientChrome() {
  return (
    <>
      <ChatbotDialogWrapper />
      <FloatingResumeButton />
      <FloatingChatButton />
    </>
  );
}
