import React from 'react';
import classes from './BlackBackground.module.css';

function BlackBackground(props) {
    let background = null;

    if (props.show) {
        background = <div
            className={classes.BlackBackground}
            onClick={props.clickHandler}></div>;
    }

    return background;
}

export default BlackBackground;