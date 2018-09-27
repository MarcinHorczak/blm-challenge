export interface INodeEntity {
    id: number;
    label: string;
    fixed: boolean;
    x: number;
    y: number;
}

export interface IEdgeEntity {
    from: number;
    to: number;
}
