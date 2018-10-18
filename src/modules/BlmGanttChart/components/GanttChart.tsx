import * as React from 'react';

import { isNull } from 'lodash';
import * as vis from 'vis';
import { IBlmEntity } from '../../BlmGenerator/model';
import { IGroupsEntity, IItemsEntity } from '../model';

interface IGanttChartProps {
    blmMinTime: number;
    ranking: IBlmEntity[];
    maxTime: number;
}

interface IGanttChartState {
    timeline: vis.Timeline;
}

let gantt: vis.Timeline;
export class GanttChart extends React.Component<IGanttChartProps, IGanttChartState> {
    public componentDidMount() {
        this.createGraph();
    }

    public componentDidUpdate(prevProps: IGanttChartProps, _: any) {
        const { ranking, blmMinTime, maxTime } = this.props;
        if (
            prevProps.ranking !== ranking
            || prevProps.blmMinTime !== blmMinTime
            || prevProps.maxTime !== maxTime
        ) {
            this.updateTimeline(gantt);
        }
    }

    public render() {
        return (
            <div id="visualization" style={{width: '100%'}}/>
        );
    }

    private createGraph() {
        const container = document.getElementById('visualization');

        const settedItems = this.setItems();
        const items = new vis.DataSet(settedItems);
        const groups = this.setGroups(settedItems);
        const options = this.setOptions(this.props.maxTime);

        if (!isNull(container)) {
            gantt = new vis.Timeline(container, items, groups, options);
            this.setState({ timeline: gantt });
        }
    }

    private updateTimeline(timeline: vis.Timeline) {
        const settedItems = this.setItems();
        const items = new vis.DataSet(settedItems);
        const groups = this.setGroups(settedItems);
        const options = this.setOptions(this.props.maxTime);

        timeline.setData({
            groups,
            items,
        });

        timeline.setOptions(options);
    }

    private setItems(): IItemsEntity[] {
        const { ranking } = this.props;
        const rankingItems: IItemsEntity[] = [];
        let actualCycleEndTime: number = 0;
        let cycleNumber: number = 1;
        let idIterator: number = 0;
        const rankingLength = ranking.length;
        let isGanttChartCreated: boolean;
        let isReady;
        let nextCycle;
        do {
            for (let i = 0; i < rankingLength; i++) {
                isReady = true;
                nextCycle = true;
                if (ranking[i].time + actualCycleEndTime <= this.props.blmMinTime && !ranking[i].isSetted) {
                    ranking[i].depends.map((d: number) => {
                        for (let j = 0; j < rankingLength; j++) {
                            if (d === ranking[j].id && !ranking[j].isSetted) {isReady = false; }
                        }
                    });
                    if (isReady) {
                        rankingItems.push({
                            id: idIterator,
                            content: `${ranking[i].id}(${ranking[i].time})`,
                            group: cycleNumber,
                            start: actualCycleEndTime,
                            end: actualCycleEndTime + ranking[i].time,
                        });
                        ranking[i].isSetted = true;
                        idIterator++;
                        actualCycleEndTime += ranking[i].time;
                        i = -1;
                        nextCycle = false;
                    }
                }
            }
            if (nextCycle) {
                actualCycleEndTime = 0;
                cycleNumber += 1;
            }
            isGanttChartCreated = true;
            ranking.map((item: IBlmEntity) => {
                if (!item.isSetted) {isGanttChartCreated = false; }
            });
        } while (!isGanttChartCreated);
        return rankingItems;
    }

    private setGroups(items: IItemsEntity[]): IGroupsEntity[] {
        let numberOfGroups: number = 0;
        const groups: IGroupsEntity[] = [];
        items.map((item: IItemsEntity) => {
            if (item.group > numberOfGroups) {numberOfGroups = item.group; }
        });
        for (let i = 1; i <= numberOfGroups; i++) {
            groups.push({
                id: i,
                content: `Series ${i}`,
            });
            groups.sort((a: IGroupsEntity, b: IGroupsEntity) => a.id - b.id);
        }
        return groups;
    }

    private setOptions(maxTime: number) {
        const time: number = Number(maxTime) + 3;
        return {
            format: {
                minorLabels: {
                  millisecond: 'SSS',
                },
                majorLabels: {
                  millisecond: '',
                },
            },
            min: 0,
            max: time,
            start: 0,
            end: time,
            multiselect: true,
            stack: false,
            editable: {
                updateTime: false,
                updateGroup: false,
                remove: false,
                overrideItems: false,
            },
            groupOrder: (a: any, b: any) => a.id - b.id,
            moveable: false,
            zoomable: false,
        };
    }
}
