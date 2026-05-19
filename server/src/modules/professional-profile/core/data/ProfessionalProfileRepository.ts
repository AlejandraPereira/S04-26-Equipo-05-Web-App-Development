import { ProfessionalProfileDTO } from '../entities/professional-profile/dto/ProfessionalProfile.dto';

export interface ProfessionalProfileRepository {
  save(profile: ProfessionalProfileDTO): Promise<ProfessionalProfileDTO>;

  update(
    id: string,
    profile: Partial<ProfessionalProfileDTO>,
  ): Promise<ProfessionalProfileDTO>;

  findById(id: string): Promise<ProfessionalProfileDTO | null>;

  findByUserId(userId: string): Promise<ProfessionalProfileDTO | null>;
}
