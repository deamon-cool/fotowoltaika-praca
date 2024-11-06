import React from 'react';

import classes from './CheckBox.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

function CheckBox(props) {
	let icon = null;
	if (props.clicked) {
		icon = (
			<FontAwesomeIcon
				icon={faCheck}
				color='black'
				size={props.iconSize} />
		);
	}

	return (
		<button
			style={props.customStyle}
			className={classes.CheckBox}
			onClick={props.clickHandler}>
			{icon}
		</button>
	);
}

export default CheckBox;