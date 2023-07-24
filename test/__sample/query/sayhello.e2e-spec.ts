import { closeTestingModule, gql, initializeTestingModule, testApp } from '../../testUtils';
import request from 'supertest';

describe('sayHello Query', () => {
    beforeEach(async () => {
        await initializeTestingModule();
    });
    afterEach(async () => {
        await closeTestingModule();
    });

    it('should return Hello World', async () => {
        // Given
        const queryData = {
            query: `query { sayHello }`,
        };
        const expectedSayHello = 'Hello World!';

        // When
        const response = await request(testApp.getHttpServer())
            .post(gql).send(queryData);

        // Then
        expect(response.error).toBeFalsy();
        expect(response.body.data?.sayHello).toBe(expectedSayHello);
    });

    it('should return Hello John', async () => {
        // Given
        const nameInput = 'John';
        const queryData = {
            query: `query sayHello($nameInput: String) {
                    sayHello(name: $nameInput)
                }`,
            variables: { nameInput: nameInput },
        };
        const expectedSayHello = `Hello ${nameInput}!`;

        // When
        const response = await request(testApp.getHttpServer())
            .post(gql).send(queryData);

        // Then
        expect(response.error).toBeFalsy();
        expect(response.body.data?.sayHello).toBe(expectedSayHello);
    });
});
