
// Add React import to fix "Cannot find namespace 'React'" error
import * as React from 'react';

export interface Startup {
  id: string;
  userId: number;
  connectionStatus?: 'not_connected' | 'pending' | 'accepted' | 'rejected' | 'self';
  name: string;
  sector: string;
  stage: string;
  location: string;
  matchScore: number;
  description: string;
  fundingAsk: string;
  valuation: string;
  tags: string[];
  logo: string;
  status: 'New' | 'In Review' | 'On Track' | 'Needs Attention' | 'Exited';
  investedAmount?: string;
  currentValue?: string;
  growth?: string;
  reviewStatus?: string;
  reviewProgress?: number;
}

export interface Message {
  id: string;
  sender: string;
  role: string;
  content: string;
  timestamp: string;
  isMe: boolean;
  avatar: string;
}

export interface StatCardProps {
  label: string;
  value: string;
  trend?: string;
  isPositive?: boolean;
  icon: React.ReactNode;
}