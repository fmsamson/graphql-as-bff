import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserInput } from '../../model/input/__sample/user-input.model';
import { User } from '../../model/graph/__sample/user.model';

@Resolver()
export class MutationResolver {
    @Mutation(() => User)
    createUser(@Args('userInput') userInput: UserInput) {
        return { id: 123 };
    }
}
