import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CompanyOrmEntity } from '../../persistence/postgres/entities/company.orm.entity';
import { CompanyStatus } from '../entities/company/CompanyStatus';

export interface UpsertCompanyDto {
  legalName: string;
  industry: string;
  employeeCount: number;
  webSiteUrl?: string | null;
  description?: string | null;
  location?: string | null;
  linkedinUrl?: string | null;
}

@Injectable()
export class CompanyDirectService {
  constructor(
    @InjectRepository(CompanyOrmEntity)
    private readonly repo: Repository<CompanyOrmEntity>,
  ) {}

  async findByUserId(userId: string): Promise<CompanyOrmEntity | null> {
    return this.repo.findOneBy({ userId });
  }

  async upsert(userId: string, dto: UpsertCompanyDto): Promise<CompanyOrmEntity> {
    let company = await this.repo.findOneBy({ userId });

    if (company) {
      Object.assign(company, dto);
    } else {
      company = this.repo.create({
        id: uuidv4(),
        userId,
        companyStatus: CompanyStatus.ACTIVE,
        ...dto,
      });
    }

    return this.repo.save(company);
  }

  async findById(id: string): Promise<CompanyOrmEntity> {
    const company = await this.repo.findOneBy({ id });
    if (!company) throw new NotFoundException('Empresa no encontrada');
    return company;
  }
}
