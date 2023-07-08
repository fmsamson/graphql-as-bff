<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Setting-up Mock API for development and testing](#setting-up-mock-api-for-development-and-testing)
  - [Installing and configuring JSON Server with NPM Run All](#installing-and-configuring-json-server-with-npm-run-all)
    - [JSON Server](#json-server)
    - [Running Mock API along with e2e or dev start](#running-mock-api-along-with-e2e-or-dev-start)
  - [Creating a Service with Mock API](#creating-a-service-with-mock-api)
    - [Applying TDD with BDD approach](#applying-tdd-with-bdd-approach)
    - [getCatalogs Query Resolver](#getcatalogs-query-resolver)
    - [Injectable Service](#injectable-service)
    - [Add an endpoint in Mock API](#add-an-endpoint-in-mock-api)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Setting-up Mock API for development and testing
In this section, we are going to setup a mock API which will act as a datasource 
for our GraphQL application. The following are the tools we going to use:
- json-server
- npm-run-all
- axios

### Installing and configuring JSON Server with NPM Run All
JSON server is a great tool that we can use to fake REST API without a need to code. 
To learn more about JSON server, visit [JSON Server GitHub](https://github.com/typicode/json-server).
The NPM Run all on the other hand allows us to run multiple node scripts at the same time. 
To learn more about NPM Run all, visit [npm-run-all GitHub](https://github.com/mysticatea/npm-run-all).

First thing to do is to install JSON Server and NPM Run All by executing the following command.
```shell
yarn add json-server npm-run-all --dev
```

#### JSON Server
Create a configuration file `json-server.json` for the JSON Server in which 
it will run on a different port.
```json
{
  "port": 4000
}
```
Under the `test` folder, create a file called `mock-api.json` that will contain a sample data.
```json
{
  "sample": [
    { "id": 1, "name": "Jane", "lastname": "Doe" }
  ]
}
```
Then, in the `packagejson` add a new script to run the JSON Server.
```json
{
  ...
  "scripts": {
    ...
    "mockApi:start": "json-server --watch test/mock-api.json"
  }
}
```
To check that your setup is working, execute `yarn run mockApi:start`.
You should be able to see an output like this.
```shell
  Loading test/mock-api.json
  Done

  Resources
  http://localhost:4000/sample

  Home
  http://localhost:4000

  Type s + enter at any time to create a snapshot of the database
  Watching...

GET /db 200 2.370 ms - 94
GET /__rules 404 3.798 ms - 2
GET /sample 200 18.864 ms - 66
```
And that's it, your JSON Server is up and running. 
You can check it out by visiting `http://localhost:4000`.

#### Running Mock API along with e2e or dev start
At this point, we will need the `npm-run-all` command to run the mock API along with other scripts.
To do this, add the following scripts in `package.json`.
```json
{
  ...
  "scripts": {
    ...
    "test:e2e-with-mockApi": "npm-run-all --parallel mockApi:start test:e2e --race",
    "start:dev-with-mockApi": "npm-run-all --parallel mockApi:start start:dev"
  }
}
```
The` --parallel` instructs npm-run-all to run the tasks at the same time, 
for example `mockApi:start` and `test:e2e`.
While the `--race` will end the command when one of the tasks has already ended.

Then execute one of the script added above.  You should be able to see in the
command line some logs indicating that both script are running at the same time!

### Creating a Service with Mock API
We are now going to introduce a service that will call the Mock API
using `axios`.

To install the tool, execute the following command.
```shell
yarn add axios @nestjs/axios
```
Then we are now ready to create our new service using `axios`!

#### Applying TDD with BDD approach
We are going to practice the TDD with BDD discipline in creating our first service.
For example, we have the following requirement.
```gherkin
Scenario: Show list of catalog
  
When the Buyer visits the catalog page
Then the list of catalogs are shown
```

First thing to do is to create a test.
In the `test` folder, create a sub-folder named `catalog`.
Then create a file `getcatalogs.e2e-spec.ts`.
Setup the base of your test something like below.
```typescript
import { closeTestingModule, initializeTestingModule } from '../testUtils';

describe('getCatalogs Query', () => {
    beforeEach(async () => {
        await initializeTestingModule();
    });
    afterEach(async () => {
        await closeTestingModule();
    });

    it('returns a list of catalog', async () => {
        // Given
        // When
        // Then
    });
});
```

In the `Given` section, we will have to prepare the graphql query and the expected result.
```typescript
const queryData = {
    query: `query { 
        getCatalogs{
            id
            name
        }
    }`,
};
const expectedResult: Catalog[] = [
    {
        id: 1,
        name: 'pillow',
    },
    {
        id: 2,
        name: 'blanket',
    },
];
```
At this point, the `Catalog` object does not exist yet.
We then create this class inside `src/model/graph/__sample` directory.
Name the file `catalog.model.ts` and copy the following as its content.
```typescript
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Catalog {

    @Field(() => Int)
    id: number;

    @Field(() => String)
    name: string;
}
```
And then we can import the `Catalog` model class in the test.

Next is to build up the `When` part.  This is where we are going to call the running instance of our GraphQL application through `supertest`.
```typescript
import * as request from 'supertest';
...
const response = await request(testApp.getHttpServer()).post(gql).send(queryData);
```

Lastly, we will have the `Then` which will contain our expected behaviour.
It will have 2 expectations as shown below.
```typescript
expect(response.error).toBeFalsy();
expect(response.body.data?.getCatalogs).toStrictEqual(expectedResult);
```
Run `yarn run test:e2e-with-mockApi` and the test should fail.
The error is something like below.
```shell
    Error: expect(received).toBeFalsy()
    
    Received: [Error: cannot POST /graphql (400)]
```
This tells us that there is no such `getCatalogs` query exist yet in the GraphQL Application.
Next is to create the query resolver.

#### getCatalogs Query Resolver
Under `src` folder, create a file `resolver/__sample/catalog.resolver.ts`.

This is where we are going to export a class `CatalogResolver` which contains a query for `getCatalogs`.
```typescript
@Resolver()
export class CatalogResolver {
    @Query(() => [Catalog])
    getCatalogs() {
        return [];
    }
}
```
At this point, we are returning an empty array of `Catalog`.
Next is to add the `CatalogResolver` in `provider.module.ts` as one of the providers.
Run `yarn run test:e2e-with-mockApi` again and it should give us a different error.
```shell
Error: expect(received).toStrictEqual(expected) // deep equality

- Expected  - 10
+ Received  +  1

- Array [
-   Object {
-     "id": 1,
-     "name": "pillow",
-   },
-   Object {
-     "id": 2,
-     "name": "blanket",
-   },
- ]
+ Array []
```
The resolver is working but we will need to return the correct result in which we are going to retrieve that from the Mock API through a service.

#### Injectable Service
At this point, we are going to create a service  in which the `CatalogResolver` will use. 
To do that, let's have a `constructor` declared in `CatalogResolver` to inject a service.
```typescript
constructor(private readonly catalogService: CatalogService) {}
```
> **_NOTE:_**  If your lint is complaining about *useless constructor*, 
> set `no-useless-constructor` to `0` in `eslintrc.js`.

The `CatalogService` does not exist yet and so we are going to create this class in `src/service/__sample` folder. 
We will name the file `catalog.service.ts` and have the following content.
```typescript
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios/index';

@Injectable()
export class CatalogService {
    constructor(private readonly httpService: HttpService) {}

    async findAll(): Promise<AxiosResponse<Array<CatalogApi>>> {
        const response = await this.httpService.axiosRef.get('http://localhost:4000/catalogs');
        return response.data;
    }
}
```
Notice that we are injecting `HttpService`, this is already provided by `nestjs/axios` where it allows us to call external Rest API.

The return object of the `findAll` function is `CatalogApi`.
This will be the representation of the Catalog from the external API.
We will create the file `catalog-api.model.ts` in `src/model/api/__sample` folder.
```typescript
export class CatalogApi {
    id: number;
    name: string;
}
```
Then we can now import the class `CatalogApi` in `CatalogService`. 
Also, import class `CatalogService` in `CatalogResolver`.

Then, when you run the test, you will get an error something like this.
```shell
Error: Nest can't resolve dependencies of the CatalogResolver (?). Please make sure that the argument CatalogService at index [0] is available in the ProviderModule context.

Potential solutions:
- Is ProviderModule a valid NestJS module?
- If CatalogService is a provider, is it part of the current ProviderModule?
- If CatalogService is exported from a separate @Module, is that module imported within ProviderModule?
  @Module({
    imports: [ /* the Module containing CatalogService */ ]
  })
```
This error informs us that we need to create a module for the Catalog API. 
Let's create a file `api.module.ts` and have the following content. 
```typescript
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CatalogService } from './service/__sample/catalog.service';

@Module({
    imports: [
        HttpModule.register({
            timeout: 5000,
            maxRedirects: 5,
        }),
    ],
    providers: [CatalogService],
    exports: [CatalogService],
})
export class ApiModule {}
```
Here, we are importing an `HttpModule` in which we provide some specific configurations for it.
Then we register `CatalogService` as a provider and also export it so that other modules can do an import.

Next, we are  going to import `ApiModule` in `ProviderModule` so that the resolvers can inject the services it has.
```typescript
@Module({
    imports: [ApiModule],
    providers: [...],
})
export class ProviderModule {}
```
Try running the test again, it should give a different error this time.
Then, we can use the `CatalogService` in `CatalogResolver` to return the list of catalogs. 
The resolver will look like the following.
```typescript
import { CatalogService } from '../service/__sample/catalog.service';

@Resolver()
export class CatalogResolver {
    constructor(private readonly catalogService: CatalogService) {}

    @Query(() => [Catalog])
    async getCatalogs() {
        return await this.catalogService.findAll();
    }
}
```
Notice that the `getCatalogs` function is now an `async` function since we are calling an external API.

#### Add an endpoint in Mock API
Lastly, we create an endpoint in our Mock API by adding the following  in `test/mock-api.json`.
```json
{
  ...
  "catalogs": [
    { "id": 1, "name": "pillow", "price": "10.0" },
    { "id": 2, "name": "blanket", "price": "10.0" }
  ]
}
```
Run `yarn run test:e2e-with-mockApi`.
This time the test is green! 
We have a running `getCatalogs` query that is connected to an external API!
