import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class TasksResolver {
    @Query(() => String)
    ping(): string {
        return 'pong from tasks resolver';
    }
}
