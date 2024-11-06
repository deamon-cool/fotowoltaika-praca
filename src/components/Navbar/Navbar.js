import React from 'react';

import ImageButton from '../ImageButton/ImageButton';
import classes from './Navbar.module.css';
import { faHome, faBars } from '@fortawesome/free-solid-svg-icons';
import * as text from '../../text/text';

function Navbar(props) {
    return (
        <nav className={classes.Navbar}>
            <ImageButton
                icon={faHome}
                iconSize='2x'
                clickHandler={props.clickHomeHandler}
                hide={props.hideHomeButton} />
            <h1>{text.PAGE_TITLE}</h1>
            <ImageButton
                icon={faBars}
                iconSize='2x'
                clickHandler={props.clickBarsHandler} />
        </nav>
    );
}

export default Navbar;