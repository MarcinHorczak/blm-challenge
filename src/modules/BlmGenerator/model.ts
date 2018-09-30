export interface IBlmConnections {
    top: boolean;
    middle: boolean;
    bottom: boolean;
}

export interface IBlmEntity {
    id: number;
    time: number;
    rpw: number;
    nof: number;
    noif: number;
    isExist: boolean;
    isChecked: boolean;
    isConnected: boolean;
    next: IBlmConnections;
    previous: IBlmConnections;
}
