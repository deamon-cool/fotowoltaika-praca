import React from 'react';

import classes from './Input.module.css';

function Input(props) {
    let warning
    if (props.warning !== '') {
        warning = <div className={classes.Warning}>{props.warning}</div>;
    }

    return (
        <div className={classes.InputContainer} style={{width: props.width}}>
            <input
                className={classes.Input}
                {...props.inputConfig}
                onChange={props.inputChange}
                value={props.inputVal} />
            {warning}
        </div>
    );
}

export default Input;