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
        let shouldReload: boolean;
        let blm = _.chunk(this.createEmptyArray(), lineHeight);
        let blmStateModel: boolean[][] = blm;

        do {
            blm = this.deleteEmptyColumns(blm);
            blm = this.setSingleElementsInLine(blm);
            blm = this.stickLonelyElementsToSchema(blm);
            blm = this.connectFirstColumn(blm);

            _.isEqual(blm, blmStateModel)
                ? shouldReload = false
                : shouldReload = true;
            blmStateModel = Array.from(blm);
        } while (shouldReload);

        this.setState({
            blmModel: blm,
            blmLineLength: blm.length,
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

    private deleteEmptyColumns(blm: boolean[][]): boolean[][] {
        blm =  _.remove(blm, (n: boolean[]) => {
            let shouldDelete: boolean = true;
            for (let i = 0; i <= lineHeight; i++) {
                if (n[i] === true) { shouldDelete = false; }
            }
            return !(shouldDelete);
        });
        return blm;
    }

    private setSingleElementsInLine(blm: boolean[][]): boolean[][] {
        for (let i = 1; i < blm.length; i++) {
            let machinesInColumn: number = 0;
            let positionInPreviousObject: number = 0;
            for (let j = 0; j < lineHeight; j++) {
                if (blm[i][j] === true) {
                    machinesInColumn += 1;
                }
            }
            if (machinesInColumn === 1) {
                machinesInColumn = 0;
                for (let k = 0; k < lineHeight; k++) {
                    if (blm[i - 1][k] === true) {
                        machinesInColumn += 1;
                        positionInPreviousObject = k;
                    }
                }
                if (machinesInColumn === 1) {
                    for (let l = 0; l < lineHeight; l++) {
                        l === positionInPreviousObject
                            ? blm[i][l] = true
                            : blm[i][l] = false;
                    }
                }
            }
        }
        return blm;
    }

    private stickLonelyElementsToSchema(blm: boolean[][]): boolean[][] {
        let k: number;
        let l: number;
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
                    blm = this.createNewElement(blm);
                }
            }
        }
        return blm;
    }

    private connectFirstColumn(blm: boolean[][]) {
        let j: number;
        let k: number;
        for (let i = 0; i < lineHeight; i++) {
            if (i - 1 < 0) {j = 1; } else { j = i; }
            if (i + 1 > lineHeight - 1) {k = lineHeight - 2; } else { k = i; }
            if (
                blm[0][i] === true
                && blm[1][j - 1] === false
                && blm[1][i] === false
                && blm[1][k + 1] === false
            ) {
                blm[0][i] = false;
                blm = this.createNewElement(blm);
            }
        }
        return blm;
    }

    private createNewElement(blm: boolean[][]) {
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
