import { CompanyRepository } from '../data/CompanyRepository';
import { JobOpportunityRepository } from '../data/JobOpportunityRepository';
import { CreateJobOpportunityDTO } from '../entities/job-opportunity/dto/CreateJobOpportunity.dto';
import { JobOpportunityDTO } from '../entities/job-opportunity/dto/JobOpportunity.dto';
import { JobOpportunity } from '../entities/job-opportunity/JobOpportunity.entity';
import { GetJobsDTO } from '../entities/job-opportunity/dto/GetJobs.dto';
import { Paginated } from '../shared/helpers/paginated.helper';

export interface JobUseCasesProvider {
  createJobOpportunityForCompany(
    jobOpportunityData: CreateJobOpportunityDTO,
  ): Promise<JobOpportunityDTO>;
  getJobs(getJobsRequest: GetJobsDTO): Promise<Paginated<JobOpportunityDTO>>;
}
export class JobsUseCases {
  constructor(
    private companyRepository: CompanyRepository,
    private jobOpportunityRepository: JobOpportunityRepository,
  ) {}

  async createJobOpportunityForCompany(
    jobOpportunityData: CreateJobOpportunityDTO,
  ): Promise<JobOpportunityDTO> {
    const company = await this.companyRepository.findById(
      jobOpportunityData.companyId,
    );
    if (!company) {
      throw new Error('Company not found');
    }
    const job = JobOpportunity.create(jobOpportunityData);
    const result = await this.jobOpportunityRepository.save(job);
    return result;
  }

  async getJobs(
    getJobsRequest: GetJobsDTO,
  ): Promise<Paginated<JobOpportunityDTO>> {
    const page = Number(getJobsRequest.page) || 1;
    const size = Number(getJobsRequest.size) || 10;
    const safePage = Math.max(1, page);
    const offset = (safePage - 1) * size;
    const allJobs = await this.jobOpportunityRepository.find(size, offset);
    const paginatedJobs = Paginated.create<JobOpportunityDTO>({
      data: allJobs,
      page: safePage,
      size: size,
      count: allJobs.length,
    });
    return paginatedJobs;
  }
}
