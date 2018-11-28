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
}

interface IEditableGanttChartState {
    items: IItemsEntity[];
    groups: IGroupsEntity[];
}

let gantt: vis.Timeline;
export class EditableGanttChart extends React.Component<IEditableGanttChartProps, IEditableGanttChartState> {
    constructor(props: IEditableGanttChartProps) {
        super(props);
        this.state = {
            items: [],
            groups: [],
        };
    }

    public componentDidUpdate(prevProps: IEditableGanttChartProps, prevState: IEditableGanttChartState) {
        const { hidden } = this.props;
        const { items, groups } = this.state;
        if (prevProps.hidden !== hidden) {
            this.initChart();
        }
        if (prevState.items !== items || prevState.groups !== groups) {
            this.updateChart(gantt);
        }
    }

    public render() {
        const { hidden, ranking } = this.props;
        const { items, groups } = this.state;
        return(
            <Grid>
                {hidden
                    ? null
                    : <Grid>
                        <WorkingStationTools
                            groups={groups}
                            items={items}
                            setGroups={(g: IGroupsEntity[]) => this.setState({ groups: g })}
                            setItems={(i: IItemsEntity[]) => this.setState({ items: i })}
                            ranking={ranking}
                            setRanking={(r: IBlmEntity[]) => this.props.setRanking(r)}
                            setOptionTime={(t: number) => this.updateOptions(gantt, t)}
                        />
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
            groups: this.state.groups,
            items: this.state.items,
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
