import * as React from 'react';

import { Button, Grid } from '@material-ui/core';
import { chunk } from 'lodash';
import { lineHeight } from '../../../settings';
import { T } from '../../FormattedText';
// import { SettingsMenu } from '../../SettingsMenu';
// import { blmGraphOptions } from '../../SettingsMenu/settings';
import { IBlmEntity } from '../model';
import {
    addRestOfElements,
    countFollowers,
    countImmediateFollowers,
    createEmptyArray,
    createMainLine,
    measureWeight,
    setDependedElements,
    setElementsIdAndTime,
    setOptimalLineLenght,
} from './functions';

interface IBlmGeneratorProps {
    blmModel: (blmModel: IBlmEntity[][]) => void;
    hidden?: boolean;
}

export class BlmGenerator extends React.Component<IBlmGeneratorProps, {}> {
    public componentDidMount() {
        this.generateBlmModel();
    }

    public render() {
        const { hidden } = this.props;
        return(
            <Grid container direction="row">
                {hidden
                ? null
                : <Grid container className="blm-generate-button">
                    <Button
                        onClick={() => this.generateBlmModel()}
                        color="primary"
                        variant="contained"
                    >
                        <T value="generateNewGraph"/>
                    </Button>
                </Grid>
                }
                {/* <SettingsMenu menuSettings={blmGraphOptions}/> */}
            </Grid>
        );
    }

    private generateBlmModel() {
        let blmGeneratedLength: number;
        let blm: IBlmEntity[][];

        blmGeneratedLength = setOptimalLineLenght();
        blm = chunk(createEmptyArray(blmGeneratedLength, 0), lineHeight);
        blm = createMainLine(blm);
        addRestOfElements(blm);
        blm = setElementsIdAndTime(blm);
        blm = setDependedElements(blm);
        blm = countImmediateFollowers(blm);
        blm = countFollowers(blm);
        blm = measureWeight(blm);

        this.props.blmModel(blm);
    }
}
