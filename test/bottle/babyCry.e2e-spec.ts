import { closeTestingModule, gql, initializeTestingModule, testApp } from '../testUtils';
import * as request from 'supertest';

describe('babyCry Query', () => {
    beforeEach(async () => {
        await initializeTestingModule();
    });
    afterEach(async () => {
        await closeTestingModule();
    });

    it('returns a new full feeding bottle of formula milk', async () => {
        // Given a  baby holding an empty bottle of milk
        const queryData = {
            query: ``,
            variables: {}
        };

        // When the baby cries
        const response = await request(testApp.getHttpServer()).post(gql).send(queryData);

        // Then the baby gets another full feeding bottle of formula milk
        expect(response.error).toBeFalsy();
    });
});
