import { CompanyRepository } from '../core/data/CompanyRepository';
import { CompanyDTO } from '../core/entities/company/dto/Company.dto';

export class StubCompanyRepository implements CompanyRepository {
  private companies: Map<string, CompanyDTO> = new Map();

  async save(company: CompanyDTO): Promise<CompanyDTO> {
    if (!company.id) {
      throw new Error('Company ID is required to save');
    }
    this.companies.set(company.id, company);
    return company;
  }

  async findById(id: string): Promise<CompanyDTO | null> {
    return this.companies.get(id) || null;
  }

  async find(limit: number = 10, offset: number = 0): Promise<CompanyDTO[]> {
    const companies = Array.from(this.companies.values());
    return companies.slice(offset, offset + limit);
  }

  async delete(id: string): Promise<void> {
    this.companies.delete(id);
  }
}
