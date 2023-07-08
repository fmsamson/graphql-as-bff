import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { CatalogApi } from '../../model/api/__sample/catalog-api.model';

@Injectable()
export class CatalogService {
    constructor(private readonly httpService: HttpService) {}

    async findAll(): Promise<AxiosResponse<Array<CatalogApi>>> {
        const response = await this.httpService.axiosRef.get('http://localhost:4000/catalogs');
        return response.data;
    }
}
