import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('courses')
export class CourseOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column()
  level!: string;

  @Column()
  duration!: string;

  @Column({ name: 'modules_count', type: 'int' })
  modulesCount!: number;

  @Column({ type: 'jsonb' })
  skills!: string[];

  @Column({ default: '📘' })
  emoji!: string;

  @Column({ type: 'jsonb', nullable: true })
  lessons!: any[] | null;

  @Column({ type: 'jsonb', nullable: true })
  quiz!: any | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
