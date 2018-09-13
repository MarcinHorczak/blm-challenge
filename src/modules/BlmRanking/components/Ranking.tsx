import * as React from 'react';

import { Grid } from '@material-ui/core';
import { filter, join, reverse, sortBy } from 'lodash';
import { IBlmEntity } from '../../BlmGenerator/model';

interface IRankingProps {
    algoritm: string;
    blm: IBlmEntity[][];
}

export class Ranking extends React.Component<IRankingProps, {}> {
    public render() {
        const ranking: number[] = [];
        const { algoritm, blm } = this.props;
        const blmAlgoritm: IBlmEntity[] = [];
        blm.map((column: IBlmEntity[]) =>
            filter(column, (o: IBlmEntity) => o.isExist)
            .map((element: IBlmEntity) =>
                blmAlgoritm.push(element),
            ),
        );
        reverse(sortBy(reverse(blmAlgoritm), ['time'])).map((element: IBlmEntity) => ranking.push(element.id));
        const wet = join(ranking, ', ');
        return(
            <Grid container>
                {algoritm !== '' && <>{algoritm}: [</>}
                {algoritm === 'WET' && wet}
                {algoritm !== '' && <>]</>}
            </Grid>
        );
    }
}
