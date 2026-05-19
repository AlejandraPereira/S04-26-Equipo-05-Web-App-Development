import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

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

  @CreateDateColumn({
    name: 'last_updated',
    type: 'timestamptz',
  })
  lastUpdated!: Date;
}
