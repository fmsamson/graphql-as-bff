import { closeTestingModule, gql, initializeTestingModule, testApp } from '../testUtils';
import * as request from 'supertest';

describe('getVacationBags Query', () => {
    beforeEach(async () => {
        await initializeTestingModule();
    });
    afterEach(async () => {
        await closeTestingModule();
    });

    it.skip('returns a list of bookable resources', async () => {
        // Given a baby needs to sleep within a day
        const queryData = {
            query: ``,
            variables: {}
        };

        // When the baby goes to the beach
        const response = await request(testApp.getHttpServer()).post(gql).send(queryData);

        // Then the baby brings along his/her vacation stuff with a feeding bottle of formula milk
        expect(response.error).toBeFalsy();
    });
});
