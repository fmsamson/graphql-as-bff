import { Args, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class QueryResolver {

  @Query(() => String)
    sayHello(@Args('name', { nullable: true, type: () => String }) name: string): string {
        return `Hello ${name ?? 'World'}!`;
    }
}
