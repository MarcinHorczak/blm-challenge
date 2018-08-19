import * as React from 'react';

import { Button, Grid } from '@material-ui/core';
import * as _ from 'lodash';
import { GraphColumn } from '..';
import { lineHeight, lineLength, machines } from '../../../settings';
import { IBlmEntity } from '../model';

interface IBlmGeneratorProps {
    viewDetails: (item: IBlmEntity | undefined) => void;
}

interface IBlmGeneratorState {
    blmModel: IBlmEntity[][];
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
                    blmModel.map((item: IBlmEntity[], i: number) => {
                        return (
                            <GraphColumn
                                column={item}
                                key={i}
                                blmLineLength={blmLineLength}
                                viewDetails={(el: IBlmEntity | undefined) => {this.props.viewDetails(el); }}/>
                        );
                    })
                }
            </Grid>
        );
    }

    private generateBlmModel() {
        let shouldReload: boolean;
        let blm: IBlmEntity[][] = _.chunk(this.createEmptyArray(), lineHeight);
        let blmStateModel: IBlmEntity[][] = blm;

        do {
            blm = this.deleteEmptyColumns(blm);
            blm = this.setSingleElementsInLine(blm);
            blm = this.stickLonelyElementsToSchema(blm);
            blm = this.connectFirstColumn(blm);
            blm = this.createMainLine(blm);
            blm = this.connectElementsToMainLine(blm);

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

    private createEmptyArray(): IBlmEntity[] {
        let blm: IBlmEntity[] = [];
        const arrayElements: number = lineHeight * lineLength;
        for (let i = 0; i < arrayElements; i++) {
            blm[i] = {
                id: 0,
                isChecked: false,
                isExist: i <= machines ? true : false,
                isMainLine: false,
                isConnected: false,
                next: {
                    bottom: false,
                    middle: false,
                    top: false,
                },
                previous: {
                    bottom: false,
                    middle: false,
                    top: false,
                },
            };
        }
        blm = _.shuffle(blm);
        return blm;
    }

    private deleteEmptyColumns(blmModel: IBlmEntity[][]): IBlmEntity[][] {
        const blm =  _.remove(blmModel, (n) => {
            let shouldDelete: boolean = true;
            for (let i = 0; i < lineHeight; i++) {
                if (n[i].isExist === true) { shouldDelete = false; }
            }
            return !(shouldDelete);
        });
        return blm;
    }

    private setSingleElementsInLine(blm: IBlmEntity[][]): IBlmEntity[][] {
        for (let i = 1; i < blm.length; i++) {
            let machinesInColumn: number = 0;
            let positionInPreviousObject: number = 0;
            for (let j = 0; j < lineHeight; j++) {
                if (blm[i][j].isExist === true) {
                    machinesInColumn += 1;
                }
            }
            if (machinesInColumn === 1) {
                machinesInColumn = 0;
                for (let k = 0; k < lineHeight; k++) {
                    if (blm[i - 1][k].isExist === true) {
                        machinesInColumn += 1;
                        positionInPreviousObject = k;
                    }
                }
                if (machinesInColumn === 1) {
                    for (let l = 0; l < lineHeight; l++) {
                        l === positionInPreviousObject
                            ? blm[i][l].isExist = true
                            : blm[i][l].isExist = false;
                    }
                }
            }
        }
        return blm;
    }

    private stickLonelyElementsToSchema(blm: IBlmEntity[][]): IBlmEntity[][] {
        let k: number;
        let l: number;
        for (let i = 1; i < blm.length - 1; i++) {
            for (let j = 0; j < lineHeight; j++) {
                if (j - 1 < 0) {k = 2; } else { k = j; }
                if (j + 1 > lineHeight - 1) {l = lineHeight - 3; } else { l = j; }
                if (
                    blm[i][j].isExist === true
                    && blm[i - 1][k - 1].isExist === false
                    && blm[i - 1][j].isExist === false
                    && blm[i - 1][l + 1].isExist === false
                    && blm[i + 1][k - 1].isExist === false
                    && blm[i + 1][j].isExist === false
                    && blm[i + 1][l + 1].isExist === false
                ) {
                    blm[i][j] = this.deleteBlmElement(blm[i][j]);
                    blm = this.createNewElement(blm);
                }
            }
        }
        return blm;
    }

    private connectFirstColumn(blm: IBlmEntity[][]): IBlmEntity[][] {
        let j: number;
        let k: number;
        for (let i = 0; i < lineHeight; i++) {
            if (i - 1 < 0) {j = 1; } else { j = i; }
            if (i + 1 > lineHeight - 1) {k = lineHeight - 2; } else { k = i; }
            if (
                blm[0][i].isExist === true
                && blm[1][j - 1].isExist === false
                && blm[1][i].isExist === false
                && blm[1][k + 1].isExist === false
            ) {
                blm[0][i] = this.deleteBlmElement(blm[0][i]);
                blm = this.createNewElement(blm);
                blm = this.deleteEmptyColumns(blm);
            }
        }
        return blm;
    }

    private createMainLine(blm: IBlmEntity[][]): IBlmEntity[][] {
        let isMainLineHeadExist: boolean = false;
        let k: number;
        let l: number;
        for (let i = 0; i < lineHeight; i++) {
            if (blm[0][i].isMainLine === true) {isMainLineHeadExist = true; }
        }
        if (isMainLineHeadExist) {
            for (let i = 0; i < blm.length - 1; i++) {
                for (let j = 0; j < lineHeight; j++) {
                    if (j - 1 < 0) {k = 1; } else { k = j; }
                    if (j + 1 > lineHeight - 1) {l = lineHeight - 2; } else { l = j; }
                    if (blm[i][j].isMainLine) {
                        if (
                            blm[i + 1][k - 1].isMainLine
                            || blm[i + 1][j].isMainLine
                            || blm[i + 1][l + 1].isMainLine
                        ) { break; } else {
                            if (
                                blm[i + 1][k - 1].isExist
                                || blm[i + 1][j].isExist
                                || blm[i + 1][l + 1].isExist
                            ) {
                                let isMainLineExtended: boolean = false;
                                let m: number;
                                do {
                                    const randPos: number = Math.floor(Math.random() * 3 - 1);
                                    m = j;
                                    if (j + randPos < 0) {m = 1; }
                                    if (j + randPos > lineHeight - 1) {m = lineHeight - 2; }
                                    if (blm[i + 1][m + randPos].isExist) {
                                        blm[i + 1][m + randPos].isMainLine = true;
                                        blm[i + 1][m + randPos].isConnected = true;
                                        isMainLineExtended = true;
                                    }
                                } while (!isMainLineExtended);
                            } else {
                                // delete one and put one random
                            }
                        }
                    }
                }
            }
        } else {
            let isHeadSetted: boolean = false;
            do {
                const randPos: number = Math.floor(Math.random() * (lineHeight));
                if (blm[0][randPos].isExist) {
                    blm[0][randPos].isMainLine = true;
                    blm[0][randPos].isConnected = true;
                    isHeadSetted = true;
                }
            } while (!isHeadSetted);
        }
        return blm;
    }

    private connectElementsToMainLine(blm: IBlmEntity[][]): IBlmEntity[][] {
        return blm;
    }

    private createNewElement(blm: IBlmEntity[][]): IBlmEntity[][] {
        let i;
        let j;
        do {
            i = Math.floor(Math.random() * blm.length);
            j = Math.floor(Math.random() * lineHeight);
        } while (blm[i][j].isExist === false);
        blm[i][j].isExist = true;
        return blm;
    }

    private deleteBlmElement(blm: IBlmEntity): IBlmEntity {
        blm = {
            id: 1,
            isChecked: false,
            isConnected: false,
            isExist: false,
            isMainLine: false,
            next: {
                bottom: false,
                middle: false,
                top: false,
            },
            previous: {
                bottom: false,
                middle: false,
                top: false,
            },
        };
        return blm;
    }
}
