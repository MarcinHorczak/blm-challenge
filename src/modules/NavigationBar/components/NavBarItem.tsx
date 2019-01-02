import * as React from 'react';

import { Icon, MenuItem, Typography } from '@material-ui/core';
import { isUndefined } from 'lodash';
import { Link } from 'react-router-dom';
import { T } from '../../FormattedText';

interface INavBarItemProps {
    link: string;
    name: string;
    disabled?: boolean;
}

export class NavBarItem extends React.Component<INavBarItemProps, {}> {
    public render() {
        const { disabled, link, name } = this.props;
        return(
            <Link to={link} className="nav-bar-drawer-item-link">
                <MenuItem disabled={!isUndefined(disabled)}>
                    <Icon>
                        {this.props.children}
                    </Icon>
                    <Typography
                        className="nav-bar-drawer-item-text"
                        variant="subheading"
                        color="secondary"
                    >
                        <T value={name}/>
                    </Typography>
                </MenuItem>
            </Link>
        );
    }
}
