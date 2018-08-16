import * as React from 'react';

import { Button, Grid } from '@material-ui/core';
import * as _ from 'lodash';
import { GraphColumn } from '..';

interface IBlmGeneratorProps {
    machines: number;
    lineLength: number;
    lineHeight: number;
}

interface IBlmGeneratorState {
    blmModel: boolean[][];
    blmLineLength: number;
}

export class BlmGenerator extends React.Component<IBlmGeneratorProps, IBlmGeneratorState> {
    constructor(props: IBlmGeneratorProps) {
        super(props);
        this.state = {
            blmModel: [],
            blmLineLength: 0,
        };
    }

    public componentDidMount() {
        this.generateBlmModel();
    }

    public render() {
        const { blmModel, blmLineLength } = this.state;
        return(
            <Grid container direction="row" className="blm-graph">
                <Grid container>
                    <Button onClick={() => this.generateBlmModel()} color="primary" variant="outlined">
                        Generate New Graph
                    </Button>
                </Grid>
                {
                    blmModel.map((item: boolean[], i: number) => {
                        return <GraphColumn column={item} key={i} blmLineLength={blmLineLength}/>;
                    })
                }
            </Grid>
        );
    }

    private generateBlmModel() {
        const { lineHeight } = this.props;

        const blmModel = this.createEmptyArray();
        let blmChunkedModel: boolean[][] = _.chunk(blmModel, lineHeight);
        blmChunkedModel = this.deleteEmptyColumns(blmChunkedModel);
        blmChunkedModel = this.setSingleElementsCloseToThemselves(blmChunkedModel);

        this.setState({
            blmModel: blmChunkedModel,
            blmLineLength: blmChunkedModel.length,
        });
    }

    private createEmptyArray(): boolean[] {
        const { lineHeight, lineLength, machines } = this.props;
        let blmModel: boolean[] = [];
        const arrayElements: number = lineHeight * lineLength;

        for (let i = 0; i < arrayElements; i++) {
            i <= machines
            ? blmModel[i] = true
            : blmModel[i] = false;
        }
        blmModel = _.shuffle(blmModel);
        return blmModel;
    }

    private deleteEmptyColumns(blmChunkedModel: boolean[][]): boolean[][] {
        const { lineHeight } = this.props;
        blmChunkedModel =  _.remove(blmChunkedModel, (n: boolean[]) => {
            let shouldDelete: boolean = true;
            for (let i = 0; i <= lineHeight; i++) {
                if (n[i] === true) { shouldDelete = false; }
            }
            return !(shouldDelete);
        });
        return blmChunkedModel;
    }

    private setSingleElementsCloseToThemselves(blmChunkedModel: boolean[][]): boolean[][] {
        const { lineHeight } = this.props;
        for (let i = 1; i < blmChunkedModel.length; i++) {
            let machinesInColumn: number = 0;
            let positionInPreviousObject: number = 0;
            for (let j = 0; j < lineHeight; j++) {
                if (blmChunkedModel[i][j] === true) {
                    machinesInColumn += 1;
                }
            }
            if (machinesInColumn === 1) {
                machinesInColumn = 0;
                for (let k = 0; k < lineHeight; k++) {
                    if (blmChunkedModel[i - 1][k] === true) {
                        machinesInColumn += 1;
                        positionInPreviousObject = k;
                    }
                }
                if (machinesInColumn === 1) {
                    for (let l = 0; l < lineHeight; l++) {
                        l === positionInPreviousObject
                            ? blmChunkedModel[i][l] = true
                            : blmChunkedModel[i][l] = false;
                    }
                }
            }
        }
        return blmChunkedModel;
    }
}
