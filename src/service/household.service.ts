import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';
import { HouseholdApi } from '../model/api/household-api.model';
import { householdApiBaseEndpoint } from '../configure.ssm';

@Injectable()
export class HouseholdService {
    constructor(private readonly httpService: HttpService) {}

    async getHouseholdByName(name: string): Promise<HouseholdApi[]> {
        const url = `${householdApiBaseEndpoint}households?name=${name}`;
        const response: AxiosResponse<HouseholdApi[]> = await this.httpService.axiosRef.get(url);
        return response.data;
    }
}
