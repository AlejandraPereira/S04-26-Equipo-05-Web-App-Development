import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateProfessionalProfileDTO } from 'src/modules/professional-profile/core/entities/professional-profile/dto/CreateProfessionalProfile.dto';
import { ProfessionalProfileDTO } from 'src/modules/professional-profile/core/entities/professional-profile/dto/ProfessionalProfile.dto';
import { CreateProfessionalProfileCommand } from 'src/modules/professional-profile/core/use-cases/entrypoint/commands/profile/create-profile/CreateProfessionalProfile.command';
import { GetProfessionalProfileQuery } from 'src/modules/professional-profile/core/use-cases/entrypoint/queries/get-professional-profile/GetProfessionalProfile.query';
import { UpdateProfessionalProfileDTO } from 'src/modules/professional-profile/core/entities/professional-profile/dto/UpdateProfessionalProfile.dto';
import { UpdateProfessionalProfileCommand } from 'src/modules/professional-profile/core/use-cases/entrypoint/commands/profile/update-profile/UpdateProfessionalProfile.command';

@Controller('professional-profile')
export class ProfessionalProfileController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Post('create')
  async createProfessionalProfile(
    @Body() profileData: CreateProfessionalProfileDTO,
  ): Promise<CreateProfessionalProfileDTO> {
    try {
      const result = await this.commandBus.execute(
        new CreateProfessionalProfileCommand(profileData),
      );

      return result;
    } catch (error) {
      console.error(error);

      throw new InternalServerErrorException(
        'Failed to create professional profile',
      );
    }
  }

  @Patch(':id')
  async updateProfessionalProfile(
    @Param('id') id: string,
    @Body() profileData: UpdateProfessionalProfileDTO,
  ): Promise<ProfessionalProfileDTO> {
    try {
      const result = await this.commandBus.execute(
        new UpdateProfessionalProfileCommand(id, profileData),
      );

      return result;
    } catch (error) {
      console.error(error);

      throw new InternalServerErrorException(
        'Failed to update professional profile',
      );
    }
  }

  @Get(':userId')
  async getProfessionalProfile(
    @Param('userId') userId: string,
  ): Promise<ProfessionalProfileDTO | null> {
    try {
      const result = await this.queryBus.execute(
        new GetProfessionalProfileQuery(userId),
      );

      return result;
    } catch (error) {
      console.error(error);

      throw new InternalServerErrorException(
        'Failed to get professional profile',
      );
    }
  }
}
