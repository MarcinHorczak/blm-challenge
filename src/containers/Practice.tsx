import * as React from 'react';

import { Grid, Paper, Typography } from '@material-ui/core';
import { filter, find, get, isUndefined, lowerCase, reverse, sortBy } from 'lodash';
import { BlmChart } from '../modules/BlmChart';
import { GanttChart } from '../modules/BlmGanttChart';
import { IGroupsEntity, IItemsEntity } from '../modules/BlmGanttChart/model';
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

export interface IIndicatorEntity {
    LE: number;
    SL: number;
    T: number;
    TAlt: number;
}

interface IPracticeState {
    blmModel: IBlmEntity[][];
    algoritm: string;
    cycleTime: number;
    wags: IWagEntity[];
    ranking: IBlmEntity[];
    correctRanking: IBlmEntity[];
    validations: string[];
    isWagTableFull: boolean;
    update: boolean;
    indicators: IIndicatorEntity;
    correctIndicators: IIndicatorEntity;
    isGanttFull: boolean;
    isCorrectGanttOpened: boolean;
    createdItems: IItemsEntity[];
    createdGroups: IGroupsEntity[];
    correctItems: IItemsEntity[];
    correctGroups: IGroupsEntity[];
    areWagsCorrect: boolean;
    areItemsCorrect: boolean;
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
                correctValue: 0,
            };
        }
        this.state = {
            blmModel: [],
            algoritm: '',
            cycleTime: 12,
            wags,
            ranking: [],
            correctRanking: [],
            validations: [],
            isWagTableFull: false,
            update: false,
            indicators: {
                LE: 0,
                SL: 0,
                T: 0,
                TAlt: 0,
            },
            correctIndicators: {
                LE: 0,
                SL: 0,
                T: 0,
                TAlt: 0,
            },
            isGanttFull: false,
            isCorrectGanttOpened: false,
            createdGroups: [],
            createdItems: [],
            correctGroups: [],
            correctItems: [],
            areWagsCorrect: false,
            areItemsCorrect: false,
        };
    }

    public componentDidUpdate(_: any, prevState: IPracticeState) {
        const {
            update,
            isWagTableFull,
            wags,
            blmModel,
            correctItems,
            areWagsCorrect,
        } = this.state;
        if (update && isWagTableFull) {
            const blm: IBlmEntity[] = [];
            const ranking: IBlmEntity[] = [];
            const correctRanking: IBlmEntity[] = [];
            const sortedWags: IWagEntity[] = reverse(sortBy(reverse(sortBy(wags, ['id'])), ['wag']));

            blmModel.map((column: IBlmEntity[]) =>
                filter(column, (o: IBlmEntity) => o.isExist)
                .map((el: IBlmEntity) =>
                    blm.push({
                        id: el.id,
                        isSetted: false,
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
                        correctRanking.push(blm[i]);
                    }
                }
            });

            this.setState({ ranking, update: false, correctRanking });
        }

        if (prevState.correctItems !== correctItems && areWagsCorrect) {
            this.validateItemsAndIndicators();
        }
    }

    public render() {
        const d = 0.02;
        const {
            blmModel,
            algoritm,
            cycleTime,
            ranking,
            isWagTableFull,
            isGanttFull,
            isCorrectGanttOpened,
            createdGroups,
            createdItems,
            areWagsCorrect,
            areItemsCorrect,
            correctIndicators,
            correctRanking,
            indicators,
        } = this.state;
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
                    disabled={isCorrectGanttOpened}
                />
                <SelectCycleTime
                    hidden={algoritm === ''}
                    getTime={(time: number) => this.setState({ cycleTime: time })}
                    time={cycleTime}
                    disabled={isCorrectGanttOpened}
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
                    blm={correctRanking}
                    disableStrikethrough={false}
                />
                <EditableGanttChart
                    hidden={!isWagTableFull}
                    ranking={ranking}
                    setRanking={(r: IBlmEntity[]) => this.updateBlmSchema(r)}
                    disabledTools={isCorrectGanttOpened}
                    groups={createdGroups}
                    items={createdItems}
                    setGroups={(g: IGroupsEntity[]) => this.setState({ createdGroups: g })}
                    setItems={(i: IItemsEntity[]) => this.setState({ createdItems: i })}
                />
                <EditableIndicatorTable
                    hidden={!isGanttFull}
                    setIndicators={(LE: number, SL: number, TT: number) => this.setIndicatorsAndValidate(LE, SL, TT)}
                    disabled={isCorrectGanttOpened}
                    correctIndicators={correctIndicators}
                />
                {isCorrectGanttOpened
                    ? <Paper style={{backgroundColor: '#bfcefd', padding: '10px'}}>
                        {areWagsCorrect
                            ? areItemsCorrect
                            && indicators.LE + d >= correctIndicators.LE
                            && indicators.LE - d <= correctIndicators.LE
                            && indicators.SL + d >= correctIndicators.SL
                            && indicators.SL - d <= correctIndicators.SL
                            && ((indicators.T + d >= correctIndicators.T
                            && indicators.T - d <= correctIndicators.T)
                            || indicators.T + d >= correctIndicators.TAlt
                            && indicators.T - d <= correctIndicators.TAlt)
                                ? <Typography variant="title"><T value="wellDone"/></Typography>
                                : <>
                                    <Typography variant="title"><T value="correctSolution"/></Typography>
                                    <GanttChart
                                        hidden={false}
                                        blmMinTime={cycleTime}
                                        ranking={correctRanking}
                                        setGroups={(g: IGroupsEntity[]) => this.setState({ correctGroups: g })}
                                        setItems={(i: IItemsEntity[]) => this.setState({ correctItems: i })}
                                        setIndicators={(ind: IIndicatorEntity) => {
                                            this.setState({ correctIndicators: ind });
                                        }}
                                        containerName="Practice"
                                    />
                                </>
                            : <Typography variant="title">
                                <T value="weightsAndGanttAreNotCorrect"/>
                            </Typography>}
                    </Paper>
                    : null
                }
            </Grid>
        );
    }

    private setIndicatorsAndValidate(LE: number, SL: number, TT: number) {
        this.setState({ indicators: {LE, SL, T: TT, TAlt: 0}, isCorrectGanttOpened: true });
        this.validateWags();
    }

    private validateWags() {
        const { blmModel, algoritm } = this.state;
        const wags = this.state.wags;
        let areWagsCorrect = true;
        let found;
        blmModel.map((col: IBlmEntity[]) => col.map((modelItem: IBlmEntity) => {
            found = find(wags, (rankingElement: IWagEntity) => rankingElement.id === modelItem.id);
            if (!isUndefined(found)) {
                if (wags[found.id].wag === get(modelItem, lowerCase(algoritm), 0)) {
                    wags[found.id].isCorrect = true;
                    wags[found.id].isError = false;
                    wags[found.id].correctValue = get(modelItem, lowerCase(algoritm), 0);
                } else {
                    wags[found.id].isCorrect = false;
                    wags[found.id].isError = true;
                    wags[found.id].correctValue = get(modelItem, lowerCase(algoritm), 0);
                    areWagsCorrect = false;
                }
            }
        }));
        this.setState({ wags, areWagsCorrect });
    }

    private validateItemsAndIndicators() {
        const { createdItems, correctItems } = this.state;
        let areItemsCorrect = true;
        const validatedItems: IItemsEntity[] = [];
        let foundItem: IItemsEntity | undefined;
        createdItems.map((createdItem: IItemsEntity) => {
            foundItem = correctItems.find((correctItem: IItemsEntity) => correctItem.content === createdItem.content);
            if (!isUndefined(foundItem)) {
                if (
                    foundItem.start === createdItem.start
                    && foundItem.end === createdItem.end
                    && foundItem.group === createdItem.group
                ) {
                    createdItem.style = 'background-color: #5AB931';
                } else {
                    createdItem.style = 'background-color: red';
                    areItemsCorrect = false;
                }
                validatedItems.push(createdItem);
            }
        });
        this.setState({ createdItems: validatedItems, areItemsCorrect });
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
