import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateCompanyCommand } from './CreateCompany.command';
import { CompanyUseCases } from 'src/modules/company-marketplace/core/use-cases/CompanyUseCases';
import { CreateCompanyDTO } from 'src/modules/company-marketplace/core/entities/company/dto/CreateCompany.dto';
import { COMPANY_USE_CASES } from 'src/modules/company-marketplace/shared/constants';

@CommandHandler(CreateCompanyCommand)
export class CreateCompanyHandler implements ICommandHandler<CreateCompanyCommand> {
  constructor(
    @Inject(COMPANY_USE_CASES) private companyUseCases: CompanyUseCases,
  ) {}

  async execute(command: CreateCompanyCommand): Promise<CreateCompanyDTO> {
    const { companyData } = command;
    return await this.companyUseCases.createCompany(companyData);
  }
}
