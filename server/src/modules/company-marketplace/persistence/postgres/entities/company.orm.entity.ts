import { Entity, PrimaryColumn, Column } from 'typeorm';
import { CompanyStatus } from '../../../core/entities/company/CompanyStatus';

@Entity('companies')
export class CompanyOrmEntity {
  @PrimaryColumn('uuid', { name: 'id' })
  id!: string;

  @Column({ name: 'user_id' })
  userId!: string;

  @Column({ name: 'legal_name' })
  legalName!: string;

  @Column({ name: 'industry' })
  industry!: string;

  @Column({ type: 'int', name: 'employee_count', default: 1 })
  employeeCount!: number;

  @Column({ name: 'website_url', nullable: true })
  webSiteUrl!: string | null;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column({ nullable: true })
  location!: string | null;

  @Column({ name: 'linkedin_url', nullable: true })
  linkedinUrl!: string | null;

  @Column({
    type: 'enum',
    enum: CompanyStatus,
    default: CompanyStatus.ACTIVE,
    name: 'company_status',
  })
  companyStatus!: CompanyStatus;

  @Column({ type: 'timestamp', nullable: true, name: 'verified_at' })
  verifiedAt!: Date | null;
}
