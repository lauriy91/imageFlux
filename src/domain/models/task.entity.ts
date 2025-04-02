import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm";

@Entity("tasks")
export class Task {
  @PrimaryGeneratedColumn("uuid")
  taskId!: string;

  @Column({ default: "pending", nullable: false })
  status: string;

  @Column("decimal")
  price: number;

  @Column("json", { nullable: true }) 
  images: Array<{ resolution: string; path: string }>;

  @Column({ nullable: true })
  imagePath: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt!: Date;
}