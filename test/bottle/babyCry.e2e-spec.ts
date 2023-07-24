import { closeTestingModule, gql, initializeTestingModule, testApp } from '../testUtils';
import request from 'supertest';

import { BottleInput } from '../../src/model/input/bottle-input.model';
import { Bottle } from '../../src/model/graph/bottle.model';

describe('babyCry Query', () => {
    beforeEach(async () => {
        await initializeTestingModule();
    });
    afterEach(async () => {
        await closeTestingModule();
    });

    it('returns a new full feeding bottle of formula milk', async () => {
        // Given a baby is holding an empty bottle of milk
        const bottleInput: BottleInput = {
            isEmpty: true,
            type: 'infant'
        };
        const expectedBottle: Bottle = {
            name: 'Feeding',
            status: 'new',
            milk: {
                name: 'Formula'
            }
        };
        const queryData = {
            query: `query anyname($input: BottleInput!){
                babyCry(bottleInput: $input) {
                    name
                    status
                    milk(bottleInput: $input) {
                        name
                    }
                }
            }`,
            variables: { input: bottleInput }
        };

        // When the baby cries
        const response = await request(testApp.getHttpServer()).post(gql).send(queryData);

        // Then the baby gets another full feeding bottle of formula milk
        expect(response.error).toBeFalsy();
        expect(response.body.data?.babyCry).toEqual(expectedBottle);
    });
});
