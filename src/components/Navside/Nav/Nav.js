import React from 'react';

import ImageButton from '../../ImageButton/ImageButton';
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import classes from './Nav.module.css';

function Nav(props) {
    return (
        <div className={classes.Nav}>
            <h1>{props.title}</h1>
            <ImageButton
                icon={faTimes}
                iconSize='2x'
                clickHandler={props.clickCloseHandler} />
        </div>
    );
}

export default Nav;