import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class UsersResolver {
    @Query(() => String)
    pingUsers(): string {
        return 'pong from users resolver';
    }
}
