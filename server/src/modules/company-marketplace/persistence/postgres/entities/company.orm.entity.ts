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

  @Column({ type: 'int', name: 'employee_count' })
  employeeCount!: number;

  @Column({ name: 'website_url' })
  webSiteUrl!: string;

  @Column({
    type: 'enum',
    enum: CompanyStatus,
    default: CompanyStatus.PENDING_REVIEW,
    name: 'company_status',
  })
  companyStatus!: CompanyStatus;

  @Column({ type: 'timestamp', nullable: true, name: 'verified_at' })
  verifiedAt!: Date | null;
}
