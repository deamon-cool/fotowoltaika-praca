import React from 'react';

import classes from './Button.module.css';

function Button(props) {
    return (
        <button
            style={props.customStyle}
            className={classes.Button}
            type={props.buttonType}
            onClick={props.clickHandler}>
            {props.children}
        </button>
    );
}

export default Button;