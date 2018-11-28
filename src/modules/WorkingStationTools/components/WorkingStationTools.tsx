import * as React from 'react';

import { Button, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from '@material-ui/core';
import { isNaN, isNil, isUndefined, maxBy } from 'lodash';
import { IGroupsEntity, IItemsEntity } from '../../BlmGanttChart/model';
import { IBlmEntity } from '../../BlmGenerator/model';
import { T } from '../../FormattedText';

interface IWorkingStationToolsProps {
    items: IItemsEntity[];
    setItems: (items: IItemsEntity[]) => void;
    groups: IGroupsEntity[];
    setGroups: (groups: IGroupsEntity[]) => void;
    ranking: IBlmEntity[];
    setRanking: (ranking: IBlmEntity[]) => void;
    setOptionTime: (time: number) => void;
}

interface IWorkingStationToolsState {
    isAddPanelOpened: boolean;
    isSelectItemsOpened: boolean;
    isSelectGroupsOpened: boolean;
    selectedItem: number;
    selectedGroup: number;
}

export class WorkingStationTools extends React.Component<IWorkingStationToolsProps, IWorkingStationToolsState> {
    constructor(props: IWorkingStationToolsProps) {
        super(props);
        this.state = {
            isAddPanelOpened: false,
            isSelectItemsOpened: false,
            isSelectGroupsOpened: false,
            selectedItem: NaN,
            selectedGroup: NaN,
        };
    }

    public render() {
        const { groups, ranking } = this.props;
        const {
            isAddPanelOpened,
            isSelectItemsOpened,
            selectedItem,
            isSelectGroupsOpened,
            selectedGroup,
        } = this.state;
        return(
            <Grid container spacing={16}>
                <Grid item xs={4}>
                    <Button
                        variant="outlined"
                        onClick={() => this.setState({ isAddPanelOpened: true })}
                        fullWidth
                        disabled={isAddPanelOpened || groups.length === 0}
                    >
                        Add to working station
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => this.onChangeWorkingStation(1)}
                        fullWidth
                        disabled={isAddPanelOpened}
                    >
                        Open new working station
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => this.onChangeWorkingStation(-1)}
                        fullWidth
                        disabled={isAddPanelOpened || groups.length === 0}
                    >
                        Close last working station
                    </Button>
                </Grid>
                {isAddPanelOpened
                    ? <>
                        <Grid item xs={4}>
                            <Grid container>
                                <FormControl>
                                    <InputLabel>Select operation</InputLabel>
                                    <Select
                                        open={isSelectItemsOpened}
                                        onClose={() => this.setState({ isSelectItemsOpened: false })}
                                        onOpen={() => this.setState({ isSelectItemsOpened: true })}
                                        value={isNaN(selectedItem) ? '' : selectedItem}
                                        onChange={(event: any) => this.setState({ selectedItem: event.target.value })}
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
                                        onChange={(event: any) => this.setState({ selectedGroup: event.target.value })}
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
                                onClick={() => this.addItemToChart()}
                                fullWidth
                                disabled={isNaN(selectedItem) || isNaN(selectedGroup)}
                            >
                                Add
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => this.setState({ isAddPanelOpened: false })}
                                fullWidth
                            >
                                Close
                            </Button>
                        </Grid>
                    </>
                    : null
                }
            </Grid>
        );
    }

    private addItemToChart() {
        const ranking = [...this.props.ranking];
        const { selectedGroup, selectedItem } = this.state;
        const items = [...this.props.items];
        const element = ranking.find((obj: IBlmEntity) => obj.id === selectedItem);
        let rankingElement = ranking[0];
        if (!isNil(element)) {
            rankingElement = element;
        }
        ranking[rankingElement.id - 1].isSetted = true;

        let lastGroupValue = 0;
        const maxTimeGroupValue = maxBy(items.filter((item: IItemsEntity) => item.group === selectedGroup), 'end');
        if (!isNil(maxTimeGroupValue)) {
            lastGroupValue = maxTimeGroupValue.end;
        }

        items.push({
            id: selectedItem,
            group: selectedGroup,
            content: `${rankingElement.id}(${rankingElement.time})`,
            start: lastGroupValue,
            end: rankingElement.time + lastGroupValue,
        });
        this.props.setItems(items);
        this.props.setRanking(ranking);
        this.setState({ isAddPanelOpened: false, selectedItem: NaN, selectedGroup: NaN });
        let maxTimeGlobalValue = 0;
        const maxTimeValue = maxBy(items, 'end');
        if (!isUndefined(maxTimeValue)) {
            maxTimeGlobalValue = maxTimeValue.end;
        }
        this.props.setOptionTime(maxTimeGlobalValue);
    }

    private onChangeWorkingStation(val: number) {
        const groups = [...this.props.groups];
        const ranking = [...this.props.ranking];
        const { items } = this.props;
        const iterator = groups.length + val;
        let filteredItems: IItemsEntity[] = [];
        let filteredRanking: IBlmEntity[] = [];
        if (val === 1) {
            groups.push({
                id: iterator,
                content: `Series ${iterator}`,
            });
        } else {
            groups.splice(-1);
            filteredItems = items.filter((item: IItemsEntity) => {
                const shouldFilter = item.group !== groups.length + 1;
                if (!shouldFilter) {
                    ranking[item.id - 1].isSetted = false;
                }
                return shouldFilter;
            });
            filteredRanking = ranking;
            this.props.setItems(filteredItems);
            this.props.setRanking(filteredRanking);
        }
        this.props.setGroups(groups);
    }
}
