import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { ProductApi } from '../model/api/product-api.model';
import { SubscriptionApi } from '../model/api/subscription-api.model';

@Injectable()
export class SubscriptionService {
    constructor(private readonly httpService: HttpService) {}
    bookableDomain = 'http://localhost:4000';

    async saveSubscription(productId: string, level: number, resourceIds: string[]): Promise<SubscriptionApi> {
        const url = `${this.bookableDomain}/subscriptions`;
        const data = {
            product_sku: productId,
            resource_ids: resourceIds,
            level: level.toString(),
        };
        const response: AxiosResponse<SubscriptionApi> = await this.httpService.axiosRef.post(url, data);
        return response.data;
    }
}
