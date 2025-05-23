import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class AuthResolver {
    @Query(() => String)
    ping(): string {
        return 'pong from auth resolver';
    }
}
