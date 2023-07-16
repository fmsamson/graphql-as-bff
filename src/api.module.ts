import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CatalogService } from './service/__sample/catalog.service';
import { MilkService } from './service/milk.service';
import { HouseholdService } from './service/household.service';
import { BottleService } from './service/bottle.service';

const services = [
    CatalogService,
    MilkService,
    HouseholdService,
    BottleService,
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
