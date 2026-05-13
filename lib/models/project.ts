export interface Project {
  slug: string;
  title: string;
  summary: string;
  tech: string[];
  repoUrl: string;
  liveUrl?: string;
  category: string;
  glyph: string;
  thumbnail?: string;
}
