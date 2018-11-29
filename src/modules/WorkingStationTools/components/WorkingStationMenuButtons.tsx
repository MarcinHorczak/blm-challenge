import * as React from 'react';

import { Button, Grid } from '@material-ui/core';
import { IGroupsEntity, IItemsEntity } from '../../BlmGanttChart/model';

interface IWorkingStationMenuButtonsProps {
    isAddOperationPanelOpened: boolean;
    setOperationPanel: (flag: boolean) => void;
    groups: IGroupsEntity[];
    items: IItemsEntity[];
    onChangeWorkingStation: (value: number) => void;
    setDeletePanel: (flag: boolean) => void;
    isDeleteOperationPanelOpened: boolean;
}

export class WorkingStationMenuButton extends React.Component<IWorkingStationMenuButtonsProps, {}> {
    public render() {
        const { groups, isAddOperationPanelOpened, items, isDeleteOperationPanelOpened } = this.props;
        return(
            <Grid item xs={4}>
                <Button
                    variant="outlined"
                    onClick={() => this.props.setOperationPanel(true)}
                    fullWidth
                    disabled={isDeleteOperationPanelOpened || isAddOperationPanelOpened || groups.length === 0}
                >
                    Add operation to working station
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => this.props.onChangeWorkingStation(1)}
                    fullWidth
                    disabled={isDeleteOperationPanelOpened || isAddOperationPanelOpened}
                >
                    Open new working station
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => this.props.setDeletePanel(true)}
                    fullWidth
                    disabled={isDeleteOperationPanelOpened || isAddOperationPanelOpened || items.length === 0}
                >
                    Delete operation
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => this.props.onChangeWorkingStation(-1)}
                    fullWidth
                    disabled={isDeleteOperationPanelOpened || isAddOperationPanelOpened || groups.length === 0}
                >
                    Close last working station
                </Button>
            </Grid>
        );
    }
}
