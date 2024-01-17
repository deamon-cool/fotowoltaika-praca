import React from 'react';

import classes from './Info.module.css';

function Info(props) {
    return (
        <div
            className={classes.Info}
            style={props.customStyle}>
            {props.children}
        </div>
    );
}

export default Info;