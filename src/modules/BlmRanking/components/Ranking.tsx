import * as React from 'react';

import { Grid } from '@material-ui/core';
import { filter, reverse, sortBy } from 'lodash';
import { IIndicatorEntity } from '../../../containers/Practice';
import { GanttChart } from '../../BlmGanttChart';
import { IBlmEntity } from '../../BlmGenerator/model';
import { SortedStringRanking } from '../../SortedRankingInString';
import { RankingTable } from './RankingTable';

interface IRankingProps {
    algoritm: string;
    blm: IBlmEntity[][];
    blmMinTime: number;
}

interface IRankingState {
    anchorEl: any;
}

export class Ranking extends React.Component<IRankingProps, IRankingState> {
    constructor(props: IRankingProps) {
        super(props);
        this.state = {
            anchorEl: undefined,
        };
    }

    public render() {
        const { algoritm, blm, blmMinTime } = this.props;
        const blmAlgoritm: IBlmEntity[] = [];
        blm.map((column: IBlmEntity[]) =>
            filter(column, (o: IBlmEntity) => o.isExist)
            .map((el: IBlmEntity) =>
                blmAlgoritm.push({
                    id: el.id,
                    isSetted: el.isSetted,
                    wet: el.time,
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

        const wet: IBlmEntity[] = reverse(sortBy(blmAlgoritm, ['time']));
        const rpw: IBlmEntity[] = reverse(sortBy(blmAlgoritm, ['rpw']));
        const nof: IBlmEntity[] = reverse(sortBy(blmAlgoritm, ['nof']));
        const noif: IBlmEntity[] = reverse(sortBy(blmAlgoritm, ['noif']));
        const ranking: IBlmEntity[] = blmAlgoritm;
        return(
            <Grid container>
                {algoritm === ''
                    ? null
                    : <Grid container>
                        <RankingTable
                            ranking={ranking}
                            algoritm={algoritm}
                        />
                        <SortedStringRanking
                            algoritm={algoritm}
                            blm={
                                algoritm === 'WET' ? wet
                                : algoritm === 'RPW' ? rpw
                                : algoritm === 'NOF' ? nof
                                : algoritm === 'NOIF' ? noif
                                : []
                            }
                            disableStrikethrough={true}
                        />
                        <Grid container item>
                            {/* TODO */}
                            {/* <IconButton
                                onClick={(event: any) => this.setState({ anchorEl: event.currentTarget })}
                            >
                                <Settings color="primary"/>
                            </IconButton> */}
                            {/* <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={() => this.setState({ anchorEl: undefined })}
                            >
                            </Menu> */}
                            <GanttChart
                                blmMinTime={blmMinTime}
                                ranking={
                                    algoritm === 'WET' ? wet
                                    : algoritm === 'RPW' ? rpw
                                    : algoritm === 'NOF' ? nof
                                    : algoritm === 'NOIF' ? noif
                                    : []
                                }
                                setGroups={(_: any) => null}
                                setItems={(_: any) => null}
                                setIndicators={(_: IIndicatorEntity) => null}
                                containerName="Example"
                            />
                        </Grid>
                    </Grid>
                }
            </Grid>
        );
    }
}
