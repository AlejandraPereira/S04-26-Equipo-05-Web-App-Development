import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ProfessionalProfileUseCases } from '../../../ProfessionalProfileUseCases';
import { GetProfessionalProfileQuery } from './GetProfessionalProfile.query';
import { ProfessionalProfileDTO } from 'src/modules/professional-profile/core/entities/professional-profile/dto/ProfessionalProfile.dto';
import { PROFESSIONAL_PROFILE_USE_CASES } from 'src/modules/professional-profile/shared/constants';

@QueryHandler(GetProfessionalProfileQuery)
export class GetProfessionalProfileHandler implements IQueryHandler<GetProfessionalProfileQuery> {
  constructor(
    @Inject(PROFESSIONAL_PROFILE_USE_CASES)
    private professionalProfileUseCases: ProfessionalProfileUseCases,
  ) {}

  async execute(
    query: GetProfessionalProfileQuery,
  ): Promise<ProfessionalProfileDTO | null> {
    const { userId } = query;

    const result =
      await this.professionalProfileUseCases.getProfileByUserId(userId);

    return result;
  }
}
