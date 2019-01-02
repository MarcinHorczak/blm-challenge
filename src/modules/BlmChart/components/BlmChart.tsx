import * as React from 'react';

import { isNull } from 'lodash';
import { connect } from 'react-redux';
import * as vis from 'vis';
import { IAppState } from '../../../rootReducer';
import { IBlmEntity, IGraphSettingsEntity } from '../../BlmGenerator/model';
import { IEdgeEntity, INodeEntity } from '../model';
import { graphSettingsSelector } from '../selectors';

interface IBlmChartProps {
    blm: IBlmEntity[][];
    settings: IGraphSettingsEntity;
}

interface IBlmChartState {
    settings: IGraphSettingsEntity;
    graph: vis.Network | null;
}

let network: vis.Network | null = null;
class BlmChartComponent extends React.Component<IBlmChartProps, IBlmChartState> {
    public componentDidMount() {
        const options = this.getOptions(this.props.settings);
        this.createGraph(options);
    }

    public componentDidUpdate(prevProps: IBlmChartProps, _: any) {
        const options = this.getOptions(this.props.settings);
        if (prevProps.blm !== this.props.blm) {
            this.createGraph(options);
        }
        if (prevProps.settings !== this.props.settings) {
            this.updateSettings(options);
        }
    }

    public render() {
        return (
            <div id="blm-vis-graph" style={{width: '100%', border: '1px solid'}}/>
        );
    }

    private createGraph(options: any) {
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
                        color: item.isSetted ? {
                            background: '#5AB931',
                            border: '#104D00',
                            highlight: {
                                background: '#A7E58C',
                                border: '#257B01',
                            },
                            hover: {
                                background: '#A7E58C',
                                border: '#104D00',
                            },
                        } : {},
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
        if (!isNull(container)) {
            network = new vis.Network(container, data, options);
        }
        if (!isNull(network)) {
            network.on('select', (params: any) => {
                const dupa = document.getElementById('selection');
                if (!isNull(dupa)) {
                    dupa.innerHTML = 'Selection: ' + params.nodes;
                }
            });
        }
    }

    private updateSettings(options: any) {
        if (!isNull(network)) {
            network.setOptions(options);
        }
    }

    private getOptions(settings: IGraphSettingsEntity) {
        return {
            interaction: {
                navigationButtons: false,
                keyboard: true,
                hover: true,
                dragView: settings.dragView,
                zoomView: settings.zoomView,
            },
            edges: { arrows: 'to' },
            height: '300',
            width: '100%',
        };
    }
}

export const BlmChart = connect(
    (state: IAppState, _: any): any => ({
        settings: graphSettingsSelector(state),
    }),
    null,
)(BlmChartComponent);
