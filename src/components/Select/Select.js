import React from 'react';

import classes from './Select.module.css';

function Select(props) {
    let options = null;
    if (props.options.length > 0) {
        options = props.options.map(option => {
            return (
                <option key={option}
                    value={option}>
                    {option}
                </option>
            );
        });
    }

    return (
        <select style={props.customStyle}
            className={classes.Select}
            onChange={props.selectChange}
            value={props.value}>
            <option
                value=''
                disabled
                hidden>
                {props.placeholder}
            </option>
            {options}
        </select >
    );
}

export default Select;