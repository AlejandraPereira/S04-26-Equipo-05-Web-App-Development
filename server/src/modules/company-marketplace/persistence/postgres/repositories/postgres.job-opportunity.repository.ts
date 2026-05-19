import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobOpportunityOrmEntity } from '../entities/job-opportunity.orm.entity';
import { JobOpportunityDTO } from 'src/modules/company-marketplace/core/entities/job-opportunity/dto/JobOpportunity.dto';
import { JobOpportunityRepository } from 'src/modules/company-marketplace/core/data/JobOpportunityRepository';

export class PostgresJobOpportunityRepository implements JobOpportunityRepository {
  constructor(
    @InjectRepository(JobOpportunityOrmEntity)
    private readonly repository: Repository<JobOpportunityOrmEntity>,
  ) {}

  async save(jobOpportunity: JobOpportunityDTO): Promise<JobOpportunityDTO> {
    const entity = this.repository.create(jobOpportunity);
    const savedEntity = await this.repository.save(entity);
    return savedEntity as JobOpportunityDTO;
  }

  async findById(id: string): Promise<JobOpportunityDTO | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? (entity as JobOpportunityDTO) : null;
  }

  async find(limit: number, offset: number): Promise<JobOpportunityDTO[]> {
    const entities = await this.repository.find({
      take: limit,
      skip: offset,
    });
    return entities as JobOpportunityDTO[];
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
