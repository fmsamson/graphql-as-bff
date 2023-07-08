import { closeTestingModule, gql, initializeTestingModule, testApp } from '../../testUtils';
import { UserInput } from '../../../src/model/input/__sample/user-input.model';
import * as request from 'supertest';
import { User } from '../../../src/model/graph/__sample/user.model';

describe('createUser Mutation', () => {
    beforeAll(async () => {
        await initializeTestingModule();
    });
    afterAll(async () => {
        await closeTestingModule();
    });

    it('should create user and return the id', async () => {
        // Given
        const userInput: UserInput = {
            name: 'John',
            lastname: 'Doe',
        };
        const queryData = {
            query: `mutation createUser($userVariable: UserInput!) {
                createUser(userInput: $userVariable) {
                    id
                }
            }`,
            variables: { userVariable: userInput },
        };
        const expectedResult: User = { id: 123 };

        // When
        const response = await request(testApp.getHttpServer()).post(gql).send(queryData);

        // Then
        expect(response.error).toBeFalsy();
        expect(response.body.data?.createUser).toStrictEqual(expectedResult);
    });
});
