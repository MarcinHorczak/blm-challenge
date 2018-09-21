import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import * as React from 'react';

interface ISelectAlgoritmProps {
    algoritm: string;
    setAlgoritm: (algoritm: string) => void;
}

interface ISelectAlgoritmState {
    open: boolean;
}

export class SelectAlgoritm extends React.Component<ISelectAlgoritmProps, ISelectAlgoritmState> {
    constructor(props: any) {
        super(props);
        this.state = {
            open: false,
        };
    }

    public render() {
        const { open } = this.state;
        const { algoritm, setAlgoritm } = this.props;
        return(
            <FormControl>
                <InputLabel>Algoritm</InputLabel>
                <Select
                    open={open}
                    onClose={() => this.setState({ open: false })}
                    onOpen={() => this.setState({ open: true })}
                    value={algoritm}
                    onChange={(event: any) => setAlgoritm(event.target.value)}
                    className="blm-ranking-algoritm-select"
                >
                    <MenuItem value=""><em>None</em></MenuItem>
                    <MenuItem value="WET">WET</MenuItem>
                    <MenuItem value="RPW">RPW</MenuItem>
                    <MenuItem value="NOF">NOF</MenuItem>
                    <MenuItem value="NOIF">NOIF</MenuItem>
                </Select>
            </FormControl>
        );
    }
}
