import { CreateCompanyDTO } from 'src/modules/company-marketplace/core/entities/company/dto/CreateCompany.dto';

export class CreateCompanyCommand {
  constructor(public companyData: CreateCompanyDTO) {}
}
