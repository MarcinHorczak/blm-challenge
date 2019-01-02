export interface IItemsEntity {
    id: number;
    content: string;
    group: number;
    start: number;
    end: number;
    style?: string;
}

export interface IGroupsEntity {
    id: number;
    content: string;
}
