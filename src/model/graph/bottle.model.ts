import { Field, ObjectType } from '@nestjs/graphql';
import { Milk } from './milk.model';

@ObjectType()
export class Bottle {
    @Field(() => String)
    name: string;
    @Field(() => String)
    status: string;
    @Field(() => Milk)
    milk: Milk;
}