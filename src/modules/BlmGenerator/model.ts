export interface IBlmConnections {
    top: boolean;
    middle: boolean;
    bottom: boolean;
}

export interface IBlmEntity {
    id: number;
    time: number;
    wet: number;
    rpw: number;
    nof: number;
    noif: number;
    isSetted: boolean;
    isExist: boolean;
    isChecked: boolean;
    isConnected: boolean;
    next: IBlmConnections;
    depends: number[];
}

export interface IGraphSettingsEntity {
    dragView: boolean;
    zoomView: boolean;
    navigationButtons: boolean;
}
