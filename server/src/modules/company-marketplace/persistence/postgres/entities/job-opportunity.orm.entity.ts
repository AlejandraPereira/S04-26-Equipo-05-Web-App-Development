import { Entity, PrimaryColumn, Column } from 'typeorm';
import { OpportunityStatus } from '../../../core/entities/job-opportunity/OpportunityStatus';

@Entity('job_opportunities')
export class JobOpportunityOrmEntity {
  @PrimaryColumn('uuid', { name: 'id' })
  id!: string;

  @Column({ name: 'company_id' })
  companyId!: string;

  @Column({ name: 'title' })
  title!: string;

  @Column({ type: 'text', name: 'description' })
  description!: string;

  @Column({ name: 'location' })
  location!: string;

  @Column({ type: 'boolean', name: 'is_remote', default: false })
  isRemote!: boolean;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'min_salary' })
  minSalary!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'max_salary' })
  maxSalary!: number;

  @Column({
    type: 'enum',
    enum: OpportunityStatus,
    default: OpportunityStatus.DRAFT,
    name: 'status',
  })
  status!: OpportunityStatus;

  @Column({ type: 'timestamp', name: 'published_at' })
  publishedAt!: Date;

  @Column({ type: 'timestamp', name: 'expires_at' })
  expiresAt!: Date;
}
