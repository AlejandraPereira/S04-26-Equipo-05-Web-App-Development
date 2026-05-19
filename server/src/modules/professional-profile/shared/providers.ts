import { Provider } from '@nestjs/common';
import { ProfessionalProfileRepository } from '../core/data/ProfessionalProfileRepository';
import { ProfessionalProfileUseCases } from '../core/use-cases/ProfessionalProfileUseCases';
import { PostgresProfessionalProfileRepository } from '../persistence/postgres/repositories/postgres.professional-profile.repository';
import { CreateProfessionalProfileHandler } from '../core/use-cases/entrypoint/commands/profile/create-profile/CreateProfessionalProfile.handler';
import { UpdateProfessionalProfileHandler } from '../core/use-cases/entrypoint/commands/profile/update-profile/UpdateProfessionalProfile.handler';
import { GetProfessionalProfileHandler } from '../core/use-cases/entrypoint/queries/get-professional-profile/GetProfessionalProfile.handler';

import {
  PROFESSIONAL_PROFILE_REPOSITORY,
  PROFESSIONAL_PROFILE_USE_CASES,
} from './constants';

const ProfessionalProfileRepositoryCustomProvider = {
  provide: PROFESSIONAL_PROFILE_REPOSITORY,

  useClass: PostgresProfessionalProfileRepository,
};

const ProfessionalProfileUseCasesProviderCustomProvider = {
  provide: PROFESSIONAL_PROFILE_USE_CASES,

  useFactory: (
    professionalProfileRepository: ProfessionalProfileRepository,
  ) => {
    return new ProfessionalProfileUseCases(professionalProfileRepository);
  },

  inject: [PROFESSIONAL_PROFILE_REPOSITORY],
};

const professionalProfileHandlers = [
  CreateProfessionalProfileHandler,

  UpdateProfessionalProfileHandler,

  GetProfessionalProfileHandler,
];

export const ProfessionalProfileProviders: Provider[] = [
  ProfessionalProfileRepositoryCustomProvider,

  ProfessionalProfileUseCasesProviderCustomProvider,

  ...professionalProfileHandlers,
];
