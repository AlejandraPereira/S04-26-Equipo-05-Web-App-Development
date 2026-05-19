import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Query,
} from '@nestjs/common';
import { CompanyDTO } from 'src/modules/company-marketplace/core/entities/company/dto/Company.dto';
import { Paginated } from 'src/modules/company-marketplace/core/shared/helpers/paginated.helper';
import { CreateCompanyDTO } from 'src/modules/company-marketplace/core/entities/company/dto/CreateCompany.dto';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateCompanyCommand } from 'src/modules/company-marketplace/core/use-cases/entrypoint/commands/company/create-company/CreateCompany.command';
import { GetCompaniesQuery } from 'src/modules/company-marketplace/core/use-cases/entrypoint/queries/company/get-companies/GetCompany.query';

@Controller('company')
export class CompanyController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Post('create')
  async createCompany(
    @Body() companyData: CreateCompanyDTO,
  ): Promise<CreateCompanyDTO> {
    try {
      const result = await this.commandBus.execute(
        new CreateCompanyCommand(companyData),
      );
      return result;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to create company');
    }
  }

  @Get('list')
  async getCompanies(
    @Query('page') page: number = 1,
    @Query('size') size: number = 10,
  ): Promise<Paginated<CompanyDTO>> {
    try {
      const result = await this.queryBus.execute(
        new GetCompaniesQuery(page, size),
      );
      return result;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to get companies');
    }
  }
}
