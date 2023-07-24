import { closeTestingModule, gql, initializeTestingModule, testApp } from '../../testUtils';
import { Catalog } from '../../../src/model/graph/__sample/catalog.model';
import request from 'supertest';

describe('getCatalogs Query', () => {
    beforeEach(async () => {
        await initializeTestingModule();
    });
    afterEach(async () => {
        await closeTestingModule();
    });

    it('returns a list of catalog', async () => {
        // Given
        const queryData = {
            query: `query { 
                getCatalogs{
                    id
                    name
                }
            }`,
        };
        const expectedResult: Catalog[] = [
            {
                id: 1,
                name: 'pillow',
            },
            {
                id: 2,
                name: 'blanket',
            },
        ];
        // When
        const response = await request(testApp.getHttpServer()).post(gql).send(queryData);

        // Then
        expect(response.error).toBeFalsy();
        expect(response.body.data?.getCatalogs).toStrictEqual(expectedResult);
    });
});
