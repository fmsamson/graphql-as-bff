import { closeTestingModule, gql, initializeTestingModule, testApp } from '../../testUtils';
import request from 'supertest';

describe('sayHello Query', () => {
    beforeEach(async () => {
        await initializeTestingModule();
    });
    afterEach(async () => {
        await closeTestingModule();
    });

    it('POST method: should return Hello World', async () => {
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

    it('GET method: should return Hello World', async () => {
        // Given
        const query = `{ sayHello }`;
        const expectedSayHello = 'Hello World!';
        const url = `${gql}?query=${query}`;

        // When
        const response = await request(testApp.getHttpServer()).get(url)
            .set('Content-Type',  'application/json');

        // Then
        expect(response.error).toBeFalsy();
        expect(response.body.data?.sayHello).toBe(expectedSayHello);
    });

    it('POST method: should return Hello John', async () => {
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

    it('GET method: should return Hello John', async () => {
        // Given
        const nameInput = 'John';
        const query = [`query sayHello($nameInput: String) {`,
            `sayHello(name: $nameInput)`,
        `}`];
        const variables = { nameInput: nameInput };
        const expectedSayHello = `Hello ${nameInput}!`;
        const url = `${gql}?query=${query}&variables=${JSON.stringify(variables)}`;

        // When
        const response = await request(testApp.getHttpServer()).get(url)
            .set('Content-Type',  'application/json');

        // Then
        expect(response.error).toBeFalsy();
        expect(response.body.data?.sayHello).toBe(expectedSayHello);
    });
});
