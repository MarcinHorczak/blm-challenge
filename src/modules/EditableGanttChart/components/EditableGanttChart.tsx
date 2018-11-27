import * as React from 'react';

import * as vis from 'vis';

interface IEditableGanttChartProps {
    hidden?: boolean;
    createdGantt: vis.Timeline | undefined;
    setGantt: (gantt: vis.Timeline | undefined) => void;
}

export class EditableGanttChart extends React.Component<IEditableGanttChartProps, {}> {
    public render() {
        return(
            <></>
        );
    }
}
