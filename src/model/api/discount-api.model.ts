export class DiscountApi {
    asset_discounts: Discount[];
}

class Discount {
    discount_percentage: number;
    asset_id: string;
    product_id: string;
    level: string;
}
