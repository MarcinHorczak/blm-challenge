import * as React from 'react';

import { Grid, Table, TableBody, TableCell, TableRow, Toolbar, Typography } from '@material-ui/core';
import { filter, get, isNil, join, reverse, sortBy } from 'lodash';
import { IBlmEntity } from '../../BlmGenerator/model';
import { blmRankingAlgoritm, IBlmRanking } from '../settings';

interface IRankingProps {
    algoritm: string;
    blm: IBlmEntity[][];
}

export class Ranking extends React.Component<IRankingProps, {}> {
    public render() {
        const { algoritm, blm } = this.props;
        const blmAlgoritm: IBlmEntity[] = [];
        blm.map((column: IBlmEntity[]) =>
            filter(column, (o: IBlmEntity) => o.isExist)
            .map((element: IBlmEntity) =>
                blmAlgoritm.push(element),
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
                        <Grid container item>
                            <Table padding="checkbox">
                                <TableBody>
                                    <TableRow>
                                        <TableCell>Number</TableCell>
                                        {
                                            ranking.map((item: IBlmEntity) =>
                                                <TableCell key={item.id}>{item.id}</TableCell>,
                                            )
                                        }
                                    </TableRow>
                                    <TableRow>
                                        {blmRankingAlgoritm.map((a: IBlmRanking) => {
                                            return (
                                                !algoritm.localeCompare(a.name) &&
                                                <>
                                                    <TableCell>{a.countBy}</TableCell>
                                                    {
                                                        ranking.map((item: IBlmEntity) =>
                                                            <TableCell key={item.id}>
                                                                {
                                                                    get(item,
                                                                        isNil(a.getBy)
                                                                            ? a.name.toLocaleLowerCase()
                                                                            : a.getBy.toLocaleLowerCase(),
                                                                        )
                                                                }
                                                            </TableCell>,
                                                        )
                                                    }
                                                </>
                                            );
                                        })}
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Grid>
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
