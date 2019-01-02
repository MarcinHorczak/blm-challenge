export interface INodeEntity {
    id: number;
    label: string;
    fixed: boolean;
    x: number;
    y: number;
    color: object;
}

export interface IEdgeEntity {
    from: number;
    to: number;
}
