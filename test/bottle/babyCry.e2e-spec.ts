import { closeTestingModule, gql, initializeTestingModule, testApp } from '../testUtils';
import request from 'supertest';

import { BottleInput } from '../../src/model/input/bottle-input.model';
import { Bottle } from '../../src/model/graph/bottle.model';

import { createHash } from 'crypto';

describe('babyCry Query', () => {
    beforeEach(async () => {
        await initializeTestingModule();
    });
    afterEach(async () => {
        await closeTestingModule();
    });

    it('POST method: returns a new full feeding bottle of formula milk', async () => {
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

    it('GET method: returns a new full feeding bottle of formula milk', async () => {
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
        const query = [`query anyname($input: BottleInput!){`,
            `babyCry(bottleInput: $input) {`,
                `name`,
                `status`,
                `milk(bottleInput: $input) {`,
                    `name`,
                `}`,
            `}`,
        `}`];
        const variables = { input: bottleInput };
        const url = `${gql}?query=${query}&variables=${JSON.stringify(variables)}`;

        // When the baby cries
        const response = await request(testApp.getHttpServer()).get(url)
            .set('Content-Type',  'application/json');

        // Then the baby gets another full feeding bottle of formula milk
        expect(response.error).toBeFalsy();
        expect(response.body.data?.babyCry).toEqual(expectedBottle);
    });

    describe('Automatic Persisted Query', () => {
        it('Persisted Query Not Found', async () => {
            // Given
            const persistedQueryExtensions = {
                persistedQuery: {
                    version: 1,
                    sha256Hash: 'somehash'
                }
            };
            const url = `${gql}?extensions=${JSON.stringify(persistedQueryExtensions)}`;
    
            // When
            const response = await request(testApp.getHttpServer()).get(url)
                .set('Content-Type',  'application/json');
    
            // Then
            expect(response.body.errors).toBeTruthy();
            expect(response.body.errors).toEqual([
                {
                    message: 'PersistedQueryNotFound',
                    extensions: { 
                        code: 'PERSISTED_QUERY_NOT_FOUND',
                        stacktrace: expect.any(Array)
                    }
                }
            ]);
        });

        it('Persisted Query Registered and Found', async () => {
            // Given
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
            const query = `query anyname($input: BottleInput!){
                babyCry(bottleInput: $input) {
                    name
                    status
                    milk(bottleInput: $input) {
                        name
                    }
                }
            }`;
            const persistedQuery = {
                extensions: {
                    persistedQuery: {
                        version: 1,
                        sha256Hash: createHash('sha256').update(query).digest('hex')
                    }
                },
                query: query,
                variables: { input: bottleInput }
            };
            const check = await request(testApp.getHttpServer()).post(gql).send(persistedQuery);
            expect(check.body.data?.babyCry).toBeTruthy();
    
            // When
            const url = `${gql}?extensions=${JSON.stringify(persistedQuery.extensions)}&variables=${JSON.stringify(persistedQuery.variables)}`;
            const response = await request(testApp.getHttpServer()).get(url)
                .set('Content-Type',  'application/json');
    
            // Then
            expect(response.body.data?.babyCry).toBeTruthy();
            expect(response.body.data?.babyCry).toEqual(expectedBottle);
        });
    });

});
