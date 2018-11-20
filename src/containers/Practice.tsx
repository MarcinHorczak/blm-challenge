import * as React from 'react';

import { Grid, Typography } from '@material-ui/core';
import { get } from 'lodash';
import { BlmChart } from '../modules/BlmChart';
import { BlmGenerator } from '../modules/BlmGenerator';
import { IBlmEntity } from '../modules/BlmGenerator/model';
import { SelectAlgoritm, SelectCycleTime } from '../modules/BlmRanking';
import { EditableRanking } from '../modules/EditableRanking';
import { EditableTable } from '../modules/EditableTable';
import { IWagEntity } from '../modules/EditableTable/model';
import { T } from '../modules/FormattedText';
import { Validation } from '../modules/Validation';
import { numberOfMachines } from '../settings';

interface IPracticeState {
    blmModel: IBlmEntity[][];
    algoritm: string;
    cycleTime: number;
    wags: IWagEntity[];
    validations: string[];
    isWagTableFull: boolean;
    update: boolean;
}

export class Practice extends React.Component<{}, IPracticeState> {
    constructor(props: {}) {
        super(props);
        const wags: IWagEntity[] = [];
        for (let i = 0; i < numberOfMachines; i++) {
            wags[i] = {
                isCorrect: false,
                isError: false,
                wag: '_',
            };
        }
        this.state = {
            blmModel: [],
            algoritm: '',
            cycleTime: 12,
            wags,
            validations: [],
            isWagTableFull: false,
            update: false,
        };
    }

    public componentDidUpdate() {
        if (this.state.update && this.state.isWagTableFull) {
            this.validate();
            this.setState({ update: false });
        }
    }

    public render() {
        const { blmModel, algoritm, cycleTime, validations, isWagTableFull } = this.state;
        return (
            <Grid className="blm">
                <Grid item container>
                    <Typography variant="title">
                        <T value="practiceSection"/>
                    </Typography>
                </Grid>
                <BlmGenerator
                    blmModel={(blm: IBlmEntity[][]) => this.setState({ blmModel: blm })}
                    hidden={true}
                />
                <BlmChart blm={blmModel}/>
                <SelectAlgoritm
                    algoritm={algoritm}
                    setAlgoritm={(method: string) => this.setState({ algoritm: method, update: true })}
                />
                <SelectCycleTime
                    getTime={(time: number) => this.setState({ cycleTime: time })}
                    time={cycleTime}
                />
                <EditableTable
                    setWags={(wags: IWagEntity[], isFull: boolean) =>
                        this.setState({ wags, isWagTableFull: isFull, update: true })
                    }
                    wag={this.state.wags}
                    isFull={this.state.isWagTableFull}
                />
                <Validation
                    validation={validations}
                />
                <EditableRanking
                    algoritm={algoritm}
                    blmModel={blmModel}
                    visible={true ? algoritm !== '' && isWagTableFull : false}
                />
                {/* <WorkingStation/> */}
            </Grid>
        );
    }

    private validate() {
        const validations: string[] = [];
        if (this.state.algoritm === '') {
            validations.push('Please to select algoritm');
            this.setState({ validations });
        } else {
            this.checkSolution(this.state.algoritm);
        }
    }

    private checkSolution(algoritm: string) {
        let validations: string[] = [];
        const wags = {...this.state.wags};
        const table: number[] = [];
        let isError: boolean = false;
        this.state.blmModel.map((row: IBlmEntity[]) => {
            row.map((el: IBlmEntity) => {
                if (el.isExist) {
                    wags[el.id - 1].isError = false;
                    wags[el.id - 1].isCorrect = true;
                    if (this.state.wags[el.id - 1].wag !== get(el, algoritm.toLocaleLowerCase())) {
                        table.push(el.id);
                        wags[el.id - 1].isError = true;
                        isError = true;
                    }
                }
            });
        });
        validations = [];
        validations.push(`Discorrect ${algoritm} wag: ${table.join(', ')}`);
        if (!isError) {
            validations = [];
            validations.push('Correct!');
        }
        this.setState({ validations, wags });
    }
}
