import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class LoginResponse {
    @Field()
    success: boolean;

    @Field()
    message: string;
}
