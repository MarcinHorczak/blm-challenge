import * as React from 'react';

import { Grid, Typography } from '@material-ui/core';
import { filter, reverse, sortBy } from 'lodash';
import { BlmChart } from '../modules/BlmChart';
import { BlmGenerator } from '../modules/BlmGenerator';
import { IBlmEntity } from '../modules/BlmGenerator/model';
import { SelectAlgoritm, SelectCycleTime } from '../modules/BlmRanking';
import { EditableGanttChart } from '../modules/EditableGanttChart';
import { EditableTable } from '../modules/EditableTable';
import { IWagEntity } from '../modules/EditableTable/model';
import { T } from '../modules/FormattedText';
import { SortedStringRanking } from '../modules/SortedRankingInString';
import { numberOfMachines } from '../settings';

interface IPracticeState {
    blmModel: IBlmEntity[][];
    algoritm: string;
    cycleTime: number;
    wags: IWagEntity[];
    ranking: IBlmEntity[];
    validations: string[];
    isWagTableFull: boolean;
    update: boolean;
    createdRanking: string;
    createdGantt: vis.Timeline | undefined;
}

export class Practice extends React.Component<{}, IPracticeState> {
    constructor(props: {}) {
        super(props);
        const wags: IWagEntity[] = [];
        for (let i = 1; i <= numberOfMachines; i++) {
            wags[i] = {
                id: i,
                isCorrect: false,
                isError: false,
                wag: '_',
            };
        }
        this.state = {
            blmModel: [],
            algoritm: '',
            cycleTime: 12,
            wags,
            ranking: [],
            validations: [],
            isWagTableFull: false,
            update: false,
            createdRanking: '',
            createdGantt: undefined,
        };
    }

    public componentDidUpdate() {
        const { update, isWagTableFull, wags, blmModel } = this.state;
        if (update && isWagTableFull) {
            const blm: IBlmEntity[] = [];
            const ranking: IBlmEntity[] = [];
            const sortedWags: IWagEntity[] = reverse(sortBy(reverse(sortBy(wags, ['id'])), ['wag']));

            blmModel.map((column: IBlmEntity[]) =>
                filter(column, (o: IBlmEntity) => o.isExist)
                .map((el: IBlmEntity) =>
                    blm.push({
                        id: el.id,
                        isSetted: el.isSetted,
                        time: el.time,
                        depends: el.depends,
                        isChecked: el.isChecked,
                        isConnected: el.isConnected,
                        isExist: el.isExist,
                        next: el.next,
                        nof: el.nof,
                        noif: el.noif,
                        rpw: el.rpw,
                    }),
                ),
            );

            sortedWags.map((wag: IWagEntity) => {
                for (let i = 0; i < numberOfMachines; i++) {
                    if (wag.id === blm[i].id) {
                        ranking.push(blm[i]);
                    }
                }
            });

            this.setState({ ranking, update: false });
        }
    }

    public render() {
        const { blmModel, algoritm, cycleTime, ranking, isWagTableFull, createdGantt } = this.state;
        return (
            <Grid className="blm">
                <Grid item container>
                    <Typography variant="title">
                        <T value="practiceSection"/>
                    </Typography>
                </Grid>
                <BlmGenerator
                    blmModel={(blm: IBlmEntity[][]) => this.setState({ blmModel: blm })}
                    hidden={true}
                />
                <BlmChart blm={blmModel}/>
                <SelectAlgoritm
                    algoritm={algoritm}
                    setAlgoritm={(method: string) => this.setState({ algoritm: method, update: true })}
                />
                <SelectCycleTime
                    hidden={algoritm === ''}
                    getTime={(time: number) => this.setState({ cycleTime: time })}
                    time={cycleTime}
                />
                <EditableTable
                    hidden={algoritm === ''}
                    setWags={(wags: IWagEntity[], isFull: boolean) =>
                        this.setState({ wags, isWagTableFull: isFull, update: true })
                    }
                    wag={this.state.wags}
                />
                <SortedStringRanking
                    hidden={!isWagTableFull}
                    algoritm={algoritm}
                    blm={ranking}
                />
                <EditableGanttChart
                    hidden={!isWagTableFull}
                    createdGantt={createdGantt}
                    setGantt={(gantt: vis.Timeline | undefined) => this.setState({ createdGantt: gantt })}
                />
            </Grid>
        );
    }
}
