import React from 'react';

import classes from './LinkButton.module.css';

function LinkButton(props) {
	return (
		<a
			style={props.customStyle}
			className={classes.LinkButton}
			href={props.link}
			target='blank'>
			{props.children}
		</a>
	);
}

export default LinkButton;