import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { User } from 'src/users/user.entity';

export enum TaskStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
}

@ObjectType()
@Entity()
export class Task {
    @Field(() => String)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Column()
    title: string;

    @Field()
    @Column()
    description: string;

    @Field(() => String)
    @Column({
        type: 'enum',
        enum: TaskStatus,
        default: TaskStatus.PENDING,
    })
    status: TaskStatus;

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.tasks, { eager: false })
    user: User;
}
