import { closeTestingModule, initializeTestingModule } from '../testUtils';

describe('isPaymentMethodNeeded Query', () => {
    beforeEach(async () => {
        await initializeTestingModule();
    });
    afterEach(async () => {
        await closeTestingModule();
    });

    it('returns false if exempted for payment', async () => {
        // Given the Customer has selected a product and resources
        // And all the resources selected has 100% resource discounts

        // When the Customer goes to the payment method page

        // Then the Customer is not required for a payment method
    });
});
