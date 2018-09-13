import * as React from 'react';

import { Grid } from '@material-ui/core';
import { IBlmEntity } from '../../BlmGenerator/model';
import { Ranking } from './Ranking';
import { SelectAlgoritm } from './SelectAlgoritm';

interface IBlmRankingProps {
    blm: IBlmEntity[][];
}

interface IBlmRankingState {
    algoritm: string;
}

export class BlmRanking extends React.Component<IBlmRankingProps, IBlmRankingState> {
    constructor(props: IBlmRankingProps) {
        super(props);
        this.state = {
            algoritm: '',
        };
    }
    public render() {
        const { algoritm } = this.state;
        const { blm } = this.props;
        return(
            <Grid container>
                <SelectAlgoritm
                    algoritm={algoritm}
                    setAlgoritm={(method: string) => this.setState({ algoritm: method })}
                />
                <Ranking
                    algoritm={algoritm}
                    blm={blm}
                />
            </Grid>
        );
    }
}
