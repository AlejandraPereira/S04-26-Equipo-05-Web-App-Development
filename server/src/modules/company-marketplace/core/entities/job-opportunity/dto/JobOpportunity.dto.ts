import { OpportunityStatus } from '../OpportunityStatus';

export interface JobOpportunityDTO {
  id?: string;
  companyId: string;
  title: string;
  description: string;
  location: string;
  isRemote: boolean;
  minSalary: number;
  maxSalary: number;
  status: OpportunityStatus;
  publishedAt: Date;
  expiresAt: Date;
}
