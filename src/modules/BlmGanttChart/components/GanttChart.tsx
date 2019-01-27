import * as React from 'react';

import { Table, TableBody, TableCell, TableRow } from '@material-ui/core';
import { isNull } from 'lodash';
import * as vis from 'vis';
import { IIndicatorEntity } from '../../../containers/Practice';
import { IBlmEntity } from '../../BlmGenerator/model';
import { T } from '../../FormattedText';
import { setOptions } from '../functions';
import { IGroupsEntity, IItemsEntity } from '../model';

interface IGanttChartProps {
    blmMinTime: number;
    ranking: IBlmEntity[];
    hidden?: boolean;
    setItems: (items: IItemsEntity[]) => void;
    setGroups: (groups: IGroupsEntity[]) => void;
    setIndicators: (indicators: IIndicatorEntity) => void;
    containerName: string;
}

interface IGanttChartState {
    timeline: vis.Timeline | undefined;
    indicators: IIndicatorEntity;
}

let gantt: vis.Timeline;
export class GanttChart extends React.Component<IGanttChartProps, IGanttChartState> {
    constructor(props: IGanttChartProps) {
        super(props);
        this.state = {
            timeline: undefined,
            indicators: {
                LE: 0,
                SL: 0,
                T: 0,
                TAlt: 0,
            },
        };
    }

    public componentDidMount() {
        this.createGraph();
    }

    public componentDidUpdate(prevProps: IGanttChartProps, _: any) {
        const { ranking, blmMinTime, hidden } = this.props;
        if (
            (prevProps.ranking !== ranking
            || prevProps.blmMinTime !== blmMinTime)
            && !hidden
        ) {
            this.updateTimeline(gantt);
        }
    }

    public render() {
        return (
            this.props.hidden ? null : <>
                <div id="visualization" style={{width: '100%'}}/>
                <Table padding="checkbox">
                    <TableBody>
                        <TableRow>
                            <TableCell><T value="indicator"/>:</TableCell>
                            <TableCell>LE</TableCell>
                            <TableCell>SI</TableCell>
                            <TableCell>T</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell><T value="value"/>:</TableCell>
                            <TableCell>{this.state.indicators.LE} %</TableCell>
                            <TableCell>{this.state.indicators.SL}</TableCell>
                            <TableCell>
                                {this.state.indicators.T} <T value="or"/> {this.state.indicators.TAlt}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </>
        );
    }

    private createGraph() {
        const container = document.getElementById('visualization');

        const settedItems = this.setItems();
        const items = new vis.DataSet(settedItems);
        const groups = this.setGroups(settedItems);
        const options = setOptions(this.props.blmMinTime);

        if (!isNull(container)) {
            gantt = new vis.Timeline(container, items, groups, options);
        }
    }

    private updateTimeline(timeline: vis.Timeline) {
        const settedItems = this.setItems();
        const items = new vis.DataSet(settedItems);
        const groups = this.setGroups(settedItems);
        const options = setOptions(this.props.blmMinTime);

        timeline.setData({
            groups,
            items,
        });

        timeline.setOptions(options);
    }

    private setItems(): IItemsEntity[] {
        // indicators variables
        let sumSTi = 0;
        let sumSL = 0;
        let lastT = 0;

        // gantt chart variables
        const { ranking, containerName } = this.props;
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
                if (ranking[i].time + actualCycleEndTime <= this.props.blmMinTime && !ranking[i].isChecked) {
                    ranking[i].depends.map((d: number) => {
                        for (let j = 0; j < rankingLength; j++) {
                            if (d === ranking[j].id && !ranking[j].isChecked) {isReady = false; }
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
                        ranking[i].isChecked = true;
                        idIterator++;
                        actualCycleEndTime += ranking[i].time;
                        i = -1;
                        nextCycle = false;
                    }
                }
            }
            if (nextCycle) {
                sumSTi += actualCycleEndTime;
                sumSL += Math.pow((this.props.blmMinTime - actualCycleEndTime), 2);
                lastT = actualCycleEndTime;
                actualCycleEndTime = 0;
                cycleNumber += 1;
            }
            isGanttChartCreated = true;
            ranking.map((item: IBlmEntity) => {
                if (!item.isChecked) {isGanttChartCreated = false; }
            });
        } while (!isGanttChartCreated);

        if (containerName === 'Practice' || (containerName === 'Example')) {
            const indicators: IIndicatorEntity = {
                LE: Math.round((sumSTi / ((cycleNumber - 1) * this.props.blmMinTime)) * 10000) / 100,
                SL: Math.round(Math.sqrt(sumSL) * 100) / 100,
                T: this.props.blmMinTime * (cycleNumber - 1),
                TAlt: (this.props.blmMinTime * (cycleNumber - 2)) + lastT,
            };
            this.props.setIndicators(indicators);
            this.setState({ indicators });
        }

        this.props.setItems(rankingItems);
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
                content: `Work Station ${i}`,
            });
            groups.sort((a: IGroupsEntity, b: IGroupsEntity) => a.id - b.id);
        }
        this.props.setGroups(groups);
        return groups;
    }
}
