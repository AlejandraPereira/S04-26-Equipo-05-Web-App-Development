import { JobOpportunityDTO } from '../entities/job-opportunity/dto/JobOpportunity.dto';

export interface JobOpportunityRepository {
  save(jobOpportunity: JobOpportunityDTO): Promise<JobOpportunityDTO>;
  findById(id: string): Promise<JobOpportunityDTO | null>;
  find(limit: number, offset: number): Promise<JobOpportunityDTO[]>;
  delete(id: string): Promise<void>;
}
