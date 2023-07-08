import { closeTestingModule, initializeTestingModule } from '../testUtils';

describe('createBooking Mutation', () => {
    beforeEach(async () => {
        await initializeTestingModule();
    });
    afterEach(async () => {
        await closeTestingModule();
    });

    it('returns success when booking is created', async () => {
        // Given the Customer has selected a product and resources
        // And accepted the terms and conditions

        // When the Customer confirms the booking

        // Then the Customer sees the success page
    });
});
