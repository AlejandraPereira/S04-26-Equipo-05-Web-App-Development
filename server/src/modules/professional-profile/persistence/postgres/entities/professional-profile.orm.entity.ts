import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export interface WorkExperienceEntry {
  id: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string | null;
  description: string;
}

@Entity('professional_profiles')
export class ProfessionalProfileOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({
    name: 'user_id',
    type: 'uuid',
    unique: true,
  })
  userId!: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  username?: string;

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true,
  })
  headline?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  summary?: string;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  location?: string;

  @Column({
    name: 'years_experience',
    type: 'int',
    nullable: true,
  })
  yearsExperience?: number;

  @Column({
    name: 'linkedin_url',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  linkedinUrl?: string;

  @Column({
    name: 'completion_score',
    type: 'float',
    default: 0,
  })
  completionScore!: number;

  @Column({
    name: 'work_experiences',
    type: 'jsonb',
    nullable: true,
    default: [],
  })
  workExperiences!: WorkExperienceEntry[];

  @CreateDateColumn({
    name: 'last_updated',
    type: 'timestamptz',
  })
  lastUpdated!: Date;
}
