import React from 'react';

import classes from './PopUpWindow.module.css';
import BlackBackground from '../BlackBackground/BlackBackground';
import Button from '../Button/Button';

function PopUpWindow(props) {
    let popUpWindow = null;

    if (props.show) {
        popUpWindow = (
            <>
                <BlackBackground
                    show={props.show}
                    clickHandler={props.clickToHideHandler} />
                <div className={classes.PopUpWindow}>
                    <h3>{props.children}</h3>
                    <div className={classes.Buttons}>
                        <Button
                            customStyle={{width: '100px', marginRight: '100px'}}
                            clickHandler={props.noHandler}>
                            NIE
                        </Button>
                        <Button
                            customStyle={{width: '100px'}}
                            clickHandler={props.yesHandler}>
                            TAK
                        </Button>
                    </div>
                </div>
            </>
        );
    }

    return popUpWindow;
}

export default PopUpWindow;