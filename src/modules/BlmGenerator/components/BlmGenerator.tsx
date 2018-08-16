import * as React from 'react';

import { Button, Grid } from '@material-ui/core';
import * as _ from 'lodash';
import { GraphColumn } from '..';
import { lineHeight, lineLength, machines } from '../../../settings';

interface IBlmGeneratorState {
    blmModel: boolean[][];
    blmLineLength: number;
}

export class BlmGenerator extends React.Component<{}, IBlmGeneratorState> {
    constructor(props: {}) {
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
        const blmModel = this.createEmptyArray();
        let blmChunkedModel: boolean[][] = _.chunk(blmModel, lineHeight);
        blmChunkedModel = this.deleteEmptyColumns(blmChunkedModel);
        blmChunkedModel = this.setSingleElementsCloseToThemselves(blmChunkedModel);
        blmChunkedModel = this.stickLonelyElementsToSchema(blmChunkedModel);

        this.setState({
            blmModel: blmChunkedModel,
            blmLineLength: blmChunkedModel.length,
        });
    }

    private createEmptyArray(): boolean[] {
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

    private stickLonelyElementsToSchema(blm: boolean[][]): boolean[][] {
        let k: number;
        let l: number;
        let lonelyElementsCounter: number;
        do {
            lonelyElementsCounter = 0;
            for (let i = 1; i < blm.length - 1; i++) {
                for (let j = 0; j < lineHeight; j++) {
                    if (j - 1 < 0) {k = 2; } else { k = j; }
                    if (j + 1 > lineHeight - 1) {l = lineHeight - 3; } else { l = j; }
                    if (
                        blm[i][j] === true
                        && blm[i - 1][k - 1] === false
                        && blm[i - 1][j] === false
                        && blm[i - 1][l + 1] === false
                        && blm[i + 1][k - 1] === false
                        && blm[i + 1][j] === false
                        && blm[i + 1][l + 1] === false
                    ) {
                        blm[i][j] = false;
                        blm = this.createNew(blm);
                        blm = this.deleteEmptyColumns(blm);
                        lonelyElementsCounter += 1;
                    }
                }
            }
        } while (lonelyElementsCounter !== 0);

        return blm;
    }

    private createNew(blm: boolean[][]) {
        let i;
        let j;
        do {
            i = Math.floor(Math.random() * blm.length);
            j = Math.floor(Math.random() * lineHeight);
        } while (blm[i][j] === false);
        blm[i][j] = true;
        return blm;
    }
}
