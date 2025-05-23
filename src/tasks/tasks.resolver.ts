import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class TasksResolver {
    @Query(() => String)
    pingTask(): string {
        return 'pong from tasks resolver';
    }
}
