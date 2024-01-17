import React from 'react';

import classes from './Information.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function Information(props) {
    let elements = <div>{props.description}</div>;
    if (props.isList) {
        let stringArray = props.description.split('$');
        elements = stringArray.map((item, i) => {
            const [quote, answer] = item.split('>>>');
            return <li key={i}><b>{i + 1}. {quote}</b> {answer}</li>;
        });
    }

    let returnElement = null;
    if (props.retrunHandler) {
        returnElement = (
            <FontAwesomeIcon
                className={classes.Return}
                icon={faArrowLeft}
                color='gray'
                size='3x'
                onClick={props.retrunHandler} />
        );
    }

    return (
        <div className={classes.Information} style={props.customStyle}>
            {returnElement}
            <h3>{props.title}</h3>
            {props.children}
            {elements}
        </div>
    );
}

export default Information;
