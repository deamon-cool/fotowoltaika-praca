import React from 'react';

import classes from './ImageViewer.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function ImageViewer(props) {
    return (
        <div className={classes.ImageViewer}>
            <button
                className={classes.Button}
                onClick={props.clickCloseHandler}>
                <FontAwesomeIcon
                    icon={props.icon}
                    color='black'
                    size={props.iconSize} />
            </button>
            <img
                className={classes.Image}
                src={props.imgSrc}
                alt='Obraz' >
            </img>
        </div>
    );
}

export default ImageViewer;