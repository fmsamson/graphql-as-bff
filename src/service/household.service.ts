import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { HouseholdApi } from '../model/api/household-api.model';

@Injectable()
export class HouseholdService {
    constructor(private readonly httpService: HttpService) {}
    bookableDomain = 'http://localhost:4000';

    async getHouseholdByName(name: string): Promise<HouseholdApi[]> {
        const url = `${this.bookableDomain}/households?name=${name}`;
        const response: AxiosResponse<HouseholdApi[]> = await this.httpService.axiosRef.get(url);
        return response.data;
    }
}
