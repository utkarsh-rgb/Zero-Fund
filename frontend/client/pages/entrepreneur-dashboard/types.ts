export interface Milestone {
  id: number;
  title: string;
  description: string;
  duration: string;
  created_at: string;
  completed?: boolean;
}

export type Idea = {
  flag: number;
  required_skills: any;
  attachments: any;
  id: number;
  title: string;
  stage: string;
  status: string;
  proposalsCount: number;
  viewsCount: number;
  equity_offering: string;
  created_at: string;
  lastUpdated: string;
  visibility: string;
  updated_at: string;
};

export interface Proposal {
  id: string;
  ideaTitle: string;
  developerName: string;
  developerId: number;
  developerAvatar: string;
  skills: string[];
  equityRequested: string;
  timeline: string;
  scope?: string;
  status: "Pending" | "Reviewed" | "Accepted" | "Rejected" | "Approved";
  submittedAt: string;
  rating?: number;
  contract_status?: "not_generated" | "generated";
}

export interface Collaboration {
  id: number;
  project_title: string;
  developer_name: string;
  status: string;
  signed_by_developer: number;
  signed_by_entrepreneur: number;
  timeline?: string;
  equity_percentage?: string;
  ip_ownership?: string;
  confidentiality?: string;
  developer_id?: number;
}

export interface Contract {
  id: number;
  title?: string;
  developer_id: number;
  entrepreneur_id: number;
  signed_by_developer: number;
  signed_by_entrepreneur?: number;
  project_title?: string;
  developer_name?: string;
}
