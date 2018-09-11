import * as React from 'react';

import { Grid, Paper, Typography } from '@material-ui/core';
import { BlmGenerator } from '../modules/BlmGenerator';
import { IBlmEntity } from '../modules/BlmGenerator/model';

interface IPanelState {
    viewDetails: IBlmEntity | undefined;
}

export class Panel extends React.Component<{}, IPanelState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            viewDetails: undefined,
        };
    }

    public render() {
        const { viewDetails } = this.state;
        return (
            <Grid container direction="row" className="blm">
                <Grid item container>
                    <Typography variant="title">BLM Generator</Typography>
                </Grid>
                <BlmGenerator viewDetails={(item: IBlmEntity | undefined) => this.setState({ viewDetails: item })}/>
                <Grid item container>
                {viewDetails !== undefined
                    ? <Paper>
                        <table>
                            <tbody>
                                <tr><td>ID:</td><td>{viewDetails.id}</td></tr>
                                <tr><td>isExist:</td><td>{viewDetails.isExist.toString()}</td></tr>
                                <tr><td>isChecked:</td><td>{viewDetails.isChecked.toString()}</td></tr>
                                <tr><td>NEXT:</td></tr>
                                <tr><td>top:</td><td>{viewDetails.next.top.toString()}</td></tr>
                                <tr><td>middle:</td><td>{viewDetails.next.middle.toString()}</td></tr>
                                <tr><td>bottom:</td><td>{viewDetails.next.bottom.toString()}</td></tr>
                            </tbody>
                        </table>
                    </Paper>
                    : null
                }
                </Grid>
            </Grid>
        );
    }
}
