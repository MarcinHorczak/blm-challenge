import * as React from 'react';

import { Grid, Typography } from '@material-ui/core';
import { IBlmEntity } from '../../BlmGenerator/model';

interface IEditableRankingProps {
    algoritm: string;
    blmModel: IBlmEntity[][];
    visible: boolean;
}

export class EditableRanking extends React.Component<IEditableRankingProps, {}> {
    public render() {
        const { algoritm, visible } = this.props;
        return(
            <Grid container>
                {visible
                    ? <Grid>
                        <Typography>Please to create ranking:</Typography>
                        <Grid container>
                            {algoritm} = [
                        </Grid>
                    </Grid>
                    : null
                }
            </Grid>
        );
    }
}
