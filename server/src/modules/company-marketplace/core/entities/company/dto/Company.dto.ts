import { CompanyStatus } from '../CompanyStatus';

export interface CompanyDTO {
  id?: string;
  userId: string;
  legalName: string;
  industry: string;
  employeeCount: number;
  webSiteUrl: string;
  companyStatus: CompanyStatus;
  verifiedAt: Date | null;
}
