import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ProfessionalProfileUseCases } from '../../../../ProfessionalProfileUseCases';
import { CreateProfessionalProfileCommand } from './CreateProfessionalProfile.command';
import { CreateProfessionalProfileDTO } from 'src/modules/professional-profile/core/entities/professional-profile/dto/CreateProfessionalProfile.dto';
import { PROFESSIONAL_PROFILE_USE_CASES } from 'src/modules/professional-profile/shared/constants';

@CommandHandler(CreateProfessionalProfileCommand)
export class CreateProfessionalProfileHandler implements ICommandHandler<CreateProfessionalProfileCommand> {
  constructor(
    @Inject(PROFESSIONAL_PROFILE_USE_CASES)
    private professionalProfileUseCases: ProfessionalProfileUseCases,
  ) {}

  async execute(
    command: CreateProfessionalProfileCommand,
  ): Promise<CreateProfessionalProfileDTO> {
    const { profileData } = command;

    const result =
      await this.professionalProfileUseCases.createProfile(profileData);

    return result;
  }
}
