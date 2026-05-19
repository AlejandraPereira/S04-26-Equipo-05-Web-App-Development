import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateOpportunityCommand } from './createOportunity.command';
import { JobsUseCases } from 'src/modules/company-marketplace/core/use-cases/JobsUseCases';
import { JOB_USE_CASES } from 'src/modules/company-marketplace/shared/constants';
import { Inject } from '@nestjs/common/decorators/core/inject.decorator';

@CommandHandler(CreateOpportunityCommand)
export class CreateOpportunityHandler implements ICommandHandler<CreateOpportunityCommand> {
  constructor(
    @Inject(JOB_USE_CASES) private jobOpportunityUseCases: JobsUseCases,
  ) {}
  async execute(command: CreateOpportunityCommand): Promise<void> {
    const { opportunityData } = command;
    await this.jobOpportunityUseCases.createJobOpportunityForCompany(
      opportunityData,
    );
  }
}
