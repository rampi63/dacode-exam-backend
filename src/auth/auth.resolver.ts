import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class AuthResolver {
    @Query(() => String)
    pingAuth(): string {
        return 'pong from auth resolver';
    }
}
