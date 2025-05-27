import { InputType, Field } from '@nestjs/graphql';
import { TaskStatus } from '../task.entity';

@InputType()
export class UpdateTaskInput {
    @Field({ nullable: true })
    title?: string;

    @Field({ nullable: true })
    description?: string;

    @Field(() => String, { nullable: true })
    status?: TaskStatus;
}
