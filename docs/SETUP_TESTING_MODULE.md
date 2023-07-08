<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Setting-up the End-to-End Test](#setting-up-the-end-to-end-test)
  - [Create a Test Utility for Testing module](#create-a-test-utility-for-testing-module)
  - [Create a Test](#create-a-test)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## Setting-up the End-to-End Test
In this section, we are going to setup the Testing Module of NestJS to work with GraphQL.
Also, we are going to create a sample end-to-end test.

If you have followed the steps in [Setting-up the Project from scratch](SETUP_PROJECT_FROM_SCRATCH.md)
then you will have the following files already created under `test` folder.
```text
- app.e2e-spec.ts
- jest-e2e.json
```
Delete the `app.e2e-spec.ts` file since we don't need it anymore but keep the `jest-e2e.json` file.


### Create a Test Utility for Testing module
Under the `test` folder, create a file `testUtils.ts`.
And then copy the following content.
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';

export let testApp: INestApplication;
export const gql = '/graphql';

export const initializeTestingModule = async () => {
    const module: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
    }).compile();

    testApp = module.createNestApplication();
    await testApp.init();
};

export const closeTestingModule = async () => {
    await testApp.close();
};
```
The `initializeTestingModule` will compile the `TesingModule` of NestJS.
The `AppModule` imported is where we define the GraphQL setup with the Provider which contains the Resolvers of the GraphQL Application.
This will spin-up an instance of your GraphQL application for testing.

The `closeTestingModule` is to make sure that your GraphQL Application will be closed after the testing.

### Create a Test
We will now going to create a test for the existing resolver `query.resolver.ts`.
Inside the said resolver we have one query called `sayHello`.
It is up to you how you will structure your test folder, but for the sake of this guide, 
we are going to create a test file for each query and placed it under `query` folder.

Create a file `sayhello.e2e-spec.ts` file.
Inside the file, we are now going to initialize the Testing Module before each test 
and also going to close the Testing Module after each test.
So it should look like this.
```typescript
describe('sayHello Query', () => {
    beforeEach(async () => {
        await initializeTestingModule();
    });
    afterEach(async () => {
        await closeTestingModule();
    });
});
```
Take note that `initializeTestingModule` and `closeTestingModule` are from the `../testUtils`.

Next is to create a test for our sayHello query.
There will be 2 test, with an argument and without an argument.
```typescript
    it('should return Hello World', async () => {
        // Given
        const queryData = {
            query: `query { sayHello }`,
        };
        const expectedSayHello = 'Hello World!';

        // When
        const response = await request(testApp.getHttpServer())
            .post(gql).send(queryData);

        // Then
        expect(response.error).toBeFalsy();
        expect(response.body.data?.sayHello).toBe(expectedSayHello);
    });

    it('should return Hello John', async () => {
        // Given
        const nameInput = 'John';
        const queryData = {
            query: `query sayHello($nameInput: String) {
                    sayHello(name: $nameInput)
                }`,
            variables: { nameInput: nameInput },
        };
        const expectedSayHello = `Hello ${nameInput}!`;
    
        // When
        const response = await request(testApp.getHttpServer())
            .post(gql).send(queryData);
    
        // Then
        expect(response.error).toBeFalsy();
        expect(response.body.data?.sayHello).toBe(expectedSayHello);
    });
```
Notice that we are using `supertest` when creating an http request to our GraphQL Test Module.
This is already provided by NestJS out of the box.

To run the end-to-end test, execute the following command.
```shell
yarn run test:e2e
```
Another thing to notice is that, when you run the test, 
the `schema.gql` will get created/updated automatically!
