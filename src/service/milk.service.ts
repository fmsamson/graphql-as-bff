import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { MilkApi } from '../model/api/milk-api.model';

@Injectable()
export class MilkService {
    constructor(private readonly httpService: HttpService) {}
    bookableDomain = 'http://localhost:4000';

    async getMilkByType(type: string): Promise<MilkApi[]> {
        const url = `${this.bookableDomain}/milks?type=${type}`;
        const response: AxiosResponse<MilkApi[]> = await this.httpService.axiosRef.get(url);
        return response.data;
    }
}
