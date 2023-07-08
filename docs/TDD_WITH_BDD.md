<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [TDD with BDD](#tdd-with-bdd)
  - [Sample Business Requirement](#sample-business-requirement)
  - [Creating an Input Type from the requirement](#creating-an-input-type-from-the-requirement)
  - [Creating a Mutation query with variables](#creating-a-mutation-query-with-variables)
  - [Creating the resolver](#creating-the-resolver)
  - [Lastly, satisfy the expected result](#lastly-satisfy-the-expected-result)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## TDD with BDD
In this section we are going to create the GraphQL `resolvers` with **Test Driven Development (TDD)** approach.
And at the same time, we are going to structure our test in a **Behavioral Driven Development (BDD)** manner.

Both TDD and BDD requires the developer to create the test first before doing the implementation based on failure.
The key difference between TDD and BDD is that TDD focuses on technical needs while BDD focuses on achieving the business needs.
Also, we use BDD approach in our test given only the TDD tools.

### Sample Business Requirement
Imagine that you will be given the following requirement.
```gherkin
Scenario: Customer saves user information
  
Given the Customer has filled in the user information
When the Customer clicks save
Then the Customer receives the Id of the user created
```

In this example, we will need to create a Graphql mutation query.
First thing to do is to create a test file.
We will name the file `createuser.e2e-spec.ts` and place it under `test/__sample/mutation` folder.

Then we will prepare the base test by initializing and closing the Test Module.
```typescript
describe('createUser Mutation', () => {
    beforeAll(async () => {
        await initializeTestingModule();
    });
    afterAll(async () => {
        await closeTestingModule();
    });
});
```
Inside it, we create the structure of the test based on the requirement given.
```typescript
    it('should create user and return the id', async () => {
        // Given
        // When
        // Then
    });
```

### Creating an Input Type from the requirement
In the `Given` statement, we are given a hint that the request will provide a user information, we will just call the object `UserInput`.
We will then need to create a `UserInput` object with sample data.
```typescript
const userInput: UserInput = {
    name: 'John',
    lastname: 'Doe',
}
```
At this point, `UserInput` object does not exist yet. 
We will then create a `UserInput` object in `src` folder.
Let's create a folder `model` and create a file `user-input.model.ts`.
Then we export a class `UserInput` and it should look like the following
```typescript
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class UserInput {
    @Field()
    name: string;
    @Field()
    lastname: string;
}
```
Going back to our `createuser.e2e-spec.ts`, import the `UserInput` class that we just created.
The test file at this point should look like the following.
```typescript
import { closeTestingModule, initializeTestingModule } from '../testUtils';
import { UserInput } from '../../src/model/input/__sample/user-input.model';

describe('createUser Mutation', () => {
    beforeAll(async () => {
        await initializeTestingModule();
    });
    afterAll(async () => {
        await closeTestingModule();
    });

    it('should create user and return the id', async () => {
        // Given
        const userInput: UserInput = {
            name: 'John',
            lastname: 'Doe',
        };

        // When
        // Then
    });
});
```

### Creating a Mutation query with variables
At this point, we are now about to call the GraphQL application to submit our input.
The GraphQL mutation query with a variable from our sample requirement will look like the following.
```text
mutation createUser($userVariable: UserInput!) {
    createUser(userInput: $userVariable)
}
```
In the query above, we should have a resolver for `createUser`. 
The declaratiion line `createUser($userVariable: UserInput!)` indicates that when we call the resolver, we are going to provide a `userVariable` variable with a non-null type `UserInput`. 
Then, inside the body of the declaration, we call the `createUser` mutation query in which the argument `userInput` will have the value from the variable `userVariable`. 

Back to the `createuser.e2e-spec.ts`, we are going to prepare our query data with the variable that will be submitted to the GraphL application.
The following is how the query data will look like.
```typescript
const queryData = {
    query: `mutation createUser($userVariable: UserInput!) {
        createUser(userInput: $userVariable)
    }`,
    variables: { userVariable: userInput },
};
```
Notice that we use the `userInput` test data that we created earlier as the value for the `userVariable`.

Then, we proceed to the `When` part. 
At this point, we call the GrapQL application with our given query data.
It should look like the following.
```typescript
const response = await request(testApp.getHttpServer()).post(gql).send(queryData);
```
The current state of our `createuser.e2e-spec.ts` should look like the following.
```typescript
import { closeTestingModule, gql, initializeTestingModule, testApp } from '../testUtils';
import { UserInput } from '../../src/model/input/__sample/user-input.model';
import * as request from 'supertest';

describe('createUser Mutation', () => {
    beforeAll(async () => {
        await initializeTestingModule();
    });
    afterAll(async () => {
        await closeTestingModule();
    });

    it('should create user and return the id', async () => {
        // Given
        const userInput: UserInput = {
            name: 'John',
            lastname: 'Doe',
        };
        const queryData = {
            query: `mutation createUser($userVariable: UserInput!) {
                createUser(userInput: $userVariable)
            }`,
            variables: { userVariable: userInput },
        };

        // When
        const response = await request(testApp.getHttpServer()).post(gql).send(queryData);

        // Then
    });
});
```

### Creating the resolver
On the previous step, we have already prepared the call to the GraphQL application 
but our resolver does not exist yet.
In the `createuser.e2e-spec.ts`, add an expectation where the response error is falsy.
```typescript
// Then
expect(response.error).toBeFalsy();
```
Run the test by executing `yarn run test:e2e`, we should expect that the test will fail.

The next goal is to pass the test by creating a resolver.
In the `src` folder, create a file `__sample/mutation/mutation.resolver.ts`.
Then copy the code below to the file.
```typescript
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserInput } from '../model/input/__sample/user-input.model';

@Resolver()
export class MutationResolver {
    @Mutation(() => String)
    createUser(@Args('userInput') userInput: UserInput) {
        return 'success';
    }
}
```
Notice that `@Mutation(() => String)` returns a `String` for the meantime with the hardcoded value `success`.
Since this is a new resolver we have to register this in the `provider.module.ts`.
The current state of the `ProviderModule` will look like the following.
```typescript
import { QueryResolver } from './__sample/query/query.resolver';
import { MutationResolver } from './__sample/mutation/mutation.resolver';

@Module({
    providers: [QueryResolver, MutationResolver],
})
export class ProviderModule {}
```
Run the test by executing `yarn run test:e2e`, at this point the test should pass.
Also, check the `schema.gql`, your input type and the mutation type are already declared in there!

### Lastly, satisfy the expected result
We are now almost there to complete our test!
We will need to return the ID of the user once it is created.

Going back to the test (`createuser.e2e-spec.ts`), we add the expected result.
```typescript
const expectedResult: User = { id: 123 }
```
The type `User` of our expectedResult does not exist yet.

Next thing to do is to create an `ObjectType` model of the expectedResult.
This will represent the Graph object.

In the `model` folder, create a file called `user.model.ts`.
In here, we are going to export a class called `User` as our Graph Object Type.
```typescript
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
    @Field(() => Int)
    id: number;
}
```
Then import the newly created `ObectType` inside the test.
Then add the additional expectation.
```typescript
expect(response.body.data?.createUser).toStrictEqual(expectedResult);
```
Run the test by executing `yarn run test:e2e`, at this point the test still fail.
This is because we need to modify the resolver.
Go to the `mutation.resolver.ts` and modify the return object to `User` instead of `String`.
The resolver should look like the following.
```typescript
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserInput } from '../model/input/__sample/user-input.model';
import { User } from '../model/graph/__sample/user.model';

@Resolver()
export class MutationResolver {
    @Mutation(() => User)
    createUser(@Args('userInput') userInput: UserInput) {
        return { id: 123 };
    }
}
```

We are not yet done, we also need to modify the query data in such a way 
it will instruct GraphQL application to return specific field.
The query will be like the following.
```text
mutation createUser($userVariable: UserInput!) {
    createUser(userInput: $userVariable) {
        id
    }
}
```
We will then have the following content for our `createuser.e2e-spec.ts` test.
```typescript
import { closeTestingModule, gql, initializeTestingModule, testApp } from '../testUtils';
import { UserInput } from '../../src/model/input/__sample/user-input.model';
import * as request from 'supertest';
import { User } from '../../src/model/graph/__sample/user.model';

describe('createUser Mutation', () => {
  beforeAll(async () => {
    await initializeTestingModule();
  });
  afterAll(async () => {
    await closeTestingModule();
  });

  it('should create user and return the id', async () => {
    // Given
    const userInput: UserInput = {
      name: 'John',
      lastname: 'Doe',
    };
    const queryData = {
      query: `mutation createUser($userVariable: UserInput!) {
                createUser(userInput: $userVariable) {
                    id
                }
            }`,
      variables: { userVariable: userInput },
    };
    const expectedResult: User = { id: 123 };

    // When
    const response = await request(testApp.getHttpServer()).post(gql).send(queryData);

    // Then
    expect(response.error).toBeFalsy();
    expect(response.body.data?.createUser).toStrictEqual(expectedResult);
  });
});
```

Run the test by executing `yarn run test:e2e`.
We should expect at this point that all tests are pass.
Also, our `schema.gql` is updated accordingly with the changes!
