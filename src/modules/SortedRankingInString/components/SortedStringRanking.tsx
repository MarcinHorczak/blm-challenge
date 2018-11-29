import * as React from 'react';

import { Grid, Toolbar, Typography } from '@material-ui/core';
import { IBlmEntity } from '../../BlmGenerator/model';

interface ISortedStringRanking {
    hidden?: boolean;
    algoritm: string;
    blm: IBlmEntity[];
    disableStrikethrough: boolean;
}

export class SortedStringRanking extends React.Component<ISortedStringRanking, {}> {
    public render() {
        const { algoritm, blm, hidden, disableStrikethrough } = this.props;
        return (
            <Grid container item>
                {hidden
                    ? null
                    : <Toolbar>
                        <Typography>
                            {algoritm}: [{blm.map((element: IBlmEntity, i: number) => {
                                return (
                                    <span
                                        key={i}
                                        className={
                                            disableStrikethrough
                                                ? 'string-ranking-element'
                                                : element.isSetted
                                                    ? 'string-ranking-element string-ranking-element-strikethrough'
                                                    : 'string-ranking-element'
                                        }
                                    >
                                        {element.id}
                                    </span>
                                );
                            })}]
                        </Typography>
                    </Toolbar>
                }
            </Grid>
        );
    }
}
