import * as React from 'react';

import { Button, Grid, Table, TableBody, TableCell, TableRow, Typography } from '@material-ui/core';
import { numberOfMachines } from '../../../settings';
import { IWagEntity } from '../model';

interface IEditableTableProps {
    setWags: (wags: IWagEntity[], isFull: boolean) => void;
    wag: IWagEntity[];
    isFull: boolean;
}

interface IEditableTableState {
    current: number;
    open: boolean;
    currentValue: number;
}

export class EditableTable extends React.Component<IEditableTableProps, IEditableTableState> {
    constructor(props: any) {
        super(props);
        this.state = {
            current: -1,
            open: false,
            currentValue: 0,
        };
    }

    public render() {
        const { wag, isFull } = this.props;
        const { open } = this.state;
        return(
            <Grid container>
                <Grid container item style={{overflow: '-webkit-paged-x'}}>
                    <Table padding="checkbox">
                        <TableBody>
                            <TableRow>
                                <TableCell>j</TableCell>
                                {this.tableContent().map((i: number) => <TableCell key={i}>{i + 1}</TableCell>)}
                            </TableRow>
                            <TableRow>
                                <TableCell>dj</TableCell>
                                {this.tableContent().map((i: number) => {
                                    return (
                                        <TableCell onClick={() => this.openDialog(i)} key={i}>
                                            <Typography className={
                                                wag[i].isError ? 'error' : wag[i].isCorrect ? 'correct' : ''}
                                            >
                                                {wag[i].wag}
                                            </Typography>
                                        </TableCell>
                                    );
                                })}
                            </TableRow>
                        </TableBody>
                    </Table>
                </Grid>
                <Grid container>
                    {open
                        && <Grid container>
                            <Grid container>
                                <Typography variant="title">
                                    Select wag for order: {this.state.current}
                                </Typography>
                            </Grid>
                            <Grid item sm={2}>
                                <Button
                                    color="primary"
                                    fullWidth
                                    variant="outlined"
                                    onClick={() => this.setState({ currentValue: this.state.currentValue - 5 })}
                                >-5</Button>
                            </Grid>
                            <Grid item sm={2}>
                                <Button
                                    color="primary"
                                    fullWidth
                                    variant="outlined"
                                    onClick={() => this.setState({ currentValue: this.state.currentValue - 1 })}
                                >-1</Button>
                            </Grid>
                            <Grid item sm={4}>
                                <Typography
                                    color="primary"
                                    variant="title"
                                    align="center"
                                >
                                    Wag: {this.state.currentValue}
                                </Typography>
                            </Grid>
                            <Grid item sm={2}>
                                <Button
                                    color="primary"
                                    fullWidth
                                    variant="outlined"
                                    onClick={() => this.setState({ currentValue: this.state.currentValue + 1 })}
                                >+1</Button>
                            </Grid>
                            <Grid item sm={2}>
                                <Button
                                    color="primary"
                                    fullWidth
                                    variant="outlined"
                                    onClick={() => this.setState({ currentValue: this.state.currentValue + 5 })}
                                >+5</Button>
                            </Grid>
                            <Grid container>
                                <Grid item sm={8}>
                                    <Button
                                        color="primary"
                                        fullWidth
                                        variant="contained"
                                        onClick={() => this.saveWag()}
                                    >
                                        Submit wag
                                    </Button>
                                </Grid>
                                <Grid item sm={4}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        onClick={() => this.setState({ open: false })}
                                    >
                                        Cancel
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    }
                    {!open && isFull &&
                        <Grid container>
                            <Button
                                color="primary"
                                fullWidth
                                variant="contained"
                                onClick={() => this.checkWags()}
                            >
                                Wags are created
                            </Button>
                        </Grid>
                    }
                </Grid>
            </Grid>
        );
    }

    private openDialog(pos: number) {
        const wag = {...this.props.wag};
        let currentValue = 0;
        if (wag[pos].wag !== '_') {
            currentValue = wag[pos].wag;
        }
        this.setState({ current: pos, open: true, currentValue });
    }

    private saveWag() {
        const wag = {...this.props.wag};
        let isFull = true;
        wag[this.state.current].wag = this.state.currentValue;
        for (let i = 0; i < numberOfMachines; i++) {
            if (wag[i].wag === '_') {
                isFull = false;
            }
        }
        this.props.setWags(wag, isFull);
        this.setState({ open: false });
    }

    private checkWags() {
        const wag = {...this.props.wag};
        const table = [];
        let isError = false;
        for (let i = 0; i < numberOfMachines; i++) {
            if (wag[i].wag === '_') {
                table.push(i + 1);
                isError = true;
            }
        }
        if (!isError) {
            this.props.setWags(this.props.wag, true);
        }
    }

    private tableContent() {
        const table = [];
        for (let i = 0; i < numberOfMachines; i++) {
            table.push(i);
        }
        return table;
    }
}
