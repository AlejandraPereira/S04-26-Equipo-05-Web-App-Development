import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('password_reset_tokens')
export class PasswordResetTokenOrmEntity {
  @PrimaryColumn() id: string;
  @Column() userId: string;
  @Column({ unique: true }) token: string;
  @Column() expiresAt: Date;
  @Column({ default: false }) used: boolean;
  @CreateDateColumn() createdAt: Date;
}
