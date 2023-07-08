import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { ProductApi } from '../model/api/product-api.model';

@Injectable()
export class ProductService {
    constructor(private readonly httpService: HttpService) {}
    bookableDomain = 'http://localhost:4000';

    async getProductById(productId: string): Promise<ProductApi> {
        const url = `${this.bookableDomain}/products/${productId}`;
        const response: AxiosResponse<ProductApi> = await this.httpService.axiosRef.get(url);
        return response.data;
    }
}
