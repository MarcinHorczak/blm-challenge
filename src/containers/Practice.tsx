import * as React from 'react';

import { Grid, Typography } from '@material-ui/core';
import { filter, find, get, isUndefined, lowerCase, reverse, sortBy } from 'lodash';
import { BlmChart } from '../modules/BlmChart';
import { BlmGenerator } from '../modules/BlmGenerator';
import { IBlmEntity } from '../modules/BlmGenerator/model';
import { SelectAlgoritm, SelectCycleTime } from '../modules/BlmRanking';
import { EditableGanttChart } from '../modules/EditableGanttChart';
import { EditableIndicatorTable } from '../modules/EditableIndicatorTable';
import { EditableTable } from '../modules/EditableTable';
import { IWagEntity } from '../modules/EditableTable/model';
import { T } from '../modules/FormattedText';
import { SortedStringRanking } from '../modules/SortedRankingInString';
import { numberOfMachines } from '../settings';

interface IIndicatorEntity {
    LE: number;
    SL: number;
    T: number;
}

interface IPracticeState {
    blmModel: IBlmEntity[][];
    algoritm: string;
    cycleTime: number;
    wags: IWagEntity[];
    ranking: IBlmEntity[];
    validations: string[];
    isWagTableFull: boolean;
    update: boolean;
    indicators: IIndicatorEntity;
    isGanttFull: boolean;
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
            indicators: {
                LE: 0,
                SL: 0,
                T: 0,
            },
            isGanttFull: false,
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
                        wet: el.time,
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
        const { blmModel, algoritm, cycleTime, ranking, isWagTableFull, isGanttFull } = this.state;
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
                    disableStrikethrough={false}
                />
                <EditableGanttChart
                    hidden={!isWagTableFull}
                    ranking={ranking}
                    setRanking={(r: IBlmEntity[]) => this.updateBlmSchema(r)}
                />
                <EditableIndicatorTable
                    hidden={!isGanttFull}
                    setIndicators={(LE: number, SL: number, TT: number) => this.setIndicatorsAndValidate(LE, SL, TT)}
                />
            </Grid>
        );
    }

    private setIndicatorsAndValidate(LE: number, SL: number, TT: number) {
        this.setState({ indicators: {LE, SL, T: TT} });
        this.validate();
    }

    private validate() {
        const { blmModel, algoritm } = this.state;
        const wags = this.state.wags;
        let found;
        blmModel.map((col: IBlmEntity[]) => col.map((modelItem: IBlmEntity) => {
            found = find(wags, (rankingElement: IWagEntity) => rankingElement.id === modelItem.id);
            if (!isUndefined(found)) {
                if (wags[found.id].wag === get(modelItem, lowerCase(algoritm), 0)) {
                    wags[found.id].isCorrect = true;
                    wags[found.id].isError = false;
                } else {
                    wags[found.id].isCorrect = false;
                    wags[found.id].isError = true;
                }
            }
        }));
        this.setState({ wags });
    }

    private updateBlmSchema(ranking: IBlmEntity[]) {
        let isGanttFull = true;
        const blmModel = [...this.state.blmModel];
        blmModel.forEach((col: IBlmEntity[]) => {
            col.forEach((modelItem: IBlmEntity) => {
                ranking.map((rankingItem: IBlmEntity) => {
                    if (rankingItem.id === modelItem.id) {
                        modelItem.isSetted = rankingItem.isSetted;
                    }
                    if (!rankingItem.isSetted) {
                        isGanttFull = false;
                    }
                });
            });
        });
        this.setState({ ranking, blmModel, isGanttFull });
    }
}
