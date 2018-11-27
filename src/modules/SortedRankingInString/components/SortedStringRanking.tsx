import * as React from 'react';

import { Grid, Toolbar, Typography } from '@material-ui/core';
import { join } from 'lodash';
import { IBlmEntity } from '../../BlmGenerator/model';

interface ISortedStringRanking {
    hidden?: boolean;
    algoritm: string;
    blm: IBlmEntity[];
}

export class SortedStringRanking extends React.Component<ISortedStringRanking, {}> {
    public render() {
        const { algoritm, blm, hidden } = this.props;
        return (
            <Grid container item>
                {hidden
                    ? null
                    : <Toolbar>
                        <Typography>
                            {algoritm}: [{this.mapToRanking(blm)}]
                        </Typography>
                    </Toolbar>
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
