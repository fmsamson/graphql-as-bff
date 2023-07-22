import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class BottleInput {
    @Field(() => Boolean)
    isEmpty: boolean;
    @Field(() => String)
    type: string;
}