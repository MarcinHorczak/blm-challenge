export interface IBlmConnections {
    top: boolean;
    middle: boolean;
    bottom: boolean;
}

export interface IBlmEntity {
    id: number;
    isExist: boolean;
    isMainLine: boolean;
    isConnected: boolean;
    isChecked: boolean;
    previous: IBlmConnections;
    next: IBlmConnections;
}
