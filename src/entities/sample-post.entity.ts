import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('sample_posts')
export class SamplePost {
  @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
  id: number;

  @Column({ type: 'character varying' })
  title: string;

  @Column({ type: 'character varying' })
  content: string;

  @CreateDateColumn({
    name: 'inserted_at',
    type: 'timestamp without time zone',
  })
  insertedAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp without time zone' })
  updatedAt: Date;

  constructor(title: string, content: string, insertedAt: Date = new Date()) {
    this.title = title;
    this.content = content;
    this.insertedAt = insertedAt;
    this.updatedAt = insertedAt;
  }
}
