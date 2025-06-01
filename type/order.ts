export interface OrderCountDetail {
    sugar: string | null;
    ice: string | null;
    count: number;
}

export interface OrderCountByProduct {
    item: string;
    category: string;
    total: number;
    details: OrderCountDetail[];
}

export interface OrderCountSummary {
    data: OrderCountByProduct[];
    totalOrders: number;
}