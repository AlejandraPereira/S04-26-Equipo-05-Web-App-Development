import { COMPANY_WEBSITE_URL_REGEX } from '../../shared/constants/regex';
import { CompanyStatus } from './CompanyStatus';
import { CreateCompanyDTO } from './dto/CreateCompany.dto';
import { CompanyDTO } from './dto/Company.dto';

export class Company {
  private _id?: string;
  private _userId!: string;
  private _legalName!: string;
  private _industry!: string;
  private _employeeCount!: number;
  private _webSiteUrl!: string;
  private _companyStatus!: CompanyStatus;
  private _verifiedAt!: Date | null;

  private constructor() {}

  public static create(data: CreateCompanyDTO): CompanyDTO {
    const company = new Company();
    const id = data.id ?? crypto.randomUUID();
    company
      .setId(id)
      .setUserId(data.userId)
      .setLegalName(data.legalName)
      .setIndustry(data.industry)
      .setEmployeeCount(data.employeeCount)
      .setWebSiteUrl(data.webSiteUrl)
      .setCompanyStatus(data.companyStatus)
      .setVerifiedAt(data.verifiedAt ?? null);
    return company.toJSON();
  }

  private setId(id: string): this {
    if (!id || id.trim().length === 0) throw new Error('ID cannot be empty');
    this._id = id;
    return this;
  }

  private setUserId(userId: string): this {
    if (!userId || userId.trim().length === 0)
      throw new Error('UserID cannot be empty');
    this._userId = userId;
    return this;
  }

  private setLegalName(legalName: string): this {
    if (!legalName || legalName.length < 3)
      throw new Error('Legal name must be at least 3 characters');
    this._legalName = legalName;
    return this;
  }

  private setIndustry(industry: string): this {
    if (!industry || industry.trim().length === 0)
      throw new Error('Industry cannot be empty');
    this._industry = industry;
    return this;
  }

  private setEmployeeCount(employeeCount: number): this {
    if (employeeCount < 1) throw new Error('Employee count must be at least 1');
    this._employeeCount = employeeCount;
    return this;
  }

  private setWebSiteUrl(webSiteUrl: string): this {
    if (!COMPANY_WEBSITE_URL_REGEX.test(webSiteUrl))
      throw new Error('Invalid Website URL');
    this._webSiteUrl = webSiteUrl;
    return this;
  }

  private setCompanyStatus(companyStatus: CompanyStatus): this {
    if (!companyStatus) throw new Error('Company status is required');
    if (!Object.values(CompanyStatus).includes(companyStatus)) {
      throw new Error(`Invalid company status: ${companyStatus}`);
    }
    this._companyStatus = companyStatus;
    return this;
  }

  private setVerifiedAt(verifiedAt: Date | null): this {
    this._verifiedAt = verifiedAt;
    return this;
  }

  private toJSON(): CompanyDTO {
    return {
      id: this._id,
      userId: this._userId,
      legalName: this._legalName,
      industry: this._industry,
      employeeCount: this._employeeCount,
      webSiteUrl: this._webSiteUrl,
      companyStatus: this._companyStatus,
      verifiedAt: this._verifiedAt,
    };
  }
}
