import { CreateProfessionalProfileDTO } from 'src/modules/professional-profile/core/entities/professional-profile/dto/CreateProfessionalProfile.dto';

export class CreateProfessionalProfileCommand {
  constructor(public profileData: CreateProfessionalProfileDTO) {}
}
