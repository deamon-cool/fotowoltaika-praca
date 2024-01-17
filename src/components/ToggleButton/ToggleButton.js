import React from 'react';

import classes from './ToggleButton.module.css';

function ToggleButton(props) {
    let className = classes.ToggleButton;
    if (props.clicked) {
        className = [classes.ToggleButton, classes.Clicked].join(' ');
    }

    return (
        <button
            style={props.customStyle}
            className={className}
            type={props.ToggleButtonType}
            onClick={props.clickHandler}>
            {props.children}
        </button>
    );
}

export default ToggleButton;