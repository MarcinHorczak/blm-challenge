import * as React from 'react';

import { Button, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@material-ui/core';
import { isNumber } from 'lodash';
import { IGroupsEntity } from '../../BlmGanttChart/model';
import { IBlmEntity } from '../../BlmGenerator/model';
import { T } from '../../FormattedText';

interface IAddOperationPanelProps {
    selectedItem: number;
    setSelectedItem: (item: number) => void;
    ranking: IBlmEntity[];
    selectedGroup: number;
    setSelectedGroup: (group: number) => void;
    groups: IGroupsEntity[];
    addItemToChart: () => void;
    closeAddOperationPanel: () => void;
}

interface IAddOperationPanelState {
    isSelectItemsOpened: boolean;
    isSelectGroupsOpened: boolean;
}

export class AddOperationPanel extends React.Component<IAddOperationPanelProps, IAddOperationPanelState> {
    constructor(props: IAddOperationPanelProps) {
        super(props);
        this.state = {
            isSelectGroupsOpened: false,
            isSelectItemsOpened: false,
        };
    }

    public render() {
        const { selectedItem, ranking, selectedGroup, groups } = this.props;
        const { isSelectItemsOpened, isSelectGroupsOpened } = this.state;
        return(
            <>
                <Grid item xs={4}>
                    <Grid container>
                        <FormControl>
                            <InputLabel>Select operation</InputLabel>
                            <Select
                                open={isSelectItemsOpened}
                                onClose={() => this.setState({ isSelectItemsOpened: false })}
                                onOpen={() => this.setState({ isSelectItemsOpened: true })}
                                value={isNaN(selectedItem) ? '' : selectedItem}
                                onChange={(event: any) => this.props.setSelectedItem(event.target.value)}
                                style={{width: '250px'}}
                            >
                                <MenuItem value=""><em><T value="none"/></em></MenuItem>
                                {ranking
                                    .sort((a: IBlmEntity, b: IBlmEntity) => a.id - b.id)
                                    .filter((item: IBlmEntity) => !item.isSetted)
                                    .map((item: IBlmEntity) => {
                                        return (
                                            <MenuItem value={item.id} key={item.id}>
                                                {item.id}({item.time})
                                            </MenuItem>
                                        );
                                    })
                                }
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid container>
                        <FormControl>
                            <InputLabel>Select working station</InputLabel>
                            <Select
                                open={isSelectGroupsOpened}
                                onClose={() => this.setState({ isSelectGroupsOpened: false })}
                                onOpen={() => this.setState({ isSelectGroupsOpened: true })}
                                value={isNaN(selectedGroup) ? '' : selectedGroup}
                                onChange={(event: any) => isNumber(event.target.value)
                                    && this.props.setSelectedGroup(event.target.value)}
                                style={{width: '250px'}}
                            >
                                <MenuItem value=""><em><T value="none"/></em></MenuItem>
                                {groups.map((group: IGroupsEntity) => {
                                    return <MenuItem value={group.id} key={group.id}>{group.id}</MenuItem>; })
                                }
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid item xs={3}>
                    <Typography>
                        Operations will be added at the end of last operation in selected working station
                    </Typography>
                    <Button
                        variant="outlined"
                        onClick={() => this.props.addItemToChart()}
                        fullWidth
                        disabled={!isNumber(selectedItem) || isNaN(selectedGroup)}
                    >
                        Add
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => this.props.closeAddOperationPanel()}
                        fullWidth
                    >
                        Close
                    </Button>
                </Grid>
            </>
        );
    }
}
