import * as React from 'react';

import { Button, Grid, Table, TableBody, TableCell, TableRow, TextField } from '@material-ui/core';
import { T as Translation } from '../../FormattedText/components/FormattedText';

interface IEditableIndicatorTableProps {
    hidden?: boolean;
    setIndicators: (LE: number, SL: number, T: number) => void;
    disabled: boolean;
}

interface IEditableIndicatorTableState {
    LE: string;
    SL: string;
    T: string;
    submitButton: boolean;
    step: string;
}

export class EditableIndicatorTable extends React.Component<IEditableIndicatorTableProps,
                                                            IEditableIndicatorTableState> {
    constructor(props: IEditableIndicatorTableProps) {
        super(props);
        this.state = {
            LE: '',
            SL: '',
            T: '',
            submitButton: false,
            step: '0.01',
        };
    }

    public componentDidUpdate() {
        const { LE, SL, T, submitButton } = this.state;
        if (LE && SL && T && !submitButton) {
            this.setState({ submitButton: true });
        }
        if ((!LE || !SL || !T) && submitButton) {
            this.setState({ submitButton: false });
        }
    }

    public render() {
        const { hidden, disabled } = this.props;
        const { LE, SL, T, step, submitButton } = this.state;
        return (
            <Grid>
                {hidden
                    ? null
                    : <Grid>
                        {disabled ? null : <Translation value="pleaseToTypeIndicators"/>}
                        <Table padding="checkbox">
                            <TableBody>
                                <TableRow>
                                    <TableCell><Translation value="indicator"/>:</TableCell>
                                    <TableCell>LE</TableCell>
                                    <TableCell>SL</TableCell>
                                    <TableCell>T</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell><Translation value="value"/>:</TableCell>
                                    <TableCell>
                                        <TextField
                                            value={LE}
                                            onChange={(e: any) => this.setState({ LE: e.target.value })}
                                            type="number"
                                            inputProps={{step}}
                                            disabled={disabled}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            value={SL}
                                            onChange={(e: any) => this.setState({ SL: e.target.value })}
                                            type="number"
                                            inputProps={{step}}
                                            disabled={disabled}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            value={T}
                                            onChange={(e: any) => this.setState({ T: e.target.value })}
                                            type="number"
                                            inputProps={{step}}
                                            disabled={disabled}
                                        />
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        {disabled ? null : <Button
                            variant="outlined"
                            disabled={!submitButton}
                            onClick={() => this.props.setIndicators(parseFloat(LE), parseFloat(SL), parseFloat(T))}
                        >
                            <Translation value="submitAndFinish"/>
                        </Button>}
                    </Grid>
                }
            </Grid>
        );
    }
}
