import { chunk, includes, remove, shuffle, uniq } from 'lodash';
import {
    lineHeight,
    maxLineLength,
    maxTimeRange,
    minLineLength,
    minTimeRange,
    numberOfMachines,
} from '../../../settings';
import { IBlmEntity } from '../model';

export function createEmptyArray(lineLength: number, machines: number): IBlmEntity[] {
    let blm: IBlmEntity[] = [];
    const arrayElements: number = lineHeight * lineLength;
    for (let i = 0; i < arrayElements; i++) {
        blm[i] = {
            id: 0,
            time: 0,
            wet: 0,
            nof: -1,
            noif: 0,
            rpw: -1,
            isChecked: false,
            isConnected: false,
            isExist: i < machines ? true : false,
            next: {
                bottom: false,
                middle: false,
                top: false,
            },
            depends: [],
            isSetted: false,
        };
    }
    blm = shuffle(blm);
    return blm;
}

export function deleteEmptyColumns(blmModel: IBlmEntity[][]): IBlmEntity[][] {
    const blm =  remove(blmModel, (n) => {
        let shouldDelete: boolean = true;
        for (let i = 0; i < lineHeight; i++) {
            if (n[i].isExist === true) { shouldDelete = false; }
        }
        return !(shouldDelete);
    });
    return blm;
}

export function setOptimalLineLenght(): number {
    const blm: IBlmEntity[][] = chunk(createEmptyArray(maxLineLength, numberOfMachines), lineHeight);
    let blmGeneratedLength: number = deleteEmptyColumns(blm).length;
    if (blmGeneratedLength < minLineLength) { blmGeneratedLength = minLineLength; }
    return blmGeneratedLength;
}

export function createMainLine(blm: IBlmEntity[][]): IBlmEntity[][] {
    for (let i = 0; i < blm.length - 1; i++) {
        for (let j = 0; j < lineHeight; j++) {
            let randPos: number;
            if (i === 0 && j === 0) {
                randPos = Math.floor(Math.random() * lineHeight);
                createNewElement(blm, 0, randPos);
                blm[0][randPos].isConnected = true;
                const keepPosition = randPos;
                randPos = Math.floor(Math.random() * 3 - 1);
                if (keepPosition + randPos < 0) {randPos = 0; }
                if (keepPosition + randPos > lineHeight - 1) {randPos = 0; }
                blm[1][keepPosition + randPos].isExist = true;
                blm[1][keepPosition + randPos].isConnected = true;
                if (randPos === -1) {
                    blm[0][keepPosition].next.top = true;
                }
                if (randPos === 0) {
                    blm[0][keepPosition].next.middle = true;
                }
                if (randPos === 1) {
                    blm[0][keepPosition].next.bottom = true;
                }
                j = -1;
                i++;
            } else {
                if (blm[i][j].isExist && i !== 0) {
                    randPos = Math.floor(Math.random() * 3 - 1);
                    if (j + randPos < 0) {randPos = 0; }
                    if (j + randPos > lineHeight - 1) {randPos = 0; }
                    createNewElement(blm, i + 1, j + randPos);
                    blm[i + 1][j + randPos].isConnected = true;
                    if (i < blm.length - 1) {
                        if (randPos === -1) {
                            blm[i][j].next.top = true;
                        }
                        if (randPos === 0) {
                            blm[i][j].next.middle = true;
                        }
                        if (randPos === 1) {
                            blm[i][j].next.bottom = true;
                        }
                    }
                }
            }
        }
    }
    return blm;
}

export function createNewConnectedElement(blm: IBlmEntity[][]): IBlmEntity[][] {
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
    createNewElement(blm, i, j);
    do {
        randomPosition = Math.floor(Math.random() * 6);
        isElementConnected = false;
        switch (randomPosition) {
            case(0):
                if (blm[k - 1][m - 1].isConnected && i !== 0) {
                    blm = setConnections(blm, k - 1, m - 1, i, j);
                    isElementConnected = true;
                }
                break;
            case(1):
                if (blm[k - 1][j].isConnected && i !== 0) {
                    blm = setConnections(blm, k - 1, j, i, j);
                    isElementConnected = true;
                }
                break;
            case(2):
                if (blm[k - 1][n + 1].isConnected && i !== 0) {
                    blm = setConnections(blm, k - 1, n + 1, i, j);
                    isElementConnected = true;
                }
                break;
            case(3):
                if (blm[l + 1][m - 1].isConnected && i !== blm.length - 1) {
                    blm = setConnections(blm, i, j, l + 1, m - 1);
                    isElementConnected = true;
                }
                break;
            case(4):
                if (blm[l + 1][j].isConnected && i !== blm.length - 1) {
                    blm = setConnections(blm, i, j, l + 1, j);
                    isElementConnected = true;
                }
                break;
            case(5):
                if (blm[l + 1][n + 1].isConnected && i !== blm.length - 1) {
                    blm = setConnections(blm, i, j, l + 1, n + 1);
                    isElementConnected = true;
                }
                break;
        }
    } while (!isElementConnected);
    return blm;
}

export function addRestOfElements(blm: IBlmEntity[][]): void {
    let numberOfElements: number = countElements(blm);
    do {
        if (numberOfElements < numberOfMachines) { blm = createNewConnectedElement(blm); }
        numberOfElements = countElements(blm);
    } while (numberOfElements < numberOfMachines);
    return;
}

export function setElementsIdAndTime(blm: IBlmEntity[][]): IBlmEntity[][] {
    let iterator = 1;
    let time;
    let maxTime = 0;
    const blmLineLength = blm.length;
    for (let i = 0; i < blmLineLength; i++) {
        for (let j = 0; j < lineHeight; j++) {
            if (blm[i][j].isExist) {
                time = Math.floor(Math.random() * (maxTimeRange - minTimeRange) + minTimeRange);
                blm[i][j].time = time;
                blm[i][j].wet = time;
                if (maxTime < time) {maxTime = time; }
                blm[i][j].id = iterator;
                iterator++;
            }
        }
    }
    return blm;
}

export function setDependedElements(blm: IBlmEntity[][]): IBlmEntity[][] {
    const blmLineLength = blm.length;
    for (let i = 0; i < blmLineLength; i++) {
        for (let j = 0; j < lineHeight; j++) {
            if (blm[i][j].isExist && i - 1 >= 0) {
                if (j - 1 >= 0) {
                    if (blm[i - 1][j - 1].next.bottom) {blm[i][j].depends.push(blm[i - 1][j - 1].id); }
                }
                if (blm[i - 1][j].next.middle) {blm[i][j].depends.push(blm[i - 1][j].id); }
                if (j + 1 < lineHeight) {
                    if (blm[i - 1][j + 1].next.top) {blm[i][j].depends.push(blm[i - 1][j + 1].id); }
                }
            }
        }
    }
    return blm;
}

export function setConnections(
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

export function countImmediateFollowers(blm: IBlmEntity[][]): IBlmEntity[][] {
    const blmLineLength = blm.length;
    let isLast: boolean;
    for (let i = 0; i < blmLineLength; i++) {
        for (let j = 0; j < lineHeight; j++) {
            isLast = true;
            if (blm[i][j].next.top) {blm[i][j].noif++; isLast = false; }
            if (blm[i][j].next.middle) {blm[i][j].noif++; isLast = false; }
            if (blm[i][j].next.bottom) {blm[i][j].noif++; isLast = false; }
            if (isLast) {blm[i][j].nof = 0; blm[i][j].rpw = blm[i][j].time; }
        }
    }
    return blm;
}

export function countFollowers(blm: IBlmEntity[][]): IBlmEntity[][] {
    const blmLineLength = blm.length;
    let followers: number[] = [];
    for (let i = 0; i < blmLineLength; i++) {
        for (let j = 0; j < lineHeight; j++) {
            if (blm[i][j].isExist) {
                followers = [];
                followers.push(blm[i][j].id);
                for (let x = i; x < blmLineLength; x++) {
                    for (let y = 0; y < lineHeight; y++) {
                        if (includes(followers, blm[x][y].id)) {
                            if (blm[x][y].next.top) {followers.push(blm[x + 1][y - 1].id); }
                            if (blm[x][y].next.middle) {followers.push(blm[x + 1][y].id); }
                            if (blm[x][y].next.bottom) {followers.push(blm[x + 1][y + 1].id); }
                        }
                    }
                }
                blm[i][j].nof = uniq(followers).length - 1;
            }
        }
    }
    return blm;
}

export function measureWeight(blm: IBlmEntity[][]): IBlmEntity[][] {
    const blmLineLength = blm.length;
    let maxTime: number;
    for (let i = blmLineLength - 1; i >= 0; i--) {
        for (let j = 0; j < lineHeight; j++) {
            maxTime = 0;
            if (blm[i][j].next.top) {maxTime = blm[i + 1][j - 1].rpw; }
            if (blm[i][j].next.middle) {
                if (maxTime < blm[i + 1][j].rpw) {
                    maxTime = blm[i + 1][j].rpw;
                }
            }
            if (blm[i][j].next.bottom) {
                if (maxTime < blm[i + 1][j + 1].rpw) {
                    maxTime = blm[i + 1][j + 1].rpw;
                }
            }
            blm[i][j].rpw = maxTime + blm[i][j].time;
        }
    }
    return blm;
}

export function countElements(blm: IBlmEntity[][]): number {
    let counter: number = 0;
    const blmLineLength = blm.length;
    for (let i = 0; i < blmLineLength; i++) {
        for (let j = 0; j < lineHeight; j++) {
            if (blm[i][j].isExist) {counter++; }
        }
    }
    return counter;
}

export function createNewElement(blm: IBlmEntity[][], i: number, j: number): IBlmEntity[][] {
    blm[i][j].isExist = true;
    return blm;
}
