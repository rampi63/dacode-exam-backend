import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Task } from '../task.entity';

@ObjectType()
export class PaginatedTasks {
    @Field(() => [Task])
    tasks: Task[];

    @Field(() => Int)
    total: number;
}
