import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { DiscountApi } from '../model/api/discount-api.model';

@Injectable()
export class DiscountService {
    constructor(private readonly httpService: HttpService) {}
    bookableDomain = 'http://localhost:4000';

    async getDiscountsByProductAndResource(productId: string, level: number, resourceId: string): Promise<DiscountApi> {
        const url = `${this.bookableDomain}/discounts`;
        const response: AxiosResponse<DiscountApi> = await this.httpService.axiosRef.get(url);
        return {
            asset_discounts: response.data.asset_discounts.filter(value => {
                return (value.product_id.toLowerCase() === productId.toLowerCase()
                && value.level === level.toString()
                && value.asset_id === resourceId);
            }),
        };
    }

    async getDiscountsByProductAndResources(productId: string, level: number, resourceIds: string[]): Promise<DiscountApi> {
        const url = `${this.bookableDomain}/discounts`;
        const response: AxiosResponse<DiscountApi> = await this.httpService.axiosRef.get(url);
        return {
            asset_discounts: response.data.asset_discounts.filter(value => {
                return (value.product_id.toLowerCase() === productId.toLowerCase()
                    && value.level === level.toString()
                    && resourceIds.includes(value.asset_id));
            }),
        };
    }
}
