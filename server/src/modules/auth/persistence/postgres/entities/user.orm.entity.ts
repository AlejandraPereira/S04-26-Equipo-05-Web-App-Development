import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum UserRole {
  PROFESIONAL = 'profesional',
  EMPRESA = 'empresa',
}

@Entity('users')
export class UserOrmEntity {
  @PrimaryColumn('uuid', { name: 'id' })
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ name: 'password_hash' })
  passwordHash!: string;

  @Column({ name: 'full_name' })
  fullName!: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.PROFESIONAL })
  role!: UserRole;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
