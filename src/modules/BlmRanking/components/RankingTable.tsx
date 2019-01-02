import * as React from 'react';

import { Grid, Table, TableBody, TableCell, TableRow } from '@material-ui/core';
import { get, isNil } from 'lodash';
import { IBlmEntity } from '../../BlmGenerator/model';
import { T } from '../../FormattedText';
import { blmRankingAlgoritm, IBlmRanking } from '../settings';

interface IRankingTableProps {
    ranking: IBlmEntity[];
    algoritm: string;
}

export class RankingTable extends React.Component<IRankingTableProps, {}> {
    public render() {
        const { ranking, algoritm } = this.props;
        return(
            <Grid container item style={{overflow: '-webkit-paged-x'}}>
                <Table padding="checkbox">
                    <TableBody>
                        <TableRow>
                            <TableCell><T value="number"/></TableCell>
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
                                    <React.Fragment key={a.name}>
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
                                    </React.Fragment>
                                );
                            })}
                        </TableRow>
                    </TableBody>
                </Table>
            </Grid>
        );
    }
}
