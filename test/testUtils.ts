import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';

export const gql = '/graphql';
export let testApp: INestApplication;

export const initializeTestingModule = async () => {
    const module: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
    }).compile();

    testApp = module.createNestApplication();
    await testApp.init();
};

export const closeTestingModule = async () => {
    await testApp.close();
};
