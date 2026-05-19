export interface CreateProfessionalProfileDTO {
  id?: string;
  userId: string;
  headline?: string | null;
  summary?: string | null;
  location?: string | null;
  yearsExperience?: number | null;
  linkedinUrl?: string | null;
  completionScore?: number;
  lastUpdated?: Date;
}
