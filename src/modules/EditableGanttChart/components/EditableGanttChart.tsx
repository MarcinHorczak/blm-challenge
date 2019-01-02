import * as React from 'react';

import { Grid } from '@material-ui/core';
import { isNil } from 'lodash';
import * as vis from 'vis';
import { maxTimeRange } from '../../../settings';
import { setOptions } from '../../BlmGanttChart/functions';
import { IGroupsEntity, IItemsEntity } from '../../BlmGanttChart/model';
import { IBlmEntity } from '../../BlmGenerator/model';
import { WorkingStationTools } from '../../WorkingStationTools';

interface IEditableGanttChartProps {
    hidden?: boolean;
    ranking: IBlmEntity[];
    setRanking: (ranking: IBlmEntity[]) => void;
    disabledTools: boolean;
    items: IItemsEntity[];
    setItems: (items: IItemsEntity[]) => void;
    groups: IGroupsEntity[];
    setGroups: (groups: IGroupsEntity[]) => void;
}

let gantt: vis.Timeline;
export class EditableGanttChart extends React.Component<IEditableGanttChartProps> {
    constructor(props: IEditableGanttChartProps) {
        super(props);
        this.state = {
            items: [],
            groups: [],
        };
    }

    public componentDidUpdate(prevProps: IEditableGanttChartProps, _: any) {
        const { hidden, items, groups } = this.props;
        if (prevProps.hidden !== hidden) {
            this.initChart();
        }
        if (prevProps.items !== items || prevProps.groups !== groups) {
            this.updateChart(gantt);
        }
    }

    public render() {
        const { hidden, ranking, disabledTools, items, groups } = this.props;
        return(
            <Grid>
                {hidden
                    ? null
                    : <Grid>
                        {disabledTools
                            ? null
                            : <WorkingStationTools
                                groups={groups}
                                items={items}
                                setGroups={(g: IGroupsEntity[]) => this.props.setGroups(g)}
                                setItems={(i: IItemsEntity[]) => this.props.setItems(i)}
                                ranking={ranking}
                                setRanking={(r: IBlmEntity[]) => this.props.setRanking(r)}
                                setOptionTime={(t: number) => this.updateOptions(gantt, t)}
                            />
                        }
                        <div id="gantt"/>
                    </Grid>
                }
            </Grid>
        );
    }

    private initChart() {
        const container = document.getElementById('gantt');
        const items = new vis.DataSet();
        const options = setOptions(maxTimeRange);
        if (!isNil(container)) {
            gantt = new vis.Timeline(container, items, options);
        }
    }

    private updateChart(timeline: vis.Timeline) {
        timeline.setData({
            groups: this.props.groups,
            items: this.props.items,
        });
    }

    private updateOptions(timeline: vis.Timeline, time: number) {
        let newMaxTime;
        if (time > maxTimeRange) {
            newMaxTime = time;
        } else {
            newMaxTime = maxTimeRange;
        }
        const options = setOptions(newMaxTime);
        timeline.setOptions(options);
    }
}
