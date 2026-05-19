import { UpdateProfessionalProfileDTO } from 'src/modules/professional-profile/core/entities/professional-profile/dto/UpdateProfessionalProfile.dto';

export class UpdateProfessionalProfileCommand {
  constructor(
    public id: string,
    public profileData: UpdateProfessionalProfileDTO,
  ) {}
}
