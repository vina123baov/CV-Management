import type { LucideIcon } from 'lucide-react';

// Menu Item Interface
export interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

// Statistics Interface
export interface Stat {
  label: string;
  value: string;
  change: string;
  color: string;
}

// Application Status Type
export type ApplicationStatus = 'pending' | 'approved' | 'interview' | 'rejected';

// Application Interface
export interface Application {
  id?: string;
  name: string;
  position: string;
  time: string;
  status: ApplicationStatus;
  email?: string;
  phone?: string;
  cvUrl?: string;
}

// Interview Interface
export interface Interview {
  id?: string;
  candidate: string;
  position: string;
  time: string;
  interviewer: string;
  date?: string;
  location?: string;
  type?: 'online' | 'offline';
  meetingLink?: string;
}

// Job Interface
export interface Job {
  id?: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  salary?: string;
  description: string;
  requirements: string[];
  benefits?: string[];
  postedDate: string;
  deadline?: string;
  status: 'active' | 'inactive' | 'closed';
}

// Candidate Interface
export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: number;
  skills: string[];
  cvUrl: string;
  appliedDate: string;
  status: ApplicationStatus;
  notes?: string;
}

// User Interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'hr' | 'interviewer';
  avatar?: string;
  department?: string;
}

// Email Interface
export interface Email {
  id: string;
  to: string[];
  subject: string;
  content: string;
  sentAt: string;
  status: 'sent' | 'draft' | 'failed';
  template?: string;
}

// Evaluation Interface
export interface Evaluation {
  id: string;
  candidateId: string;
  interviewerId: string;
  interviewDate: string;
  scores: {
    technical: number;
    communication: number;
    cultural: number;
    overall: number;
  };
  notes: string;
  recommendation: 'hire' | 'reject' | 'consider';
}

// API Response Interface
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Pagination Interface
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Filter Interface
export interface Filter {
  search?: string;
  status?: ApplicationStatus;
  position?: string;
  dateFrom?: string;
  dateTo?: string;
}

// Dashboard Statistics Interface
export interface DashboardStats {
  totalCandidates: number;
  totalJobs: number;
  todayInterviews: number;
  acceptanceRate: number;
  newApplicationsToday: number;
  pendingReviews: number;
}

// Notification Interface
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
}