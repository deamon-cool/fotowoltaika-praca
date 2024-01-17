import React from 'react';

import classes from './Warning.module.css';

function Warning(props) {
    return (
        <div
            className={classes.Warning}
            style={props.customStyle}>
            {props.children}
        </div>
    );
}

export default Warning;