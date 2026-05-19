import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProfessionalProfileRepository } from 'src/modules/professional-profile/core/data/ProfessionalProfileRepository';
import { ProfessionalProfileDTO } from 'src/modules/professional-profile/core/entities/professional-profile/dto/ProfessionalProfile.dto';
import { ProfessionalProfileOrmEntity } from '../entities/professional-profile.orm.entity';

export class PostgresProfessionalProfileRepository implements ProfessionalProfileRepository {
  constructor(
    @InjectRepository(ProfessionalProfileOrmEntity)
    private readonly repository: Repository<ProfessionalProfileOrmEntity>,
  ) {}

  async save(profile: ProfessionalProfileDTO): Promise<ProfessionalProfileDTO> {
    const entity = this.repository.create(profile);

    const savedEntity = await this.repository.save(entity);

    return savedEntity as ProfessionalProfileDTO;
  }

  async update(
    id: string,
    profile: Partial<ProfessionalProfileDTO>,
  ): Promise<ProfessionalProfileDTO> {
    await this.repository.update(id, profile);

    const updatedEntity = await this.repository.findOne({
      where: { id },
    });

    if (!updatedEntity) {
      throw new Error('Professional profile not found');
    }

    return updatedEntity as ProfessionalProfileDTO;
  }

  async findById(id: string): Promise<ProfessionalProfileDTO | null> {
    const entity = await this.repository.findOne({
      where: { id },
    });

    return entity ? (entity as ProfessionalProfileDTO) : null;
  }

  async findByUserId(userId: string): Promise<ProfessionalProfileDTO | null> {
    const entity = await this.repository.findOne({
      where: { userId },
    });

    return entity ? (entity as ProfessionalProfileDTO) : null;
  }
}
