import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserOrmEntity } from '../../../../auth/persistence/postgres/entities/user.orm.entity';
import { CourseOrmEntity } from './course.orm.entity';

@Entity('quiz_results')
export class QuizResultOrmEntity {
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

  @Column({ type: 'int' })
  score!: number;

  @Column({ type: 'boolean' })
  passed!: boolean;

  @Column({ name: 'correct_count', type: 'int' })
  correctCount!: number;

  @Column({ name: 'total_questions', type: 'int' })
  totalQuestions!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
