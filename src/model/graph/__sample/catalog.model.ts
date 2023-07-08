import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Catalog {

    @Field(() => Int)
        id: number;

    @Field(() => String)
        name: string;
}
