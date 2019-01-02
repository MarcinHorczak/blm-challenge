import * as React from 'react';

import { Button, FormControl, Grid, InputLabel, MenuItem, Select } from '@material-ui/core';
import { isNumber } from 'lodash';
import { IGroupsEntity } from '../../BlmGanttChart/model';
import { T } from '../../FormattedText';

interface IDeleteOperationPanelProps {
    groups: IGroupsEntity[];
    setSelectedGroup: (id: number) => void;
    setDeletePanel: (flag: boolean) => void;
}

interface IDeleteOperationPanelState {
    isSelectGroupsOpened: boolean;
    selectedGroup: number;
}

export class DeleteOperationPanel extends React.Component<IDeleteOperationPanelProps, IDeleteOperationPanelState> {
    constructor(props: IDeleteOperationPanelProps) {
        super(props);
        this.state = {
            isSelectGroupsOpened: false,
            selectedGroup: NaN,
        };
    }

    public render() {
        const { groups } = this.props;
        const { isSelectGroupsOpened, selectedGroup } = this.state;
        return(
            <Grid item xs={7}>
                <T value="selectWorkStationToRemoveLastElement"/>
                <Grid container>
                    <FormControl>
                        <InputLabel><T value="selectWorkStation"/></InputLabel>
                        <Select
                            open={isSelectGroupsOpened}
                            onClose={() => this.setState({ isSelectGroupsOpened: false })}
                            onOpen={() => this.setState({ isSelectGroupsOpened: true })}
                            value={isNaN(selectedGroup) ? '' : selectedGroup}
                            onChange={(event: any) => isNumber(event.target.value)
                                    && this.setState({
                                        isSelectGroupsOpened: false,
                                        selectedGroup: event.target.value,
                                    })
                            }
                            style={{width: '250px'}}
                        >
                            <MenuItem value=""><em><T value="none"/></em></MenuItem>
                            {groups.map((group: IGroupsEntity) => {
                                return <MenuItem value={group.id} key={group.id}>{group.id}</MenuItem>; })
                            }
                        </Select>
                    </FormControl>
                </Grid>
                <Grid container>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            this.props.setSelectedGroup(this.state.selectedGroup);
                            this.props.setDeletePanel(false);
                            this.setState({ isSelectGroupsOpened: false, selectedGroup: NaN });
                        }}
                        fullWidth
                        disabled={isNaN(selectedGroup)}
                    >
                        <T value="remove"/>
                    </Button>
                </Grid>
                <Grid container>
                    <Button
                        variant="outlined"
                        onClick={() => this.props.setDeletePanel(false)}
                        fullWidth
                    >
                        <T value="cancel"/>
                    </Button>
                </Grid>
            </Grid>
        );
    }
}
