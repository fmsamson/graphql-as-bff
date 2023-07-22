import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Milk {
    @Field(() => String)
    name: string;
}