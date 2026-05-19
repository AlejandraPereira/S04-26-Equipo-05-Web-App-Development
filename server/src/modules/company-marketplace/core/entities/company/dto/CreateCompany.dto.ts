import { CompanyStatus } from '../CompanyStatus';

export interface CreateCompanyDTO {
  userId: string;
  legalName: string;
  industry: string;
  employeeCount: number;
  webSiteUrl: string;
  companyStatus: CompanyStatus;
  verifiedAt?: Date | null;
  id?: string;
}
