import * as React from 'react';

import { Grid } from '@material-ui/core';
import { isEqual, isNil, isUndefined, last, maxBy, remove } from 'lodash';
import { IGroupsEntity, IItemsEntity } from '../../BlmGanttChart/model';
import { IBlmEntity } from '../../BlmGenerator/model';
import { AddOperationPanel } from './AddOperationPanel';
import { DeleteOperationPanel } from './DeleteOperationPanel';
import { WorkingStationMenuButton } from './WorkingStationMenuButtons';

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
    isAddOperationPanelOpened: boolean;
    isDeleteOperationPanelOpened: boolean;
    selectedItem: number;
    selectedGroup: number;
}

export class WorkingStationTools extends React.Component<IWorkingStationToolsProps, IWorkingStationToolsState> {
    constructor(props: IWorkingStationToolsProps) {
        super(props);
        this.state = {
            isAddOperationPanelOpened: false,
            isDeleteOperationPanelOpened: false,
            selectedItem: NaN,
            selectedGroup: NaN,
        };
    }

    public render() {
        const { groups, ranking, items } = this.props;
        const {
            isAddOperationPanelOpened,
            selectedItem,
            selectedGroup,
            isDeleteOperationPanelOpened,
        } = this.state;
        return(
            <Grid container spacing={16}>
                <WorkingStationMenuButton
                    groups={groups}
                    isAddOperationPanelOpened={isAddOperationPanelOpened}
                    isDeleteOperationPanelOpened={isDeleteOperationPanelOpened}
                    items={items}
                    onChangeWorkingStation={(value: number) => this.onChangeWorkingStation(value)}
                    setOperationPanel={(flag: boolean) => this.setState({ isAddOperationPanelOpened: flag })}
                    setDeletePanel={(flag: boolean) => this.setState({ isDeleteOperationPanelOpened: flag })}
                />
                {isAddOperationPanelOpened
                    ? <AddOperationPanel
                        addItemToChart={() => this.addItemToChart()}
                        groups={groups}
                        ranking={ranking}
                        selectedGroup={selectedGroup}
                        selectedItem={selectedItem}
                        setSelectedGroup={(group: number) => this.setState({ selectedGroup: group })}
                        setSelectedItem={(item: number) => this.setState({ selectedItem: item })}
                        closeAddOperationPanel={() => this.setState({ isAddOperationPanelOpened: false })}
                    />
                    : null
                }
                {isDeleteOperationPanelOpened
                    ? <DeleteOperationPanel
                        groups={groups}
                        setSelectedGroup={(id: number) => this.deleteLastItemFromGroup(id)}
                        setDeletePanel={(flag: boolean) => this.setState({ isDeleteOperationPanelOpened: flag })}
                    />
                    : null
                }
            </Grid>
        );
    }

    private deleteLastItemFromGroup(id: number) {
        const items = [...this.props.items];
        const lastItem = last(items.filter((item: IItemsEntity) => item.group === id));
        const newItems = remove(items, (item: IItemsEntity) => !isEqual(item, lastItem));
        this.props.setItems(newItems);

        if (!isNil(lastItem)) {
            const ranking = [...this.props.ranking];
            ranking[lastItem.id - 1].isSetted = false;
            this.props.setRanking(ranking);
        }
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

        // ranking[rankingElement.id - 1].isSetted = true;
        ranking.forEach((item: IBlmEntity) => item.id === selectedItem ? item.isSetted = true : null);

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
        this.setState({ isAddOperationPanelOpened: false, selectedItem: NaN, selectedGroup: NaN });
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
                content: `Cycle ${iterator}`,
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
