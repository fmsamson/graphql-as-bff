import { Query, Resolver, Args, ResolveField } from '@nestjs/graphql';
import { Bottle } from '../model/graph/bottle.model';
import { BottleInput } from '../model/input/bottle-input.model';
import { BottleService } from '../service/bottle.service';
import { Milk } from '../model/graph/milk.model';
import { MilkService } from '../service/milk.service';

@Resolver(() => Bottle)
export class BottleResolver {
    constructor(
        private readonly bottleService: BottleService,
        private readonly milkService: MilkService
    ){}

    @Query(() => Bottle)
    async babyCry(@Args('bottleInput') bottleInput: BottleInput) {
        const bottleApi = await this.bottleService.getBottleByType(bottleInput.type);
        return {
            name: bottleApi[0].name,
            status: 'new'
        };
    }

    @ResolveField('milk', () => Milk)
    async getMilk(@Args('bottleInput') bottleInput: BottleInput) {
        const milkApi = await this.milkService.getMilkByType(bottleInput.type);
        return {
            name: milkApi[0].name
        };
    }
}