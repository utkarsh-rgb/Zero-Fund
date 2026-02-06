export interface SocialLink {
  platform: string;
  url: string;
}

export interface Project {
  project_name: string;
  project_url: string;
  description: string;
}

export interface UserData {
  id: number;
  fullName: string;
  email: string;
  bio?: string;
  location?: string;
  skills?: string[];
  socialLinks?: SocialLink[];
  projects?: Project[];
  profile_pic?: string;
  
  // Entrepreneur specific
  headline?: string;
  companyName?: string;
  industry?: string;
  website?: string;
  vision?: string;
}
