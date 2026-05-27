import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { JobOpportunityOrmEntity } from './job-opportunity.orm.entity';
import { UserOrmEntity } from '../../../../auth/persistence/postgres/entities/user.orm.entity';

export enum ApplicationStatus {
  PENDING = 'PENDING',
  REVIEWED = 'REVIEWED',
  INTERVIEW = 'INTERVIEW',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

@Entity('job_applications')
export class JobApplicationOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ name: 'job_id' })
  jobId!: string;

  @ManyToOne(() => JobOpportunityOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'job_id' })
  job!: JobOpportunityOrmEntity;

  @Column({ name: 'user_id' })
  userId!: string;

  @ManyToOne(() => UserOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserOrmEntity;

  @Column({ type: 'text', name: 'cover_letter', nullable: true })
  coverLetter!: string | null;

  @Column({ type: 'enum', enum: ApplicationStatus, default: ApplicationStatus.PENDING })
  status!: ApplicationStatus;

  @CreateDateColumn({ name: 'applied_at' })
  appliedAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
