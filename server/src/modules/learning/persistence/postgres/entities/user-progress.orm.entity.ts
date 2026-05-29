import { Entity, PrimaryColumn, Column, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserOrmEntity } from '../../../../auth/persistence/postgres/entities/user.orm.entity';
import { CourseOrmEntity } from './course.orm.entity';

@Entity('user_course_progress')
export class UserProgressOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ name: 'user_id' })
  userId!: string;

  @ManyToOne(() => UserOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: UserOrmEntity;

  @Column({ name: 'course_id' })
  courseId!: string;

  @ManyToOne(() => CourseOrmEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'course_id' })
  course!: CourseOrmEntity;

  @Column({ type: 'int', default: 0 })
  progress!: number;

  @Column({ type: 'jsonb', default: [] })
  completedLessons!: number[];

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
