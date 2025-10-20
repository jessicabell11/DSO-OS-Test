export interface Team {
  id: string;
  name: string;
  description: string;
  logo?: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'inactive' | 'archived';
  members: string[];
  memberRoles?: Record<string, string>;
  memberAllocations?: Record<string, number>;
  businessCapabilities: string[];
  workingAgreementId?: string;
  metrics?: {
    cycleTime: number;
    deploymentFrequency?: number;
    leadTime?: number;
    mttr?: number;
    defectRate?: number;
    teamHealth: number;
  };
  backlogLink?: {
    url: string;
    type: 'digital-product-journey' | 'azure-devops' | 'aha' | 'other';
  };
  teamInfoLinks?: TeamInfoLink[];
}

export interface TeamWorkingAgreement {
  id: string;
  title: string;
  description: string;
  sections: WorkingAgreementSection[];
  status: 'draft' | 'active' | 'archived';
  version: number;
  lastUpdated: string;
  approvals: TeamMemberApproval[];
  backlogLink?: {
    url: string;
    type: 'digital-product-journey' | 'azure-devops' | 'aha' | 'other';
  };
  teamInfoLinks?: TeamInfoLink[];
  businessCapabilities?: string[];
}

export interface WorkingAgreementSection {
  id: string;
  title: string;
  content: string;
  isEditing?: boolean;
}

export interface TeamMemberApproval {
  memberId: string;
  approved: boolean;
  approvedAt?: string;
}

export interface TeamInfoLink {
  id: string;
  title: string;
  url: string;
  type: 'sharepoint' | 'wiki' | 'documentation' | 'teams-channel' | 'other';
  description?: string;
}

export interface BusinessCapability {
  id: string;
  name: string;
  category: 'core' | 'enabling';
  domain: string;
  description?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  email: string;
  phone?: string;
  location?: string;
  department?: string;
  skills?: string[];
  availability: 'available' | 'busy' | 'away' | 'offline';
  bio?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    other?: string;
  };
  projects?: string[];
}

export interface Outcome {
  id: string;
  title: string;
  description: string;
  metrics: Metric[];
  timeframe?: 'long-term' | 'mid-term' | 'short-term';
  parentOutcomeId?: string;
}

export interface Metric {
  name: string;
  current: string;
  target: string;
  unit: string;
  status: 'on-track' | 'at-risk' | 'off-track';
}

export interface OutcomeData {
  longTerm: string[];
  midTerm: string[];
  shortTerm: string[];
}

export interface ProgressData {
  cycleTime: number;
  deploymentFrequency: number;
  leadTime: number;
  mttr: number;
  defectRate: number;
  teamHealth: number;
}

export interface BacklogItem {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  effort: 'small' | 'medium' | 'large';
  impact: 'high' | 'medium' | 'low';
  assignee?: string;
  dueDate?: string;
  status: 'not-started' | 'in-progress' | 'blocked' | 'completed';
  tags: string[];
}

export interface ReleaseNote {
  id: string;
  title: string;
  description: string;
  date: string;
  version: string;
  features: string[];
  bugfixes: string[];
  improvements: string[];
}

export interface ProductAdoptionData {
  userResearch: UserResearch[];
  recommendations: Recommendation[];
  metrics: {
    activeUsers: number;
    activeUsersChange: number;
    retentionRate: number;
    retentionRateChange: number;
    engagementScore: number;
    engagementScoreChange: number;
    nps: number;
    npsChange: number;
  };
}

export interface UserResearch {
  id: string;
  title: string;
  description: string;
  date: string;
  participants: number;
  findings: string[];
  recommendations: string[];
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: string;
  effort: string;
  timeframe: string;
}

export interface RelatedTeam {
  id: string;
  name: string;
  description: string;
  relationship: 'upstream' | 'downstream' | 'peer';
  dependencies: string[];
}

export interface AccomplishmentData {
  title: string;
  description: string;
  date: string;
  type: 'accomplishment' | 'learning';
  impact: string;
  team: string[];
}
