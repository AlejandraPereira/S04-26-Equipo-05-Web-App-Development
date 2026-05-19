import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CompanyUseCases } from '../../../../CompanyUseCases';
import { GetCompaniesQuery } from './GetCompany.query';
import { CompanyDTO } from 'src/modules/company-marketplace/core/entities/company/dto/Company.dto';
import { Paginated } from 'src/modules/company-marketplace/core/shared/helpers/paginated.helper';
import { COMPANY_USE_CASES } from 'src/modules/company-marketplace/shared/constants';

@QueryHandler(GetCompaniesQuery)
export class GetCompaniesHandler implements IQueryHandler<GetCompaniesQuery> {
  constructor(
    @Inject(COMPANY_USE_CASES) private companyUseCases: CompanyUseCases,
  ) {}

  async execute(query: GetCompaniesQuery): Promise<Paginated<CompanyDTO>> {
    const { page, size } = query;
    const result = await this.companyUseCases.getCompanies({ page, size });
    return result;
  }
}
