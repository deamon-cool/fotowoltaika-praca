import React from 'react';

import classes from './ImageUploader.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function ImageUploader(props) {
    const inputId = 'id-image-uploader';

    if (props.clicked) {
        document.getElementById(inputId).click();
    }

    let warning = null;
    if (props.warning !== '') {
        warning = <div className={classes.Warning}>{props.warning}</div>;
    }

    return (
        <div className={classes.ImageUploader}>
            <button
                className={classes.Button}
                onClick={props.clickHandler}>
                <FontAwesomeIcon
                    icon={props.icon}
                    color='black'
                    size={props.iconSize} />
            </button>
            <div className={classes.Info}>
                *Kliknij, aby wstawić logo firmy
            </div>
            <input
                id={inputId}
                className={classes.InputFile}
                name='image'
                type='file'
                onChange={props.uploadImageHandler} />
            {warning}
        </div>
    );
}

export default ImageUploader;