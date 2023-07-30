import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { MilkApi } from '../model/api/milk-api.model';
import { milkApiBaseEndpoint } from '../main';

@Injectable()
export class MilkService {
    constructor(private readonly httpService: HttpService) {}

    async getMilkByType(type: string): Promise<MilkApi[]> {
        const url = `${milkApiBaseEndpoint}milks?type=${type}`;
        const response: AxiosResponse<MilkApi[]> = await this.httpService.axiosRef.get(url);
        return response.data;
    }
}
