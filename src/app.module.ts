import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ProviderModule } from './provider.module';
import { KeyvAdapter } from '@apollo/utils.keyvadapter';
import Keyv from 'keyv';

@Module({
    imports: [
        ProviderModule,
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: process.env.NODE_ENV === 'development' ? 'schema.gql' : true,
            installSubscriptionHandlers: true,
            persistedQueries: {
                ttl: 900, // 15 minutes
                // cache: new KeyvAdapter(new Keyv({ store: TODO })),
            },
        }),
    ],
})
export class AppModule {}
