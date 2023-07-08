import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';

@Injectable()
export class UserService {
    constructor(private readonly httpService: HttpService) {}

    async findAll(): Promise<AxiosResponse<any>> {
        const response = await this.httpService.axiosRef.get('http://localhost:4000/sample');
        return response.data;
    }
}
