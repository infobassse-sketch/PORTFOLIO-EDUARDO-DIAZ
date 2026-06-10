export type ProjectBranch = 'web' | 'branding' | 'events' | 'ai' | 'merch';

export interface Project {
  id: string;
  name: string;
  branch: ProjectBranch;
  branchLabel: string; // e.g. "01 — Web"
  type: 'CLIENTE BASSSE' | 'PROYECTO PROPIO' | 'EVENTO';
  category: string;
  year: string;
  description: string;
  detailedDescription?: string;
  image: string;
  image_url: string;
  images?: string[]; // Multiple photos support per project
  tags: string[];
  link?: string;
  metrics?: { label: string; value: string }[];
  accentColor?: string; // e.g. for custom hover visuals
}

export interface NavigationItem {
  id: 'home' | 'portfolio' | 'projects' | 'contact' | 'admin';
  label: string;
}

export interface ProprietaryProject {
  id: string;
  name: string;
  role: string; // e.g. "CEO & Founder"
  description: string;
  longDescription: string;
  image: string;
  image_url?: string;
  tags: string[];
  link?: string;
  stats?: { label: string; value: string }[];
}
