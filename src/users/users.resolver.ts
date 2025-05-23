import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class UsersResolver {
    @Query(() => String)
    ping(): string {
        return 'pong from users resolver';
    }
}
