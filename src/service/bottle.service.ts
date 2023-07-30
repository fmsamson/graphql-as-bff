import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { BottleApi } from '../model/api/bottle-api.model';
import { bottleApiBaseEndpoint } from '../main';

@Injectable()
export class BottleService {
    constructor(private readonly httpService: HttpService) {}

    async getBottleByType(type: string): Promise<BottleApi[]> {
        const url = `${bottleApiBaseEndpoint}/bottles?type=${type}`;
        const response: AxiosResponse<BottleApi[]> = await this.httpService.axiosRef.get(url);
        return response.data;
    }

    async getBottleByName(name: string): Promise<BottleApi[]> {
        const url = `${bottleApiBaseEndpoint}/bottles?name=${name}`;
        const response: AxiosResponse<BottleApi[]> = await this.httpService.axiosRef.get(url);
        return response.data;
    }
}
