export interface BagItemDto {
    itemId: number;
    name: string;
    price: number;
    quantity: number;
    lineTotal: number;
}

export interface BagDto {
    id: number;
    items: BagItemDto[];
    subtotal: number;
    status: string;
}

export interface AddItemDto {
    itemId: number;
    quantity: number;
}

export interface UpdateItemDto {
    quantity: number;
}