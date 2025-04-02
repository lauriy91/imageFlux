import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Task {
  @PrimaryGeneratedColumn("uuid")
  taskId: string;

  @Column()
  status: string;

  @Column("decimal")
  price: number;

  @Column()
  originalPath: string;

  @Column("json")
  images: Array<{ resolution: string; path: string }>;

  @Column({ nullable: true })
  imagePath: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}