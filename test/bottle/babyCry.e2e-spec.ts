import { closeTestingModule, initializeTestingModule } from '../testUtils';

describe('getVacationBags Query', () => {
    beforeEach(async () => {
        await initializeTestingModule();
    });
    afterEach(async () => {
        await closeTestingModule();
    });

    it('returns the baby vacation bags', async () => {
        // Given a baby needs to sleep between 12nn to 2pm

        // When the baby goes to the beach between 10am to 4pm

        // Then the baby brings along his/her vacation stuff with a feeding bottle of formula milk
    });
});
