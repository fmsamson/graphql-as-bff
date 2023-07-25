import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ProviderModule } from './provider.module';

@Module({
    imports: [
        ProviderModule,
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: process.env.NODE_ENV === 'development' ? 'schema.gql' : true,
            installSubscriptionHandlers: true,
        }),
    ],
})
export class AppModule {}
