import { ProfessionalProfileRepository } from '../data/ProfessionalProfileRepository';
import { ProfessionalProfile } from '../entities/professional-profile/ProfessionalProfile.entity';
import { CreateProfessionalProfileDTO } from '../entities/professional-profile/dto/CreateProfessionalProfile.dto';
import { UpdateProfessionalProfileDTO } from '../entities/professional-profile/dto/UpdateProfessionalProfile.dto';
import { ProfessionalProfileDTO } from '../entities/professional-profile/dto/ProfessionalProfile.dto';

export interface ProfessionalProfileUseCasesProvider {
  createProfile(
    profileData: CreateProfessionalProfileDTO,
  ): Promise<ProfessionalProfileDTO>;

  updateProfile(
    id: string,
    profileData: UpdateProfessionalProfileDTO,
  ): Promise<ProfessionalProfileDTO>;

  getProfileByUserId(userId: string): Promise<ProfessionalProfileDTO | null>;
}

export class ProfessionalProfileUseCases {
  constructor(
    private professionalProfileRepository: ProfessionalProfileRepository,
  ) {}

  async createProfile(
    profileData: CreateProfessionalProfileDTO,
  ): Promise<ProfessionalProfileDTO> {
    const newProfile = ProfessionalProfile.create(profileData);

    await this.professionalProfileRepository.save(newProfile);

    return newProfile;
  }

  async updateProfile(
    id: string,
    profileData: UpdateProfessionalProfileDTO,
  ): Promise<ProfessionalProfileDTO> {
    const existingProfile =
      await this.professionalProfileRepository.findById(id);

    if (!existingProfile) {
      throw new Error('Professional profile not found');
    }

    const updatedProfile = {
      ...existingProfile,
      ...profileData,
      lastUpdated: new Date(),
    };

    return this.professionalProfileRepository.update(id, updatedProfile);
  }

  async getProfileByUserId(
    userId: string,
  ): Promise<ProfessionalProfileDTO | null> {
    return this.professionalProfileRepository.findByUserId(userId);
  }
}
