// Existing types
export interface Outcome {
  id: string;
  title: string;
  description: string;
  metrics: Metric[];
}

export interface Metric {
  name: string;
  current: string;
  target: string;
}

export interface OutcomeData {
  longTerm: Outcome[];
  midTerm: Outcome[];
  shortTerm: Outcome[];
}

export interface UserResearchInsight {
  id: string;
  title: string;
  description: string;
  source: string;
  date: string;
  tags: string[];
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  source: string;
}

export interface BacklogItem {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  status: 'not-started' | 'in-progress' | 'completed';
  tags: string[];
}

// New type for related teams
export interface RelatedTeam {
  id: string;
  name: string;
  description: string;
  logo: string;
  relationshipType: 'outcome' | 'backlog' | 'capability' | 'multiple';
  relationshipStrength: 'high' | 'medium' | 'low';
  sharedOutcomes: string[];
  capabilities: string[];
  capacity: 'high' | 'medium' | 'low' | 'none';
  contactPerson: {
    name: string;
    role: string;
    avatar: string;
    email: string;
  };
  lastCollaboration: string;
  upcomingMilestones: string[];
}
