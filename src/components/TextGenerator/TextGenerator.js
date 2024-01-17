import React, { useRef } from 'react';

import classes from './TextGenerator.module.css';
import Button from '../Button/Button';

function TextGenerator(props) {
	const textRef = useRef(null);

	// copy handler
	const copyHandler = () => {
		navigator.clipboard.writeText(textRef.current.value);
	}

	return (
		<div className={classes.Generator}>
			<h3 className={classes.TitleOfGenerator}>{props.title}</h3>
			<textarea className={classes.TextArea} ref={textRef} value={props.text} readOnly />
			<Button
				customStyle={{ width: '150px', margin: '10px' }}
				clickHandler={copyHandler}>
				Kopiuj treść
			</Button>
			<Button
				customStyle={{ width: '150px', margin: '10px' }}
				clickHandler={props.generateTextHandler}>
				{props.generateButtonText}
			</Button>
		</div>
	);
}

export default TextGenerator;