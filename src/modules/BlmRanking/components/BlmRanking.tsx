import * as React from 'react';

import { Grid } from '@material-ui/core';
import { defaultCycleTime } from '../../../settings';
import { IBlmEntity } from '../../BlmGenerator/model';
import { Ranking } from './Ranking';
import { SelectAlgoritm } from './SelectAlgoritm';
import { SelectCycleTime } from './SelectCycleTime';

interface IBlmRankingProps {
    blm: IBlmEntity[][];
    blmMinTime: number;
}

interface IBlmRankingState {
    algoritm: string;
    cycleTime: number;
    ranking: IBlmEntity[];
}

export class BlmRanking extends React.Component<IBlmRankingProps, IBlmRankingState> {
    constructor(props: IBlmRankingProps) {
        super(props);
        this.state = {
            algoritm: '',
            cycleTime: defaultCycleTime,
            ranking: [],
        };
    }

    public render() {
        const { blmMinTime } = this.props;
        const { algoritm, cycleTime } = this.state;
        // blmMinTime - validation
        const { blm } = this.props;
        return(
            <Grid item container className="blm-ranking">
                <SelectAlgoritm
                    algoritm={algoritm}
                    setAlgoritm={(method: string) => this.setState({ algoritm: method })}
                />
                <SelectCycleTime
                    getTime={(time: number) => this.setState({ cycleTime: time })}
                    time={cycleTime}
                    blmMinTime={blmMinTime}
                />
                <Ranking
                    algoritm={algoritm}
                    blm={blm}
                    blmMinTime={cycleTime}
                />
            </Grid>
        );
    }
}
