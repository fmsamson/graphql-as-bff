import { Query, Resolver } from '@nestjs/graphql';
import { Catalog } from '../../model/graph/__sample/catalog.model';
import { CatalogService } from '../../service/__sample/catalog.service';

@Resolver()
export class CatalogResolver {
    constructor(private readonly catalogService: CatalogService) {}

    @Query(() => [Catalog])
    async getCatalogs() {
        return await this.catalogService.findAll();
    }
}
