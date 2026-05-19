import { JobOpportunityDTO } from 'src/modules/company-marketplace/core/entities/job-opportunity/dto/JobOpportunity.dto';

export class CreateOpportunityCommand {
  constructor(public opportunityData: JobOpportunityDTO) {}
}
