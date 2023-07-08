import { closeTestingModule, initializeTestingModule } from '../testUtils';

describe('getBookableResources Query', () => {
    beforeEach(async () => {
        await initializeTestingModule();
    });
    afterEach(async () => {
        await closeTestingModule();
    });

    it('returns a list of bookable resources', async () => {
        // Given the Customer has selected a product

        // When the Customer opens the checkout

        // Then the Customer sees a list of bookable resources with applicable discounts associated with it
    });
});
