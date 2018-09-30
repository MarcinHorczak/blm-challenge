import * as React from 'react';

import { isNull } from 'lodash';
import * as vis from 'vis';
import { IBlmEntity } from '../../BlmGenerator/model';
import { IGanttRankingEntity, IGroupsEntity, IItemsEntity } from '../model';

interface IGanttChartProps {
    blmMinTime: number;
    ranking: IBlmEntity[];
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
        const { ranking, blmMinTime } = this.props;
        if (prevProps.ranking !== ranking || prevProps.blmMinTime !== blmMinTime) {
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

        const items = new vis.DataSet(this.setItems());
        const groups = this.setGroups(this.setItems());

        const options = {
            format: {
                minorLabels: {
                  millisecond: 'SSS',
                },
                majorLabels: {
                  millisecond: '',
                },
              },
            min: 0,
            max: 30,
            multiselect: true,
            stack: false,
            editable: {
                updateTime: true,
                updateGroup: true,
                remove: true,
                overrideItems: false,
            },
        };

        if (!isNull(container)) {
            gantt = new vis.Timeline(container, items, groups, options);
            this.setState({ timeline: gantt });
        }
    }

    private updateTimeline(timeline: vis.Timeline) {
        const items = new vis.DataSet(this.setItems());
        const groups = this.setGroups(this.setItems());

        timeline.setData({
            groups,
            items,
        });
    }

    private setItems(): IItemsEntity[] {
        const ganttRanking: IGanttRankingEntity[] = [];
        this.props.ranking.map((item: IBlmEntity) => {
            ganttRanking.push({
                id: item.id,
                isSetted: false,
                time: item.time,
                previous: item.previous,
            });
        });
        const rankingItems: IItemsEntity[] = [];
        let actualCycleEndTime: number = 0;
        const cycleNumber: number = 1;
        let idIterator: number = 0;
        // do {
        for (let i = 0; i < ganttRanking.length; i++) {
                if (ganttRanking[i].time + actualCycleEndTime <= this.props.blmMinTime && !ganttRanking[i].isSetted) {
                    rankingItems.push({
                        id: idIterator,
                        content: `${ganttRanking[i].id}(${ganttRanking[i].time})`,
                        group: cycleNumber,
                        start: actualCycleEndTime,
                        end: actualCycleEndTime + ganttRanking[i].time,
                    });
                    ganttRanking[i].isSetted = true;
                    idIterator++;
                    actualCycleEndTime += ganttRanking[i].time;
                    i = 0;
                }
            }
        // } while (false);
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
                content: `Cycle ${i}`,
            });
        }
        return groups;
    }
}
