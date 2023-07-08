import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { BookableApi, Resource } from '../model/api/bookable-api.model';

@Injectable()
export class BookableService {
    constructor(private readonly httpService: HttpService) {}
    bookableDomain = 'http://localhost:4000';

    async getBookableResourcesByProduct(productId: string, level: number): Promise<BookableApi> {
        const url = `${this.bookableDomain}/activations/${productId}/bookable?level=${level}`;
        const response: AxiosResponse<BookableApi> = await this.httpService.axiosRef.get(url);
        return response.data;
    }

    async getBookableResourcesByIds(productId: string, level: number, resourceIds: string[]): Promise<Resource[]> {
        const bookableApi = await this.getBookableResourcesByProduct(productId, level);
        return bookableApi.resources.filter(value => {
            return resourceIds.includes(value.resource_id);
        });
    }
}
