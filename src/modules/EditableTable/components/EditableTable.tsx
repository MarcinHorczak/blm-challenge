import * as React from 'react';

import { Button, Grid, Table, TableBody, TableCell, TableRow, Tooltip, Typography } from '@material-ui/core';
import { numberOfMachines } from '../../../settings';
import { T } from '../../FormattedText';
import { IWagEntity } from '../model';

interface IEditableTableProps {
    setWags: (wags: IWagEntity[], isFull: boolean) => void;
    wag: IWagEntity[];
    hidden: boolean;
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
        const { wag, hidden } = this.props;
        const { open } = this.state;
        return(
            <Grid container>
                {
                    hidden
                    ? null
                    : <>
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
                                                <Tooltip
                                                    title={
                                                        wag[i + 1].isCorrect || wag[i + 1].isError
                                                            ? `Correct: ${wag[i + 1].correctValue}`
                                                            : ''
                                                        }
                                                    disableHoverListener={!wag[i + 1].isCorrect && !wag[i + 1].isError}
                                                    disableFocusListener={!wag[i + 1].isCorrect && !wag[i + 1].isError}
                                                    disableTouchListener={!wag[i + 1].isCorrect && !wag[i + 1].isError}
                                                    key={i + 1}
                                                >
                                                    <TableCell
                                                        onClick={() => (!wag[i + 1].isCorrect && !wag[i + 1].isError)
                                                            && this.openDialog(i + 1)}
                                                        style={wag[i + 1].isError
                                                            ? { backgroundColor: '#ff0000' }
                                                            : wag[i + 1].isCorrect
                                                                ? { backgroundColor: '#5AB931' }
                                                                : {}
                                                        }
                                                    >
                                                        <Typography>
                                                            {wag[i + 1].wag}
                                                        </Typography>
                                                    </TableCell>
                                                </Tooltip>
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
                                            <T value="selectWeightForOrder"/> {this.state.current}
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
                                            <T value="weight"/>: {this.state.currentValue}
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
                                                <T value="submitWeight"/>
                                            </Button>
                                        </Grid>
                                        <Grid item sm={4}>
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                onClick={() => this.setState({ open: false })}
                                            >
                                                <T value="cancel"/>
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            }
                        </Grid>
                    </>
                }
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
        for (let i = 1; i <= numberOfMachines; i++) {
            if (wag[i].wag === '_') {
                isFull = false;
            }
        }
        this.props.setWags(wag, isFull);
        this.setState({ open: false });
    }

    private tableContent() {
        const table = [];
        for (let i = 0; i < numberOfMachines; i++) {
            table.push(i);
        }
        return table;
    }
}
