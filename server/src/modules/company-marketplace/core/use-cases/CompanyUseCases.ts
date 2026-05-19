import { CompanyRepository } from '../data/CompanyRepository';
import { Company } from '../entities/company/Company.entity';
import { CompanyDTO } from '../entities/company/dto/Company.dto';
import { CreateCompanyDTO } from '../entities/company/dto/CreateCompany.dto';
import { GetCompaniesDTO } from '../entities/company/dto/GetCompanies.dto';
import { Paginated } from '../shared/helpers/paginated.helper';

export interface CompanyUseCasesProvider {
  createCompany(companyData: CreateCompanyDTO): Promise<CreateCompanyDTO>;
  getCompanies(getCompanies: GetCompaniesDTO): Promise<Paginated<CompanyDTO>>;
}

export class CompanyUseCases {
  constructor(private companyRepository: CompanyRepository) {}

  async createCompany(
    companyData: CreateCompanyDTO,
  ): Promise<CreateCompanyDTO> {
    const newCompany = Company.create(companyData);
    await this.companyRepository.save(newCompany);
    return newCompany;
  }

  async getCompanies(
    getCompanies: GetCompaniesDTO,
  ): Promise<Paginated<CompanyDTO>> {
    const page = Number(getCompanies.page) || 1;
    const size = Number(getCompanies.size) || 10;
    const offset = (page - 1) * size;
    const companies = await this.companyRepository.find(size, offset);

    const paginatedCompanies = Paginated.create<CompanyDTO>({
      data: companies,
      page: page,
      size: size,
      count: companies.length,
    });

    return paginatedCompanies;
  }
}
