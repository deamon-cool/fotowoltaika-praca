import React from 'react';

import classes from './ImageButton.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function ImageButton(props) {
    let styleClass = classes.ImageButton;

    if (props.hide) {
        styleClass = [classes.ImageButton, classes.Hide].join(' ');
    }

    return (
        <button
            style={props.customStyle}
            className={styleClass}
            onClick={props.clickHandler}>
            <FontAwesomeIcon
                icon={props.icon}
                color='black'
                size={props.iconSize} />
        </button>
    );
}

export default ImageButton;