import type { Metadata } from "next";
import type { PropsWithChildren } from 'react';
import ChatLayout from '@/modules/chat/components/chat-layout';

export const metadata: Metadata = {
  title: "AI Chat",
  description: "AI-powered chat interface",
};

export default function ChatLayoutWrapper({ children }: PropsWithChildren) {
  return <ChatLayout>{children}</ChatLayout>;
}