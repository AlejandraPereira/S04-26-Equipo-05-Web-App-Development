import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ProfessionalProfileUseCases } from '../../../../ProfessionalProfileUseCases';
import { UpdateProfessionalProfileCommand } from './UpdateProfessionalProfile.command';
import { ProfessionalProfileDTO } from 'src/modules/professional-profile/core/entities/professional-profile/dto/ProfessionalProfile.dto';
import { PROFESSIONAL_PROFILE_USE_CASES } from 'src/modules/professional-profile/shared/constants';

@CommandHandler(UpdateProfessionalProfileCommand)
export class UpdateProfessionalProfileHandler implements ICommandHandler<UpdateProfessionalProfileCommand> {
  constructor(
    @Inject(PROFESSIONAL_PROFILE_USE_CASES)
    private professionalProfileUseCases: ProfessionalProfileUseCases,
  ) {}

  async execute(
    command: UpdateProfessionalProfileCommand,
  ): Promise<ProfessionalProfileDTO> {
    const { id, profileData } = command;

    const result = await this.professionalProfileUseCases.updateProfile(
      id,
      profileData,
    );

    return result;
  }
}
