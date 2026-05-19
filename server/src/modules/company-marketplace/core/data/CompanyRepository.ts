import { Company } from '../entities/company/Company.entity';
import { CompanyDTO } from '../entities/company/dto/Company.dto';

export interface CompanyRepository {
  save(company: CompanyDTO): Promise<CompanyDTO>;
  findById(id: string): Promise<CompanyDTO | null>;
  find(limit: number, offset: number): Promise<CompanyDTO[]>;
  delete(id: string): Promise<void>;
}
