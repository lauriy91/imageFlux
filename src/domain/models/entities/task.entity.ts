import { ObjectId } from "mongodb";
import { Entity, Column, CreateDateColumn, ObjectIdColumn, UpdateDateColumn, Index } from "typeorm";

@Entity("tasks")
export class Task {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Index({ unique: true })
  @ObjectIdColumn()
  taskId!: string;

  @Index()
  @Column({ default: "pending", nullable: false })
  status: string;

  @Index()
  @Column("decimal")
  price: number;

  @Column("json", { nullable: true }) 
  images: Array<{ resolution: string; path: string }>;

  @Column({ nullable: true })
  originalPath: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}