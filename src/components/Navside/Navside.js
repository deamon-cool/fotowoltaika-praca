import React from 'react';
import { Link } from 'react-router-dom';

import * as config from '../../config/config';
import classes from './Navside.module.css';
import BlackBackground from '../BlackBackground/BlackBackground';
import * as text from '../../text/text';
import Nav from './Nav/Nav';

function Navside(props) {
    let navside = null;

    if (props.show) {
        navside = (
            <>
                <BlackBackground
                    show={props.show}
                    clickHandler={props.clickToHideHandler} />
                <nav className={classes.Navside}>
                    <Nav
                        title={text.PAGE_TITLE}
                        clickCloseHandler={props.clickToHideHandler} />
                    <Link onClick={props.clickToHideHandler} to={config.INFORMATION_PATH_ROUTER}><li>{text.INFORMATION_TEXT}</li></Link>
                    <a href={config.FACEBOOK_SITE}><li>{text.FACEBOOK_TEXT}</li></a>
                    <Link onClick={props.clickToHideHandler} to={config.RULE_PATH_ROUTER}><li>{text.RULE_TEXT}</li></Link>
                    <Link onClick={props.clickToHideHandler} to={config.PRIVACY_PATH_ROUTER}><li>{text.PRIVACY_TEXT}</li></Link>
                    <Link onClick={props.clickToHideHandler} to={config.CANDIDATE_HELP_PATH_ROUTER}><li>{text.CANDIDATE_HELP_TEXT}</li></Link>
                    <Link onClick={props.clickToHideHandler} to={config.EMPLOYER_HELP_PATH_ROUTER}><li>{text.EMPLOYER_HELP_TEXT}</li></Link>
                    <Link onClick={props.clickToHideHandler} to={config.NEWAD_PATH_ROUTER}><li>{text.NEWAD_TEXT}</li></Link>
                    <Link onClick={props.clickToHideHandler} to={config.CONTACT_PATH_ROUTER}><li>{text.CONTACT_TEXT}</li></Link>
                </nav>
            </>
        );
    }

    return navside;
}

export default Navside;