import * as React from 'react';

import { Button, Grid } from '@material-ui/core';
import * as _ from 'lodash';
import { GraphColumn } from '..';
import {
    lineHeight,
    maxLineLength,
    maxTimeRange,
    minBlmElementSize,
    minLineLength,
    minTimeRange,
    numberOfMachines,
} from '../../../settings';
import { IBlmEntity } from '../model';

interface IBlmGeneratorProps {
    blmModel: (blmModel: IBlmEntity[][]) => void;
}

interface IBlmGeneratorState {
    blmModel: IBlmEntity[][];
    blmLineLength: number;
    screenWidth: number;
}

export class BlmGenerator extends React.Component<IBlmGeneratorProps, IBlmGeneratorState> {
    constructor(props: IBlmGeneratorProps) {
        super(props);
        this.state = {
            blmModel: [],
            blmLineLength: 0,
            screenWidth: 0,
        };
        this.updateWindowWidth = this.updateWindowWidth.bind(this);
    }

    public componentDidMount() {
        this.generateBlmModel();
        this.updateWindowWidth();
        window.addEventListener('resize', this.updateWindowWidth);
    }

    public componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowWidth);
    }

    public updateWindowWidth() {
        this.setState({ screenWidth: window.innerWidth });
    }

    public render() {
        const { blmModel, blmLineLength, screenWidth } = this.state;
        return(
            <Grid container direction="row">
                <Grid container>
                    <Button onClick={() => this.generateBlmModel()} color="primary" variant="outlined">
                        Generate New Graph
                    </Button>
                </Grid>
                <hr style={{width: '200%'}}/>
                <Grid container className="blm-graph" style={{minWidth: blmLineLength * minBlmElementSize}}>
                    {
                        blmModel.map((item: IBlmEntity[], i: number) => {
                            return (
                                <GraphColumn
                                    column={item}
                                    key={i}
                                    blmLineLength={blmLineLength}
                                    screenWidth={screenWidth}
                                />
                            );
                        })
                    }
                </Grid>
            </Grid>
        );
    }

    private generateBlmModel() {
        let blmGeneratedLength: number;
        let blm: IBlmEntity[][];

        blmGeneratedLength = this.setOptimalLineLenght();
        blm = _.chunk(this.createEmptyArray(blmGeneratedLength, 0), lineHeight);
        blm = this.createMainLine(blm);
        this.addRestOfElements(blm);
        blm = this.setElementsId(blm);

        this.props.blmModel(blm);
        this.setState({
            blmModel: blm,
            blmLineLength: blm.length,
        });
    }

    private createEmptyArray(lineLength: number, machines: number): IBlmEntity[] {
        let blm: IBlmEntity[] = [];
        const arrayElements: number = lineHeight * lineLength;
        for (let i = 0; i < arrayElements; i++) {
            blm[i] = {
                id: 0,
                time: 0,
                isChecked: false,
                isConnected: false,
                isExist: i < machines ? true : false,
                next: {
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

    private setOptimalLineLenght(): number {
        const blm: IBlmEntity[][] = _.chunk(this.createEmptyArray(maxLineLength, numberOfMachines), lineHeight);
        let blmGeneratedLength: number = this.deleteEmptyColumns(blm).length;
        if (blmGeneratedLength < minLineLength) { blmGeneratedLength = minLineLength; }
        return blmGeneratedLength;
    }

    private createMainLine(blm: IBlmEntity[][]): IBlmEntity[][] {
        for (let i = 0; i < blm.length - 1; i++) {
            for (let j = 0; j < lineHeight; j++) {
                let randPos: number;
                if (i === 0 && j === 0) {
                    randPos = Math.floor(Math.random() * lineHeight);
                    this.createNewElement(blm, 0, randPos);
                    blm[0][randPos].isConnected = true;
                    const keepPosition = randPos;
                    randPos = Math.floor(Math.random() * 3 - 1);
                    if (keepPosition + randPos < 0) {randPos = 0; }
                    if (keepPosition + randPos > lineHeight - 1) {randPos = 0; }
                    blm[1][keepPosition + randPos].isExist = true;
                    blm[1][keepPosition + randPos].isConnected = true;
                    if (randPos === -1) {blm[0][keepPosition].next.top = true; }
                    if (randPos === 0) {blm[0][keepPosition].next.middle = true; }
                    if (randPos === 1) {blm[0][keepPosition].next.bottom = true; }
                    j = -1;
                    i++;
                } else {
                    if (blm[i][j].isExist && i !== 0) {
                        randPos = Math.floor(Math.random() * 3 - 1);
                        if (j + randPos < 0) {randPos = 0; }
                        if (j + randPos > lineHeight - 1) {randPos = 0; }
                        this.createNewElement(blm, i + 1, j + randPos);
                        blm[i + 1][j + randPos].isConnected = true;
                        if (i < blm.length - 1) {
                            if (randPos === -1) {blm[i][j].next.top = true; }
                            if (randPos === 0) {blm[i][j].next.middle = true; }
                            if (randPos === 1) {blm[i][j].next.bottom = true; }
                        }
                    }
                }
            }
        }
        return blm;
    }

    private createNewConnectedElement(blm: IBlmEntity[][]): IBlmEntity[][] {
        let i;
        let j;
        let k;
        let l;
        let m;
        let n;
        let randomPosition;
        let isElementConnected;
        do {
            i = Math.floor(Math.random() * blm.length);
            j = Math.floor(Math.random() * lineHeight);
            if (i - 1 < 0) {k = 2; } else {k = i; }
            if (i + 1 > blm.length - 1) {l = blm.length - 3; } else {l = i; }
            if (j - 1 < 0) {m = 1; } else {m = j; }
            if (j + 1 > lineHeight - 1) {n = lineHeight - 2; } else {n = j; }
        } while (
            blm[i][j].isExist === false
            && !(
                blm[k - 1][m - 1].isExist === true
                || blm[k - 1][j].isExist === true
                || blm[k - 1][n + 1].isExist === true
                || blm[l + 1][m - 1].isExist === true
                || blm[l + 1][j].isExist === true
                || blm[l + 1][n + 1].isExist === true
            )
        );
        this.createNewElement(blm, i, j);
        do {
            randomPosition = Math.floor(Math.random() * 6);
            isElementConnected = false;
            switch (randomPosition) {
                case(0):
                    if (blm[k - 1][m - 1].isConnected && i !== 0) {
                        blm = this.setConnections(blm, k - 1, m - 1, i, j);
                        isElementConnected = true;
                    }
                    break;
                case(1):
                    if (blm[k - 1][j].isConnected && i !== 0) {
                        blm = this.setConnections(blm, k - 1, j, i, j);
                        isElementConnected = true;
                    }
                    break;
                case(2):
                    if (blm[k - 1][n + 1].isConnected && i !== 0) {
                        blm = this.setConnections(blm, k - 1, n + 1, i, j);
                        isElementConnected = true;
                    }
                    break;
                case(3):
                    if (blm[l + 1][m - 1].isConnected && i !== blm.length - 1) {
                        blm = this.setConnections(blm, i, j, l + 1, m - 1);
                        isElementConnected = true;
                    }
                    break;
                case(4):
                    if (blm[l + 1][j].isConnected && i !== blm.length - 1) {
                        blm = this.setConnections(blm, i, j, l + 1, j);
                        isElementConnected = true;
                    }
                    break;
                case(5):
                    if (blm[l + 1][n + 1].isConnected && i !== blm.length - 1) {
                        blm = this.setConnections(blm, i, j, l + 1, n + 1);
                        isElementConnected = true;
                    }
                    break;
            }
        } while (!isElementConnected);
        // TODO non-crossing connections
        return blm;
    }

    private addRestOfElements(blm: IBlmEntity[][]): void {
        let numberOfElements: number = 0;
        do {
            if (numberOfElements < numberOfMachines) { blm = this.createNewConnectedElement(blm); }
            numberOfElements = this.countElements(blm);
        } while (numberOfElements < numberOfMachines);
        return;
    }

    private setElementsId(blm: IBlmEntity[][]): IBlmEntity[][] {
        let iterator = 1;
        let time;
        const blmLineLength = blm.length;
        for (let i = 0; i < blmLineLength; i++) {
            for (let j = 0; j < lineHeight; j++) {
                if (blm[i][j].isExist) {
                    time = Math.floor(Math.random() * (maxTimeRange - minTimeRange) + minTimeRange);
                    blm[i][j].time = time;
                    blm[i][j].id = iterator;
                    iterator++;
                }
            }
        }
        return blm;
    }

    private setConnections(
        blm: IBlmEntity[][],
        fromI: number,
        fromJ: number,
        toI: number,
        toJ: number,
    ): IBlmEntity[][] {
        switch (toJ - fromJ) {
            case(-1):
                blm[fromI][fromJ].next.top = true;
                break;
            case(0):
                blm[fromI][fromJ].next.middle = true;
                break;
            case(1):
                blm[fromI][fromJ].next.bottom = true;
                break;
        }
        blm[fromI][fromJ].isConnected = true;
        blm[toI][toJ].isConnected = true;
        return blm;
    }

    private countElements(blm: IBlmEntity[][]): number {
        let counter: number = 0;
        const blmLineLength = blm.length;
        for (let i = 0; i < blmLineLength; i++) {
            for (let j = 0; j < lineHeight; j++) {
                if (blm[i][j].isExist) {counter++; }
            }
        }
        return counter;
    }

    private createNewElement(blm: IBlmEntity[][], i: number, j: number): IBlmEntity[][] {
        blm[i][j].isExist = true;
        return blm;
    }
}
