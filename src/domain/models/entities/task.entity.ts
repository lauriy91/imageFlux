import { PathResponse } from 'src/application/models/interfaces';
import { ObjectId } from "mongodb";
import { Entity, Column, CreateDateColumn, ObjectIdColumn, UpdateDateColumn, Index } from "typeorm";

@Entity("tasks")
export class Task {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Index()
  @Column({ default: "pending", nullable: false })
  status: string;

  @Index()
  @Column("decimal")
  price: number;

  @Column("json", { nullable: true }) 
  images: PathResponse[];

  @Column({ nullable: true })
  originalPath: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}