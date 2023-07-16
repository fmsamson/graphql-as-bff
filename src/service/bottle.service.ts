import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { BottleApi } from '../model/api/bottle-api.model';

@Injectable()
export class BottleService {
    constructor(private readonly httpService: HttpService) {}
    bookableDomain = 'http://localhost:4000';

    async getBottleByType(type: string): Promise<BottleApi[]> {
        const url = `${this.bookableDomain}/bottles?type=${type}`;
        const response: AxiosResponse<BottleApi[]> = await this.httpService.axiosRef.get(url);
        return response.data;
    }

    async getBottleByName(name: string): Promise<BottleApi[]> {
        const url = `${this.bookableDomain}/bottles?name=${name}`;
        const response: AxiosResponse<BottleApi[]> = await this.httpService.axiosRef.get(url);
        return response.data;
    }
}
