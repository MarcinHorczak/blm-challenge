import * as React from 'react';

import { Grid, IconButton, Menu, Toolbar, Typography } from '@material-ui/core';
import { Settings } from '@material-ui/icons';
import { filter, join, reverse, sortBy } from 'lodash';
import { GanttChart } from '../../BlmGanttChart';
import { IBlmEntity } from '../../BlmGenerator/model';
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
        const { anchorEl } = this.state;
        const blmAlgoritm: IBlmEntity[] = [];
        blm.map((column: IBlmEntity[]) =>
            filter(column, (o: IBlmEntity) => o.isExist)
            .map((el: IBlmEntity) =>
                blmAlgoritm.push({
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
        const ranking: IBlmEntity[] = reverse(blmAlgoritm);
        const wet: IBlmEntity[] = reverse(sortBy(blmAlgoritm, ['time']));
        const rpw: IBlmEntity[] = reverse(sortBy(blmAlgoritm, ['rpw']));
        const nof: IBlmEntity[] = reverse(sortBy(blmAlgoritm, ['nof']));
        const noif: IBlmEntity[] = reverse(sortBy(blmAlgoritm, ['noif']));
        reverse(ranking);
        return(
            <Grid container>
                {algoritm === ''
                    ? null
                    : <Grid container>
                        <RankingTable
                            ranking={ranking}
                            algoritm={algoritm}
                        />
                        <Grid container item>
                            <Toolbar>
                                <Typography>
                                    {algoritm}: [
                                    {algoritm === 'WET' && this.mapToRanking(wet)}
                                    {algoritm === 'RPW' && this.mapToRanking(rpw)}
                                    {algoritm === 'NOF' && this.mapToRanking(nof)}
                                    {algoritm === 'NOIF' && this.mapToRanking(noif)}
                                    ]
                                </Typography>
                            </Toolbar>
                        </Grid>
                        <Grid container item>
                            <IconButton
                                onClick={(event: any) => this.setState({ anchorEl: event.currentTarget })}
                            >
                                <Settings color="primary"/>
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={() => this.setState({ anchorEl: undefined })}
                            >
                            </Menu>
                            <GanttChart
                                blmMinTime={blmMinTime}
                                ranking={
                                    algoritm === 'WET' ? wet
                                    : algoritm === 'RPW' ? rpw
                                    : algoritm === 'NOF' ? nof
                                    : algoritm === 'NOIF' ? noif
                                    : []
                                }
                            />
                        </Grid>
                    </Grid>
                }
            </Grid>
        );
    }

    private mapToRanking(blmRanking: IBlmEntity[]): string {
        const ranking: number[] = [];
        blmRanking.map((element: IBlmEntity) => ranking.push(element.id));
        return join(ranking, ', ');
    }
}
