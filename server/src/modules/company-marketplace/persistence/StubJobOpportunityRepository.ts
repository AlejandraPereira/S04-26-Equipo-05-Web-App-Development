import { JobOpportunityRepository } from '../core/data/JobOpportunityRepository';
import { JobOpportunityDTO } from '../core/entities/job-opportunity/dto/JobOpportunity.dto';

export class StubJobOpportunityRepository implements JobOpportunityRepository {
  private jobOpportunities: Map<string, JobOpportunityDTO> = new Map();

  async save(jobOpportunity: JobOpportunityDTO): Promise<JobOpportunityDTO> {
    if (!jobOpportunity.id) {
      throw new Error('JobOpportunity ID is required to save');
    }
    this.jobOpportunities.set(jobOpportunity.id, jobOpportunity);
    return jobOpportunity;
  }

  async findById(id: string): Promise<JobOpportunityDTO | null> {
    return this.jobOpportunities.get(id) || null;
  }

  async find(limit: number, offset: number): Promise<JobOpportunityDTO[]> {
    const jobs = Array.from(this.jobOpportunities.values());
    return jobs.slice(offset, offset + limit);
  }

  async delete(id: string): Promise<void> {
    this.jobOpportunities.delete(id);
  }
}
