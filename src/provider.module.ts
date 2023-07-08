import { Module } from '@nestjs/common';
import { QueryResolver } from './__sample/query/query.resolver';
import { MutationResolver } from './__sample/mutation/mutation.resolver';
import { CatalogResolver } from './resolver/__sample/catalog.resolver';
import { ApiModule } from './api.module';

@Module({
    imports: [ApiModule],
    providers: [QueryResolver, MutationResolver, CatalogResolver],
})
export class ProviderModule {}
