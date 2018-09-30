import { IBlmConnections } from '../BlmGenerator/model';

export interface IGanttRankingEntity {
    id: number;
    time: number;
    isSetted: boolean;
    previous: IBlmConnections;
}

export interface IItemsEntity {
    id: number;
    content: string;
    group: number;
    start: number;
    end: number;
}

export interface IGroupsEntity {
    id: number;
    content: string;
}
