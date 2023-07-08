import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CatalogService } from './service/__sample/catalog.service';
import { BookableService } from './service/bookable.service';
import { DiscountService } from './service/discount.service';
import { ProductService } from './service/product.service';
import { SubscriptionService } from './service/subscription.service';

const services = [
    CatalogService,
    BookableService,
    DiscountService,
    ProductService,
    SubscriptionService,
];
@Module({
    imports: [
        HttpModule.register({
            timeout: 5000,
            maxRedirects: 5,
        }),
    ],
    providers: services,
    exports: services,
})
export class ApiModule {}
