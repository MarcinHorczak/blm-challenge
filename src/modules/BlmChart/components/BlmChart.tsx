import * as React from 'react';

import { isNull } from 'lodash';
import * as vis from 'vis';
import { IBlmEntity } from '../../BlmGenerator/model';
import { IEdgeEntity, INodeEntity } from '../model';

interface IBlmChartProps {
    blm: IBlmEntity[][];
}

export default class BlmChart extends React.Component<IBlmChartProps, {}> {
    public componentDidMount() {
        this.createGraph();
    }

    public componentDidUpdate(prevProps: IBlmChartProps, _: any) {
        if (prevProps.blm !== this.props.blm) {
            this.createGraph();
        }
    }

    public render() {
        return (
            <div id="blm-vis-graph" style={{width: '100%', border: '1px solid'}}/>
        );
    }

    private createGraph() {
        let network: vis.Network | null = null;
        const nodes: INodeEntity[] = [];
        const edgesArray: IEdgeEntity[] = [];

        this.props.blm.map((column: IBlmEntity[], i: number) => {
            column.map((item: IBlmEntity, j: number) => {
                if (item.isExist) {
                    nodes.push({
                        id: item.id,
                        label: `${item.id}(${item.time})`,
                        fixed: true,
                        x: i * 120,
                        y: j * 70,
                    });
                    if (item.next.top) {edgesArray.push({
                        from: item.id,
                        to: this.props.blm[i + 1][j - 1].id,
                    }); }
                    if (item.next.middle) {edgesArray.push({
                        from: item.id,
                        to: this.props.blm[i + 1][j].id,
                    }); }
                    if (item.next.bottom) {edgesArray.push({
                        from: item.id,
                        to: this.props.blm[i + 1][j + 1].id,
                    }); }
                }
            });
        });
        const edges = new vis.DataSet(edgesArray);
        const container = document.getElementById('blm-vis-graph');
        const data = {
            nodes,
            edges,
        };
        const options = {
            interaction: {
                navigationButtons: false,
                keyboard: true,
                hover: true,
                dragView: false,
                zoomView: false,
            },
            edges: { arrows: 'to' },
            height: '300',
            width: '100%',
        };
        if (!isNull(container)) {network = new vis.Network(container, data, options); }
        if (!isNull(network)) {
            network.on('select', (params: any) => {
                const dupa = document.getElementById('selection');
                if (!isNull(dupa)) {
                    dupa.innerHTML = 'Selection: ' + params.nodes;
                }
            });
        }
    }
}
