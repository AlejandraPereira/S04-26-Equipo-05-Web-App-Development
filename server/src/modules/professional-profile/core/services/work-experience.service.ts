import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {
  ProfessionalProfileOrmEntity,
  WorkExperienceEntry,
} from '../../persistence/postgres/entities/professional-profile.orm.entity';
import { UserOrmEntity } from '../../../auth/persistence/postgres/entities/user.orm.entity';

@Injectable()
export class WorkExperienceService {
  constructor(
    @InjectRepository(ProfessionalProfileOrmEntity)
    private readonly repo: Repository<ProfessionalProfileOrmEntity>,
    @InjectRepository(UserOrmEntity)
    private readonly userRepo: Repository<UserOrmEntity>,
  ) {}

  async getWorkExperiences(userId: string): Promise<WorkExperienceEntry[]> {
    const profile = await this.repo.findOneBy({ userId });
    return profile?.workExperiences ?? [];
  }

  async saveWorkExperiences(
    userId: string,
    entries: Omit<WorkExperienceEntry, 'id'>[],
  ): Promise<WorkExperienceEntry[]> {
    const profile = await this.repo.findOneBy({ userId });
    if (!profile) throw new NotFoundException('Perfil no encontrado');

    const withIds: WorkExperienceEntry[] = entries.map((e) => ({
      id: (e as any).id ?? uuidv4(),
      ...e,
    }));

    profile.workExperiences = withIds;
    const saved = await this.repo.save(profile);
    return saved.workExperiences;
  }

  /** Public aggregated profile — no auth required */
  async getPublicProfile(userId: string) {
    const [profile, user] = await Promise.all([
      this.repo.findOneBy({ userId }),
      this.userRepo.findOneBy({ id: userId }),
    ]);

    if (!profile && !user) throw new NotFoundException('Perfil no encontrado');

    return {
      userId,
      fullName: user?.fullName ?? 'Profesional',
      username: profile?.username ?? null,
      headline: profile?.headline ?? null,
      summary: profile?.summary ?? null,
      location: profile?.location ?? null,
      yearsExperience: profile?.yearsExperience ?? null,
      linkedinUrl: profile?.linkedinUrl ?? null,
      completionScore: profile?.completionScore ?? 0,
      workExperiences: profile?.workExperiences ?? [],
    };
  }
}
