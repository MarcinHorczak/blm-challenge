export interface IBlmRanking {
    name: string;
    countBy: string;
    getBy?: string;
}

export const blmRankingAlgoritm: IBlmRanking[] = [
    {
        name: 'WET',
        countBy: 'Time',
        getBy: 'time',
    },
    {
        name: 'RPW',
        countBy: 'Time',
    },
    {
        name: 'NOF',
        countBy: 'NOF',
    },
    {
        name: 'NOIF',
        countBy: 'NOIF',
    },
];
