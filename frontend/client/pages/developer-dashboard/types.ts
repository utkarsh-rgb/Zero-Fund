export interface Idea {
  id: string;
  title: string;
  stage: "Idea" | "MVP" | "Beta";
  fullName: string;
  founderAvatar: string;
  required_skills: string[];
  equity_offering: string;
  shortDescription: string;
  fullDescription?: string;
  isBookmarked: boolean;
  level: number;
  isNDA: boolean;
  created_at: string;
  hasAcceptedNDA?: boolean;
}

export interface Proposal {
  id: string;
  ideaTitle: string;
  status: "Submitted" | "Accepted" | "Rejected" | "Under Review";
  equityProposed: string;
  submittedAt: string;
  founderName: string;
}

export interface Collaboration {
  id: string;
  projectTitle: string;
  founderName: string;
  developerName: string;
  status: "Active" | "Completed" | "On Hold";
  progress: number;
  nextMilestone: string;
  equity: string;
}
