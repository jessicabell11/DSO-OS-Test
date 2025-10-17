export interface Team {
  id: string;
  name: string;
  description: string;
  logo?: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'inactive' | 'archived';
  members: string[];
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
  type: 'sharepoint' | 'wiki' | 'documentation' | 'other';
  description?: string;
}

export interface BusinessCapability {
  id: string;
  name: string;
  category: 'core' | 'enabling';
  domain: string;
  description?: string;
}
