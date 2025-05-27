import { Field, ObjectType } from '@nestjs/graphql';
import { Task } from 'src/tasks/task.entity';
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@ObjectType()
@Entity()
export class User {
    @Field(() => String)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field(() => String)
    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    hashedRefreshToken: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Task, (task) => task.user)
    tasks: Task[];
}
