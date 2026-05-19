import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyOrmEntity } from '../entities/company.orm.entity';
import { CompanyRepository } from 'src/modules/company-marketplace/core/data/CompanyRepository';
import { CompanyDTO } from 'src/modules/company-marketplace/core/entities/company/dto/Company.dto';

export class PostgresCompanyRepository implements CompanyRepository {
  constructor(
    @InjectRepository(CompanyOrmEntity)
    private readonly repository: Repository<CompanyOrmEntity>,
  ) {}

  async save(company: CompanyDTO): Promise<CompanyDTO> {
    const entity = this.repository.create(company);
    const savedEntity = await this.repository.save(entity);
    return savedEntity as CompanyDTO;
  }

  async findById(id: string): Promise<CompanyDTO | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? (entity as CompanyDTO) : null;
  }

  async find(limit: number, offset: number): Promise<CompanyDTO[]> {
    const entities = await this.repository.find({
      take: limit,
      skip: offset,
    });
    return entities as CompanyDTO[];
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
