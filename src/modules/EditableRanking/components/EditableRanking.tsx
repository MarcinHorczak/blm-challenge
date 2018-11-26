import * as React from 'react';

import { Grid, TextField, Typography } from '@material-ui/core';
import { IBlmEntity } from '../../BlmGenerator/model';

interface IEditableRankingProps {
    algoritm: string;
    blmModel: IBlmEntity[][];
    visible: boolean;
    createdRanking: string;
    setCreatedRanking: (ranking: string) => void;
}

export class EditableRanking extends React.Component<IEditableRankingProps, {}> {
    public render() {
        const { algoritm, visible, createdRanking, setCreatedRanking } = this.props;
        return(
            <Grid container>
                {visible
                    ? <Grid>
                        <Typography>Please to create ranking:</Typography>
                        <Typography>Comma is default separator</Typography>
                        <Grid container>
                            {algoritm} = [
                            <TextField
                                value={createdRanking}
                                onChange={(event: any) => setCreatedRanking(event.target.value)}
                            />
                        </Grid>
                    </Grid>
                    : null
                }
            </Grid>
        );
    }
}
