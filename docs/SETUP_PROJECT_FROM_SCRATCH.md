<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Setting-up the Project from scratch](#setting-up-the-project-from-scratch)
  - [Configure `nest-cli.json`](#configure-nest-clijson)
  - [Configure `.eslintrc.js`](#configure-eslintrcjs)
  - [Create a basic Query Resolver](#create-a-basic-query-resolver)
  - [Create a Provider Module](#create-a-provider-module)
  - [Configure `app.module.ts` to work with GraphQL](#configure-appmodulets-to-work-with-graphql)
  - [Remove unnecessary file](#remove-unnecessary-file)
  - [Modify `main.ts`](#modify-maints)
  - [Starting your GraphQL application](#starting-your-graphql-application)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Setting-up the Project from scratch
```bash
# install nestjs cli
$ npm i -g @nestjs/cli

# create nestjs project
$ nest new {project-name}
# in this template, it uses yarn

# add graphql with apollo driver
$ yarn add @nestjs/graphql @nestjs/apollo @apollo/server graphql

# install class-validator for decorators usage
$ yarn add class-validator

# install class-transformer for serializing/deserializing plain object to/from instance of class
$ yarn add class-transformer
```

### Configure `nest-cli.json`
By default, the `nest-cli.json` file contains configuration specifically for REST API application. 
Copy the following configuration to enable your nestjs project to be able to compile as GraphQL application.
```json
{
  "compilerOptions": {
    "plugins": [
      {
        "name": "@nestjs/graphql",
        "options": {
          "introspectComments": true
        }
      }
    ]
  }
}
```

### Configure `.eslintrc.js`
You can make use of your own `.eslintrc.js` configuration, but feel free to use the following configuration.
```javascript
module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        allowImportExportEverywhere: true,
        ecmaVersion: 6,
        sourceType: 'module',
        ecmaFeatures: {
            blockBindings: true,
            experimentalObjectRestSpread: true,
            jsx: true,
            templateStrings: true,
        },
    },
    env: {
        node: true,
        browser: true,
        es6: true,
        jest: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'prettier',
        'plugin:compat/recommended',
    ],
    plugins: ['react', 'compat'],
    settings: {
        polyfills: ['fetch', 'Promise'],
        react: {
            version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
        },
    },
    rules: {
        'brace-style': 1,
        'comma-dangle': [1, 'always-multiline'],
        curly: [1, 'all'],
        'func-style': [
            1,
            'declaration',
            {
                allowArrowFunctions: true,
            },
        ],
        indent: [
            1,
            4,
            {
                SwitchCase: 1,
            },
        ],
        'linebreak-style': [1, 'unix'],
        'no-console': 1,
        'no-multiple-empty-lines': [
            1,
            {
                max: 1,
            },
        ],
        'no-nested-ternary': 1,
        'no-unneeded-ternary': 1,
        'no-unused-vars': 0,
        '@typescript-eslint/no-unused-vars': 1,
        'no-template-curly-in-string': 'error',
        'no-unsafe-negation': 'error',
        'no-var': 1,
        'prefer-template': 1,
        quotes: [
            1,
            'single',
            {
                allowTemplateLiterals: true,
            },
        ],
        semi: [1, 'always'],
        'space-before-blocks': 1,
        'space-before-function-paren': [
            1,
            {
                anonymous: 'always',
                named: 'never',
                asyncArrow: 'always',
            },
        ],
        'space-infix-ops': 1,
        'space-unary-ops': 1,
        strict: [1, 'global'],
        'react/jsx-uses-react': 1,
        'react/jsx-uses-vars': 1,
        'react/react-in-jsx-scope': 0,
        'valid-jsdoc': 1,
        complexity: ['warn', 10],
        'dot-location': ['error', 'property'],
        eqeqeq: ['error', 'always'],
        'guard-for-in': 'error',
        'no-alert': 'error',
        'no-caller': 'error',
        'no-else-return': 'warn',
        'no-eq-null': 'error',
        'no-eval': 'error',
        'no-extra-bind': 'error',
        'no-extra-label': 'error',
        'no-floating-decimal': 'warn',
        'no-implicit-coercion': [2, { allow: ['!!', '~'] }],
        'no-implicit-globals': 'error',
        'no-implied-eval': 'error',
        'no-lone-blocks': 'error',
        'no-loop-func': 'error',
        'no-multi-spaces': 'warn',
        'no-multi-str': 'error',
        'no-new': 'error',
        'no-new-func': 'error',
        'no-new-wrappers': 'error',
        'no-param-reassign': 'error',
        'no-proto': 'error',
        'no-return-assign': 'error',
        'no-self-compare': 'error',
        'no-sequences': 'error',
        'no-throw-literal': 'error',
        'no-unmodified-loop-condition': 'error',
        'no-useless-call': 'error',
        'no-useless-concat': 'error',
        'no-useless-return': 'error',
        'no-void': 'error',
        'prefer-promise-reject-errors': ['warn', { allowEmptyReject: true }],
        radix: 'error',
        'require-await': 'error',
        yoda: 'error',
        'no-undef-init': 'error',
        'global-require': 'error',
        'array-bracket-spacing': ['warn', 'never', { objectsInArrays: false }],
        'comma-spacing': ['warn', { before: false, after: true }],
        'comma-style': ['error', 'last'],
        'block-spacing': 'warn',
        camelcase: 'warn',
        'computed-property-spacing': ['error', 'never'],
        'consistent-this': ['error', 'self'],
        'func-call-spacing': ['warn', 'never'],
        'jsx-quotes': ['warn', 'prefer-single'],
        'key-spacing': ['warn', { afterColon: true }],
        'keyword-spacing': ['warn', { after: true }],
        'lines-around-comment': ['warn', { beforeBlockComment: true }],
        'max-depth': ['error', 4],
        'max-nested-callbacks': ['error', 6],
        'max-params': ['warn', 7],
        'max-statements-per-line': ['warn', { max: 1 }],
        'new-cap': 0,
        'no-array-constructor': 'error',
        'no-continue': 'error',
        'no-lonely-if': 'warn',
        'no-new-object': 'error',
        'no-restricted-syntax': ['error', 'WithStatement', 'BinaryExpression[operator=\'in\']'],
        'no-trailing-spaces': 'warn',
        'no-whitespace-before-property': 'warn',
        'one-var': ['warn', 'never'],
        'operator-linebreak': ['off', 'after'],
        'space-in-parens': ['warn', 'never'],
        'arrow-spacing': 'warn',
        'generator-star-spacing': ['warn', { before: false, after: true }],
        'no-duplicate-imports': ['error', { includeExports: true }],
        'no-useless-constructor': 'error',
        'prefer-const': 'warn',
        'rest-spread-spacing': ['warn', 'never'],
        'template-curly-spacing': 'warn',
        'max-len': 'off',
        'eol-last': ['error', 'always'],
        'max-lines': ['warn', 1000],
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': 'error',
        'prefer-rest-params': 'error',
        'default-case': 'error',
        'no-bitwise': 'error',
        'no-compare-neg-zero': 1,
        'object-curly-spacing': ['warn', 'always'],
        '@typescript-eslint/explicit-function-return-type': 0,
        '@typescript-eslint/explicit-module-boundary-types': 0,
    },
    globals: {
        sinon: true,
        require: true,
        fetchMock: true,
    },
};
```
Also, make sure to have an `eslint-plugin-compat` installed.
To add it, execute the following command:
```shell
yarn add eslint-plugin-compat --dev
```

### Create a basic Query Resolver
One of the requirement to be able for a GraphQL application to compile and run properly is to have at least 1 resolver. 
We will just going to create a simple query by creating a file `src/__sample/query/query.resolver.ts`.
Then copy the following content to the newly created file.
```typescript
import { Args, Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class QueryResolver {

    @Query(() => String)
    sayHello(@Args('name', { nullable: true, type: () => String }) name: string): string {
        return `Hello ${name ?? 'World'}!`;
    }
}
```
This query resolver will accept a query for `sayHello` where `name` argument is optional.
Whenever a `name` is provided, it will return `Hello $name`, else `Hello World`.

### Create a Provider Module
The Provider Module provides all the resolver in the project.  
Whenever you create a new resolver, you will need to register that resolver in this module.
For now, we only have the `QueryResolover`.
Create a new file `src/provider.module.ts`.
Then copy the following code.
```typescript
import { Module } from '@nestjs/common';
import { QueryResolver } from './__sample/query/query.resolver';

@Module({
    providers: [QueryResolver],
})
export class ProviderModule {}
```

### Configure `app.module.ts` to work with GraphQL
The `app.module.ts` will import all the necessary modules for your NestJS project to work with GraphQL.
Modify the the file by copying following code.
```typescript
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ProviderModule } from './provider.module';

@Module({
    imports: [
        ProviderModule,
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: 'schema.gql',
            installSubscriptionHandlers: true,
        }),
    ],
})
export class AppModule {}
```
Take note of the `autoSchemaFile: 'schema.gql',`. This setting will make your GraphQL codebase in a `code-first` approach.

### Remove unnecessary file
When creating a nestjs project, there are default files created for an API type of application.
You don't need them for a GraphQL application.
And so, delete the following files under `src`.
```text
- app.controller.spec.ts
- app.controller.ts
- app.service.ts
```

### Modify `main.ts`
Since we are using `class-validator` and `class-transformer`, configure `ValidatorPipe`.
The `main.ts` file should look like the following.
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());

    await app.listen(3000);
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
```

### Starting your GraphQL application
At this point, you should be able to start your application.
To start your application, you can execute the following command.
```shell
yarn run start
```
As you will notice, the `schema.gql` is auto-generated.
And that's it, you have now a running GraphQL application with NestJS framework typescript!

To test your query, by opening `http://localhost:3000/graphql` in your browser.
Then try the following query in the query window.
```
query { sayHello }
```
The query will then return
```json
{
  "data": {
    "sayHello": "Hello World!"
  }
}
```
<br><br>
You can also try to query with argument.
```
query { sayHello(name: "Some Name") }
```
This will then return the following.
```json
{
  "data": {
    "sayHello": "Hello Some Name!"
  }
}
```
<br><br>
Also, you can make use of the `QUERY VARIABLES` located at the lower left window.
You will have to modify your query in such a way that it contains the variable with type and use that variable name in the query itself.
Here is an example.
```
query sayHello($nameVar: String) { 
  sayHello(name: $nameVar) 
}
```
And in the `QUERY VARIABLES`, provide the value of your variable.
It should look like the following.
```json
{
  "nameVar": "Variable"
}
```
It will then return the following.
```json
{
  "data": {
    "sayHello": "Hello Variable!"
  }
}
```
<br>
