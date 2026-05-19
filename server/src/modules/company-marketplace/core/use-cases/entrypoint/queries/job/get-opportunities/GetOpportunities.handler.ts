import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { JobsUseCases } from '../../../../JobsUseCases';
import { GetOpportunitiesQuery } from './GetOpportunities.query';
import { JOB_USE_CASES } from 'src/modules/company-marketplace/shared/constants';

@QueryHandler(GetOpportunitiesQuery)
export class GetOpportunitiesHandler implements IQueryHandler<GetOpportunitiesQuery> {
  constructor(
    @Inject(JOB_USE_CASES) private readonly jobsUseCases: JobsUseCases,
  ) {}

  async execute(query: GetOpportunitiesQuery): Promise<any> {
    const { page, size } = query;
    const result = await this.jobsUseCases.getJobs({ page, size });
    return result;
  }
}
