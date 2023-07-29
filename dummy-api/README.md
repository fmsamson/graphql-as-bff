- create folder for a dummy-api

- go to the folder and execute `npm init -y`

```bash
$ npm install \
typescript @types/node ts-loader ts-node rimraf \
webpack webpack-cli copy-webpack-plugin \
@types/json-server \
serverless-offline \
--save-dev

$ npx tsc --init --rootDir src --outDir build \
--esModuleInterop --resolveJsonModule --lib es6 \
--module commonjs --allowJs true --noImplicitAny true
```

- tsconfig.json

```json
{
  "compilerOptions": {
   "module": "commonjs",
   "declaration": true,
   "removeComments": true,
   "emitDecoratorMetadata": true,
   "experimentalDecorators": true,
   "allowSyntheticDefaultImports": true,
   "target": "ES2021",
   "outDir": "./build",
   "baseUrl": "./",
   "incremental": true,
   "skipLibCheck": true,
   "strictNullChecks": false,
   "noImplicitAny": false,
   "strictBindCallApply": false,
   "forceConsistentCasingInFileNames": false,
   "noFallthroughCasesInSwitch": false,
   "esModuleInterop": true,
   "resolveJsonModule": true
  }
}
```

- package.json script

```json
"build": "rimraf ./build && webpack"
```

- webpack.config.js

```javascript
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  target: 'node',
  mode: 'none',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /(node_modules)/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'index.js',
    path: path.join(__dirname, 'build'),
    libraryTarget: 'commonjs2',
  },
  plugins: [
    new CopyWebpackPlugin({
        patterns: [
            { from: 'node_modules/json-server/public', to: 'public' },
            { from: '../static' }
        ]
    }),
  ],
};
```

- serverless.yml

```yaml
service: serverless-example

plugins: 
  - serverless-offline

provider:
  name: aws
  runtime: nodejs18.x

functions:
  main:
    handler: build/index.handler
    events:
      - http:
          method: ANY
          path: /
      - http:
          method: ANY
          path: '{proxy+}'
```

- install the following

```bash
$ npm install json-server aws-lambda @vendia/serverless-express
```

- create `src` folder and file `index.ts` in it

```typescript
import jsonServer from 'json-server';
import dbApi from './db.json';
import { Callback, Context, Handler } from 'aws-lambda';
import serverlessExpress from '@vendia/serverless-express';

const server = jsonServer.create();
const router = jsonServer.router(dbApi);
const middlewares = jsonServer.defaults();

let serverHandler: Handler;

const bootstrap = () => {
    server.use(middlewares);
    server.use(jsonServer.rewriter({
        '/api/:id': '/someApi/:id',
    }));
    server.use(router);

    return serverlessExpress({ app: server });
}

export const handler: Handler = (
    event: any, 
    context: Context, 
    callback: Callback) => {
        context.callbackWaitsForEmptyEventLoop = false;
        serverHandler = serverHandler ?? bootstrap();
        return serverHandler(event, context, callback);
};
```

- create `db.json` and set the default API values 

- add script in package.json

```json
"start": "npm run build && npx serverless offline"
```