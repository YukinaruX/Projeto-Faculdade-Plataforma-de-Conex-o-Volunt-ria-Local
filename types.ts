export type Role = 'volunteer' | 'organization';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  skills: string[];
  location: string;
  availability: string;
}

export interface Organization {
  id: string;
  owner_id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
}

export interface Opportunity {
  id: string;
  organization_id: string;
  organization_name?: string; // Hydrated for UI
  title: string;
  description: string;
  required_skills: string[];
  location: string;
  schedule: string;
  created_at: string;
}

export interface Application {
  id: string;
  user_id: string;
  opportunity_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  opportunity_title?: string; // Hydrated for UI
}

export interface MatchResult extends Opportunity {
  matchScore: number;
  matchReasons: string[];
}